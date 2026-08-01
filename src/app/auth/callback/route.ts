import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth (Google / Facebook) return endpoint. The provider redirects here with
 * a `code`; we exchange it for a session cookie, then send the user on to
 * wherever they were headed (`next`, defaulting to their account).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";
  const error = url.searchParams.get("error_description") ?? url.searchParams.get("error");

  // Redirect target must be same-origin; strip anything that isn't a local path.
  const safeNext = next.startsWith("/") ? next : "/account";
  const origin = url.origin;

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`);
  }

  return NextResponse.redirect(`${origin}/login`);
}
