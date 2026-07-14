import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { getCurrentUser } from "@/lib/data/auth";
import { createClient } from "@/lib/supabase/server";
import { addAddress, deleteAddress } from "@/lib/actions/addresses";
import type { Address } from "@/lib/types";

export const metadata: Metadata = { title: "Shipping Addresses" };

export default async function AddressesPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("addresses").select("*").eq("user_id", current.profile.id);
  const addresses = (data as Address[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Shipping Addresses</h1>
        <p className="text-on-surface-variant">Manage where we deliver your orders.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="rounded-2xl bg-surface-container-lowest p-5 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold text-on-surface">{address.label || "Address"}</span>
              <form action={deleteAddress}>
                <input type="hidden" name="id" value={address.id} />
                <button type="submit" className="text-on-surface-variant hover:text-error" aria-label="Delete address">
                  <Icon name="delete" className="text-[18px]" />
                </button>
              </form>
            </div>
            <p className="text-body-sm text-on-surface-variant">{address.line1}</p>
            <p className="text-body-sm text-on-surface-variant">{address.city}</p>
            {address.phone && <p className="mt-1 text-body-sm text-on-surface-variant">{address.phone}</p>}
          </div>
        ))}
      </div>

      <div className="max-w-md rounded-2xl bg-surface-container-low p-6">
        <h2 className="mb-4 font-bold text-on-surface">Add New Address</h2>
        <form action={addAddress} className="space-y-3">
          <input name="label" placeholder="Label (e.g. Home, Office)" className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none" />
          <input name="line1" required placeholder="Street address" className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none" />
          <input name="city" required placeholder="City" className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none" />
          <input name="phone" placeholder="Phone number" className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none" />
          <button type="submit" className="w-full rounded-xl bg-primary py-3 font-bold text-on-primary hover:opacity-90">
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}
