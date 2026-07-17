import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { getCategories } from "@/lib/data/categories";
import { createCategory, deleteCategory } from "@/lib/actions/categories";

export const metadata: Metadata = { title: "Categories" };

const ICON_OPTIONS = [
  "smartphone", "laptop", "headphones", "watch", "camera_alt", "speaker",
  "tablet", "router", "cable", "power", "devices", "computer",
  "keyboard", "mouse", "monitor", "gamepad", "tv",
];

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Categories</h1>
          <p className="text-on-surface-variant">Manage product categories shown on the storefront.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Category List */}
        <div className="lg:col-span-3">
          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
            <table className="w-full text-left">
              <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
                <tr>
                  <th className="px-5 py-4 font-semibold">Icon</th>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Slug</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-5 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-on-surface">{cat.name}</td>
                    <td className="px-5 py-3 font-mono text-body-sm text-on-surface-variant">{cat.slug}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <form action={deleteCategory}>
                          <input type="hidden" name="id" value={cat.id} />
                          <button
                            type="submit"
                            title="Delete"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
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
        </div>

        {/* Add Category Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
            <h2 className="mb-4 font-bold text-on-surface">Add New Category</h2>
            <form action={createCategory} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-body-sm font-semibold text-on-surface-variant">
                  Category Name *
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Smart Home"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-body-sm font-semibold text-on-surface-variant">
                  Icon Name
                </label>
                <select
                  name="icon"
                  defaultValue="devices"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-body-sm font-semibold text-on-surface-variant">
                  Hero Tagline
                </label>
                <input
                  name="hero_tagline"
                  placeholder="e.g. Automate your world"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-body-sm font-semibold text-on-surface-variant">
                  Hero Image URL
                </label>
                <input
                  name="hero_image"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-on-primary hover:opacity-90 transition-opacity"
              >
                <Icon name="add" />
                Create Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
