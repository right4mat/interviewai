import supabase from "./_supabase";

// Define types for database entities
interface User {
  id: string;
  [key: string]: any;
}

interface Customer {
  id: string;
  stripeCustomerId?: string;
  [key: string]: any;
}

interface SupabaseResponse {
  data: any;
  error: any;
}

/**** USERS ****/

// Get user by uid
function getUser(uid: string): Promise<User> {
  return Promise.resolve(
    supabase.from("users").select("*").eq("id", uid).single().then(handle)
  );
}

// Get customer by uid
function getCustomer(uid: string): Promise<Customer | null> {
  return Promise.resolve(
    supabase
      .from("customers")
      .select()
      .eq("id", uid)
      .maybeSingle()
      .then(handle)
  );
}

// Get customer by Stripe customer ID
function getCustomerByStripeCid(id: string): Promise<Customer> {
  return Promise.resolve(
    supabase
      .from("customers")
      .select()
      .eq("stripeCustomerId", id)
      .single()
      .then(handle)
  );
}

// Create a new customer
function createCustomer(id: string, data: Partial<Customer>): Promise<any> {
  return Promise.resolve(
    supabase
      .from("customers")
      .insert([{ id, ...data }])
      .then(handle)
  );
}

// Update customer by Stripe customer ID
function updateCustomerByStripeCid(id: string, data: Partial<Customer>): Promise<any> {
  return Promise.resolve(
    supabase
      .from("customers")
      .update(data)
      .eq("stripeCustomerId", id)
      .then(handle)
  );
}

/**** HELPERS ****/

// Get response data or throw error if there is one
function handle(response: SupabaseResponse): any {
  if (response.error) throw response.error;
  return response.data;
}

export {
  getUser,
  getCustomer,
  getCustomerByStripeCid,
  createCustomer,
  updateCustomerByStripeCid,
};
