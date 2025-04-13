import { createClient } from "@supabase/supabase-js";

// Define the type for the Supabase URL and key
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string;

// Create the Supabase client with proper typing
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the typed Supabase client
export default supabase;
