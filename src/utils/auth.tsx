"use client";
import React, { useState, useEffect, useMemo, useContext, createContext } from "react";
import queryString from "query-string";
import supabase from "./supabase";
import { useUser, updateUser } from "./db";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/shared/Loader";
import analytics from "./analytics";
import { type User } from "@supabase/supabase-js";
import { type Provider } from "@supabase/supabase-js";
import { AFTER_AUTH_PATH } from "@/path";

// Whether to merge extra user data from database into `auth.user`
const MERGE_DB_USER = true;

// Whether to connect analytics session to `user.uid`
const ANALYTICS_IDENTIFY = true;

// Define types for our auth context
interface AuthContextType {
  user: UserWithCustomData | null | false;
  isPending: boolean;
  error: Error | null;
  signup: (email: string, password: string) => Promise<User>;
  signin: (email: string, password: string) => Promise<User>;
  signinWithProvider: (name: Provider) => Promise<any>;
  signinWithMagicLink: (email: string) => Promise<any>;
  signout: () => Promise<any>;
  sendPasswordResetEmail: (email: string) => Promise<any>;
  confirmPasswordReset: (password: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  updateProfile: (data: Record<string, any>) => Promise<void>;
}

// Define types for user data
interface CustomerData {
  stripePriceId?: string;
  stripeSubscriptionStatus?: string;
  [key: string]: any;
}

interface UserWithCustomData extends User {
  uid: string;
  providers: string[];
  planId?: string;
  planIsActive?: boolean;
  customers?: CustomerData;
  name?: string;
  [key: string]: any;
}

// Create a `useAuth` hook and `AuthProvider` that enables
// any component to subscribe to auth and re-render when it changes.
const authContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(authContext);

// This should wrap the app in `src/pages/_app.js`
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that creates the `auth` object and handles state
// This is called from `AuthProvider` above (extracted out for readability)
function useAuthProvider(): AuthContextType {
  // Store auth user in state
  // `user` will be object, `null` (loading) or `false` (logged out)
  const [user, setUser] = useState<User | null | false>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Merge extra user data from the database
  // This means extra user data (such as payment plan) is available as part
  // of `auth.user` and doesn't need to be fetched separately. Convenient!
  let finalUser = useMergeExtraData(user, { enabled: MERGE_DB_USER });

  // Add custom fields and formatting to the `user` object
  finalUser = useFormatUser(finalUser) as UserWithCustomData;

  // Connect analytics session to user
  useIdentifyUser(finalUser as UserWithCustomData, { enabled: ANALYTICS_IDENTIFY });

  // Handle response from auth functions (`signup`, `signin`, and `signinWithProvider`)
  const handleAuth = async (response: any) => {
    const {
      data: { user }
    } = response;

    // If email is unconfirmed throw error to be displayed in UI
    // The user will be confirmed automatically if email confirmation is disabled in Supabase settings
    if (!user.email_confirmed_at) {
      throw new Error("Thanks for signing up! Please check your email to complete the process.");
    }

    // Update user in state
    setUser(user);
    return user;
  };

  const signup = async (email: string, password: string) => {
    setIsPending(true);
    setError(null);
    try {
      const user = await supabase.auth.signUp({ email, password }).then(handleError).then(handleAuth);
      return user;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const signin = async (email: string, password: string) => {
    setIsPending(true);
    setError(null);
    try {
      const user = await supabase.auth.signInWithPassword({ email, password }).then(handleError).then(handleAuth);
      return user;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const signinWithProvider = async (name: Provider) => {
    setIsPending(true);
    setError(null);
    try {
      return await supabase.auth
        .signInWithOAuth({
          provider: name,
          options: {
            redirectTo: `${window.location.origin}/app`
          }
        })
        .then(handleError)
        .then(() => {
          return new Promise(() => null);
        });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const signinWithMagicLink = async (email: string) => {
    setIsPending(true);
    setError(null);
    try {
      return await supabase.auth
        .signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/app`
          }
        })
        .then(handleError);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const signout = async () => {
    setIsPending(true);
    setError(null);
    try {
      return await supabase.auth.signOut().then(handleError);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    setIsPending(true);
    setError(null);
    try {
      return await supabase.auth
        .resetPasswordForEmail(email, {
          //redirectTo: `${window.location.origin}/auth/changepass`
        })
        .then(handleError);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const confirmPasswordReset = async (password: string) => {
    setIsPending(true);
    setError(null);
    try {
      return await supabase.auth.updateUser({ password }).then(handleError);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsPending(true);
    setError(null);
    try {
      return await supabase.auth.updateUser({ password }).then(handleError);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  // Update auth user and persist data to database
  // Call this function instead of multiple auth/db update functions
  const updateProfile = async (data: Record<string, any>) => {
    setIsPending(true);
    setError(null);
    try {
      const { email, ...other } = data;

      if (!user) {
        throw new Error("User must be logged in to update profile");
      }

      // If email changed let them know to click the confirmation links
      // Will be persisted to the database by our Supabase trigger once process is completed
      if (email && email !== user.email) {
        await supabase.auth.updateUser({ email }).then(handleError);
        throw new Error("To complete this process click the confirmation links sent to your new and old email addresses");
      }

      // Persist all other data to the database
      if (Object.keys(other).length > 0) {
        await updateUser(user.id, other);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    // Get hash portion of URL if coming from Supabase OAuth or magic link flow.
    // Store on `window` so we can access in other functions after hash is removed.
    const parsedHash = queryString.parse(window.location.hash);
    // Safely add to window object
    (window as any).lastHash = parsedHash;

    // If we have an `access_token` from OAuth or magic link flow avoid using
    // cached session so that user is `null` (loading state) until process completes.
    // Otherwise, a redirect to a protected page after social auth will redirect
    // right back to login due to cached session indicating they are logged out.
    if (!(window as any).lastHash.access_token) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(false);
        }
      });
    }

    // Subscribe to user on mount
    const {
      data: {
        subscription: { unsubscribe }
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(false);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  return {
    user: finalUser as UserWithCustomData,
    isPending,
    error,
    signup,
    signin,
    signinWithProvider,
    signinWithMagicLink,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    updatePassword,
    updateProfile
  };
}

function useFormatUser(user: User | null | false): UserWithCustomData | null | false {
  // Memoize so returned object has a stable identity
  return useMemo(() => {
    // Return if auth user is `null` (loading) or `false` (not authenticated)
    if (!user) return user;

    // Create an array of user's auth providers by id (["password", "google", etc])
    // Components can read this to prompt user to re-auth with the correct provider
    let provider = user.app_metadata.provider;
    // Supabase calls it "email", but our components expect "password"
    if (provider === "email") provider = "password";
    const providers = [provider];

    // Get customer data
    const customer = (user as any).customers || {};

    return {
      // Include full auth user data
      ...user,
      // Alter the names of some fields
      uid: user.id,
      // User's auth providers
      providers: providers,
      // Add customer data
      ...customer,
      // Add `planId` (starter, pro, etc) based on Stripe Price ID
      ...(customer.stripePriceId && {
        planId: customer.stripePriceId
      }),
      // Add `planIsActive: true` if subscription status is active or trialing
      planIsActive: ["active", "trialing"].includes(customer.stripeSubscriptionStatus)
    };
  }, [user]);
}

function useMergeExtraData(user: User | null | false, { enabled }: { enabled: boolean }): User | null | false {
  // Get extra user data from database
  const { data, status, error } = useUser(enabled && user ? user.id : null);

  // Memoize so returned object has a stable identity
  return useMemo(() => {
    // If disabled or no auth user (yet) then just return
    if (!enabled || !user) return user;

    switch (status) {
      case "success":
        // If successful, but `data` is `null`, that means user just signed up and the `createUser`
        // function hasn't populated the db yet. Return `null` to indicate auth is still loading.
        // The above call to `useUser` will re-render things once the data comes in.
        if (data === null) return null;
        // Return auth `user` merged with extra user `data`
        return { ...user, ...data };
      case "error":
        // Uh oh.. Let's at least show a helpful error.
        throw new Error(`
          Error: ${error.message}
          This happened while attempting to fetch extra user data from the database
          to include with the authenticated user. Make sure the database is setup or
          disable merging extra user data by setting MERGE_DB_USER to false.
        `);
      default:
        // We have an `idle` or `loading` status so return `null`
        // to indicate that auth is still loading.
        return null;
    }
  }, [user, enabled, data, status, error]);
}

// Connect analytics session to current user
function useIdentifyUser(user: UserWithCustomData | null | false, { enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (user && enabled) {
      analytics.identify(user.uid);
    }
  }, [user, enabled]);
}

// A Higher Order Component for requiring authentication
export const requireAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function RequireAuthHOC(props: P) {
    // Get authenticated user
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Redirect if not signed in
      if (auth?.user === false) {
        router.replace("/auth/signin");
      }
    }, [auth]);

    // Show loading indicator
    // We're either loading (user is `null`) or about to redirect from above `useEffect` (user is `false`)
    if (!auth.user) {
      return <PageLoader />;
    }

    // Render component now that we have user
    return <Component {...props} />;
  };
};
// Throw error from auth response
// so it can be caught and displayed by UI
function handleError(response: any) {
  console.log("handleError", response);
  if (response.error) throw response.error;
  return response;
}
