import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/env";
import { APEX_HOST, CANONICAL_HOST } from "@/lib/site";

type HostAction = "ok" | "redirect" | "noindex";

/**
 * Decides how to treat the request's host.
 *
 * Three public hosts currently serve this shop: the canonical www domain, the
 * apex (which should always redirect), and *.vercel.app — a full duplicate of
 * the catalogue that was crawlable with `Allow: /`. Localhost and any custom
 * host are left alone.
 */
function resolveHost(host: string | null): HostAction {
  if (!host) return "ok";
  const hostname = host.split(":")[0].toLowerCase();

  if (hostname === APEX_HOST) return "redirect";
  if (hostname.endsWith(".vercel.app")) return "noindex";
  return "ok";
}

export async function proxy(request: NextRequest) {
  const hostAction = resolveHost(request.headers.get("host"));

  // The apex 308s to www at the DNS layer already, but doing it here too means
  // the app never serves a page on a host it doesn't consider canonical.
  if (hostAction === "redirect") {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next({ request });

  // Vercel hosts serve an identical copy of the shop. Redirecting them would
  // break preview deployments for QA, so they stay reachable but are kept out
  // of the index instead.
  if (hostAction === "noindex") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Refreshes the auth session cookie so Server Components always see a
  // valid session (required by @supabase/ssr's cookie-based auth flow).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
