import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { SupabaseRequiredNotice } from "@/components/ui/SupabaseRequiredNotice";
import { signUp } from "@/lib/actions/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-margin-mobile py-16">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-on-surface">Create Your Account</h1>
      <p className="mb-8 text-center text-on-surface-variant">Join City Gadgets for faster checkout and order tracking.</p>
      {isSupabaseConfigured() ? (
        <>
          <AuthForm mode="signup" action={signUp} />
          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <SupabaseRequiredNotice feature="account creation" />
      )}
    </div>
  );
}
