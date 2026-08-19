import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getVendorGuides } from "@/lib/data/guides";
import { deleteGuide } from "@/lib/actions/guides";

export const metadata: Metadata = { title: "Buying Guides" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export default async function VendorGuidesPage() {
  const guides = await getVendorGuides();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Buying Guides</h1>
          <p className="text-on-surface-variant">Publish SEO guides that pull search traffic and funnel it to products.</p>
        </div>
        <Link
          href="/vendor/guides/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary hover:opacity-90"
        >
          <Icon name="add" />
          New Guide
        </Link>
      </div>

      {guides.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest py-20 text-center shadow-card">
          <Icon name="menu_book" className="text-4xl text-on-surface-variant" />
          <p className="font-bold text-on-surface">No guides yet</p>
          <p className="max-w-md text-body-sm text-on-surface-variant">
            The site already ships with built-in guides. Anything you add here appears alongside them at{" "}
            <span className="font-semibold">/guides</span>.
          </p>
          <Link href="/vendor/guides/new" className="text-body-sm font-bold text-primary hover:underline">
            Write your first guide
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
              <tr>
                <th className="px-5 py-4 font-semibold">Guide</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Updated</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {guides.map((g) => (
                <tr key={g.id}>
                  <td className="px-5 py-4">
                    <span className="line-clamp-1 font-semibold text-on-surface">{g.title}</span>
                    <span className="text-badge-text text-on-surface-variant">/guides/{g.slug}</span>
                  </td>
                  <td className="px-5 py-4 capitalize text-on-surface-variant">{g.category_slug}</td>
                  <td className="px-5 py-4 text-on-surface-variant">{formatDate(g.updated_at)}</td>
                  <td className="px-5 py-4">
                    {g.status === "published" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-badge-text font-bold text-on-secondary-container">
                        <Icon name="visibility" className="text-[13px]" /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-price-gold/15 px-2.5 py-1 text-badge-text font-bold text-price-gold">
                        <Icon name="visibility_off" className="text-[13px]" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/guides/${g.slug}`}
                        target="_blank"
                        title="View"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                      >
                        <Icon name="open_in_new" className="text-[20px]" />
                      </Link>
                      <Link
                        href={`/vendor/guides/${g.id}`}
                        title="Edit"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                      >
                        <Icon name="edit" className="text-[20px]" />
                      </Link>
                      <form action={deleteGuide}>
                        <input type="hidden" name="id" value={g.id} />
                        <button
                          type="submit"
                          title="Delete"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error"
                        >
                          <Icon name="delete" className="text-[20px]" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
