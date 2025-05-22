import { NextRequest, NextResponse } from 'next/server';
import supabase from './_supabase';
import type { User } from '@supabase/supabase-js';



// Define handler function type
type HandlerFunction = (req: NextRequest, user: User) => Promise<NextResponse>;

// Middleware for requiring authentication and getting user
const requireAuth = (fn: HandlerFunction) => async (req: NextRequest): Promise<NextResponse> => {
  // Get authorization header
  const authHeader = req.headers.get('authorization');

  // Respond with error if no authorization header
  if (!authHeader) {
    return NextResponse.json(
      {
        status: "error",
        message: "You must be signed in to call this endpoint",
      },
      { status: 401 }
    );
  }

  // Get access token from authorization header ("Bearer: xxxxxxx")
  const accessToken = authHeader.split(" ")[1];

  try {
    // Get user from token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    // Throw error if there is one
    if (error) throw error;

    // Call route function passed into this middleware
    return fn(req, user as User);
  } catch (error) {
    console.log("_require-auth error", error);

    // If there's an error assume token is expired and return
    // auth/invalid-user-token error (handled by apiRequest in util.js)
    return NextResponse.json(
      {
        status: "error",
        code: "auth/invalid-user-token",
        message: "Your login has expired. Please login again.",
      },
      { status: 401 }
    );
  }
};

export default requireAuth;
