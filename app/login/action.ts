"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const errorMessage = encodeURIComponent(
      error.message || "Email verification failed"
    );
    redirect(`/login?error=${errorMessage}`);
  }

  // Get user type from database to determine redirect
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_type")
    .eq("email", data.email)
    .single();

  if (userError || !userData) {
    console.warn("No user found with email:", data.email, userError);
    const errorMessage = encodeURIComponent(
      "User profile not found. Please contact administrator."
    );
    redirect(`/login?error=${errorMessage}`);
  }

  // Redirect based on user type
  if (userData.user_type === "Admin") {
    revalidatePath("/admin", "layout");
    redirect("/admin");
  } else {
    revalidatePath("/dashboard", "layout");
    redirect("/dashboard");
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    const errorMessage = encodeURIComponent(error.message || "Sign up failed");
    redirect(`/login?error=${errorMessage}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
