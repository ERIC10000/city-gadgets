import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { ProfileForm } from "@/components/account/ProfileForm";
import { signOut } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/data/auth";

export const metadata: Metadata = { title: "Account Settings" };

export default async function SettingsPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Account Settings</h1>
        <p className="text-on-surface-variant">{current.email}</p>
      </div>

      <ProfileForm fullName={current.profile.full_name ?? ""} phone={current.profile.phone ?? ""} />

      <form action={signOut} className="md:hidden">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-error py-3 font-bold text-error hover:bg-error-container"
        >
          <Icon name="logout" />
          Log Out
        </button>
      </form>
    </div>
  );
}
