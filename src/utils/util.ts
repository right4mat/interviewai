import { useRef, useEffect } from "react";
import supabase from "./supabase";

// Make an API request to `/api/{path}`
export async function apiRequest(path: string, method: string = "GET", data?: any): Promise<any> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session ? session.access_token : undefined;

  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response.json())
    .then((response) => {
      console.log('response',response);
      if (response.status === "error") {
        // Automatically signout user if accessToken is no longer valid
        if (response.code === "auth/invalid-user-token") {
          supabase.auth.signOut();
        }

        throw CustomError(response.code, response.message);
      } else {
        console.log('response.data',response.data);
        return response.data;
      }
    });
}

// Make an API request to any external URL
export function apiRequestExternal(url: string, method: string = "GET", data?: any): Promise<any> {
  return fetch(url, {
    method: method,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((response) => response.json());
}

// Create an Error with custom message and code
export function CustomError(code: string, message: string): Error {
  const error = new Error(message) as Error & { code?: string };
  error.code = code;
  return error;
}

// Hook that returns previous value of state
export function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
}

export const scrollToSection = (id: string): void => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
