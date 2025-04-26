import {
  useQuery,
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";
import supabase from "./supabase";
import { ReactNode } from "react";

// React Query client with configuration
const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
      retry: 2, // Retry failed requests 2 times
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: true, // Refetch on component mount
      refetchOnReconnect: true, // Refetch when reconnecting
    },
    mutations: {
      retry: 2, // Retry failed mutations 2 times
    },
  },
});


/**** USERS ****/

// Fetch user data
// Note: This is called automatically in `auth.js` and data is merged into `auth.user`
export function useUser(uid: string | null) {
  // Manage data fetching with React Query: https://react-query.tanstack.com/overview
  return useQuery({
    // Unique query key: https://react-query.tanstack.com/guides/query-keys
    queryKey: ["user", { uid }],
    // Query function that fetches data
    queryFn: () =>
      supabase
        .from("users")
        .select(`*, customers ( * )`)
        .eq("id", uid)
        .single()
        .then(handle),
    // Only call query function if we have a `uid`
    enabled: !!uid
  });
}

// Fetch user data (non-hook)
// Useful if you need to fetch data from outside of a component
export function getUser(uid: string) {
  return supabase
    .from("users")
    .select(`*, customers ( * )`)
    .eq("id", uid)
    .single()
    .then(handle);
}

// Get authenticated user data
export function getAuthUser() {
  return supabase.auth.getUser()
    .then(({ data }) => {
      if (data?.user) {
        return data?.user;
      }
      return null;
    });
}

// Update an existing user
export async function updateUser(uid: string, data: Record<string, any>) {
  const response = await supabase
    .from("users")
    .update(data)
    .eq("id", uid)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries({ queryKey: ["user", { uid }] });
  return response;
}

// Logout user
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // Clear any user-related queries from the cache
  await client.invalidateQueries({ queryKey: ["user"] });
  return true;
}

/**** ITEMS ****/
/* Example query functions (modify to your needs) */

// Fetch item data
export function useItem(id: string) {
  return useQuery({
    queryKey: ["item", { id }],
    queryFn: () => supabase.from("items").select().eq("id", id).single().then(handle),
    enabled: !!id
  });
}

// Fetch all items by owner
export function useItemsByOwner(owner: string) {
  return useQuery({
    queryKey: ["items", { owner }],
    queryFn: () =>
      supabase
        .from("items")
        .select()
        .eq("owner", owner)
        .order("createdAt", { ascending: false })
        .then(handle),
    enabled: !!owner
  });
}

// Create a new item
export async function createItem(data: Record<string, any>) {
  const response = await supabase.from("items").insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries({ queryKey: ["items"] });
  return response;
}

// Update an item
export async function updateItem(id: string, data: Record<string, any>) {
  const response = await supabase
    .from("items")
    .update(data)
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries({ queryKey: ["item", { id }] }),
    client.invalidateQueries({ queryKey: ["items"] }),
  ]);
  return response;
}

// Delete an item
export async function deleteItem(id: string) {
  const response = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries({ queryKey: ["item", { id }] }),
    client.invalidateQueries({ queryKey: ["items"] }),
  ]);
  return response;
}

/**** HELPERS ****/

// Get response data or throw error if there is one
function handle(response: any) {
  if (response.error) throw response.error;
  return response.data;
}

// React Query context provider that wraps our app
export function QueryClientProvider(props: { children: ReactNode }) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  );
}
