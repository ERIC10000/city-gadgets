import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { SupabaseRequiredNotice } from "@/components/ui/SupabaseRequiredNotice";
import { getCurrentUser } from "@/lib/data/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-16 md:px-gutter">
        <SupabaseRequiredNotice feature="the vendor CMS" />
      </div>
    );
  }

  const current = await getCurrentUser();
  if (!current) redirect("/login");

  // Role gate — only vendors and admins can reach the CMS.
  if (current.profile.role !== "vendor" && current.profile.role !== "admin") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-margin-mobile py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary-container/40 text-tertiary">
          <Icon name="lock" className="text-3xl" />
        </span>
        <h1 className="text-xl font-bold text-on-surface">Vendor access required</h1>
        <p className="text-body-sm text-on-surface-variant">
          Your account is a customer account. To manage products and video inspiration, your role must be set to{" "}
          <code className="rounded bg-surface-container-highest px-1.5 py-0.5 text-badge-text">vendor</code> in the
          Supabase <code className="rounded bg-surface-container-highest px-1.5 py-0.5 text-badge-text">profiles</code>{" "}
          table. See the README for how to promote a vendor account.
        </p>
        <Link href="/" className="rounded-xl bg-primary px-6 py-3 font-bold text-on-primary hover:opacity-90">
          Back to Storefront
        </Link>
      </div>
    );
  }

  const initial = (current.profile.full_name ?? current.email ?? "V").slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-surface-off-white md:flex-row">
      <VendorSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="hidden items-center justify-between gap-4 border-b border-outline-variant bg-white px-6 py-3 md:flex">
          <p className="text-body-sm text-on-surface-variant">
            <span className="font-bold text-on-surface">Vendor Studio</span> · Manage your City Gadgets store
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-outline-variant px-4 py-1.5 text-body-sm font-semibold text-on-surface transition-colors hover:border-on-surface"
            >
              <Icon name="storefront" className="text-[16px]" />
              View store
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container font-extrabold text-on-primary-container">
                {initial}
              </span>
              <div className="leading-tight">
                <p className="text-body-sm font-bold text-on-surface">{current.profile.full_name ?? "Vendor"}</p>
                <p className="text-badge-text text-on-surface-variant">{current.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
