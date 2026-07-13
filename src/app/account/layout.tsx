import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SupabaseRequiredNotice } from "@/components/ui/SupabaseRequiredNotice";
import { getCurrentUser } from "@/lib/data/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-16 md:px-gutter">
        <SupabaseRequiredNotice feature="accounts" />
      </div>
    );
  }

  const current = await getCurrentUser();
  if (!current) redirect("/login");

  return (
    <div className="mx-auto flex w-full max-w-container-max gap-10 px-margin-mobile py-8 md:px-gutter">
      <AccountSidebar loyaltyPoints={current.profile.loyalty_points} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
