import { Icon } from "@/components/ui/Icon";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Categories</h1>
          <p className="text-on-surface-variant">Manage your store's product categories.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-on-primary hover:opacity-90">
          <Icon name="add" />
          Add Category
        </button>
      </div>
      <div className="rounded-xl bg-surface p-8 shadow-card text-center">
        <Icon name="category" className="text-4xl text-outline mb-4" />
        <h3 className="text-lg font-bold">Manage Categories</h3>
        <p className="text-on-surface-variant">Your category list will appear here.</p>
      </div>
    </div>
  );
}
