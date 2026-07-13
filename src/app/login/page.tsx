import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { SupabaseRequiredNotice } from "@/components/ui/SupabaseRequiredNotice";
import { signIn } from "@/lib/actions/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-margin-mobile py-16">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-on-surface">Welcome Back</h1>
      <p className="mb-8 text-center text-on-surface-variant">Sign in to track orders and manage your account.</p>
      {isSupabaseConfigured() ? (
        <>
          <AuthForm mode="login" action={signIn} />
          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            New to City Gadgets?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </>
      ) : (
        <SupabaseRequiredNotice feature="sign-in" />
      )}
    </div>
  );
}
