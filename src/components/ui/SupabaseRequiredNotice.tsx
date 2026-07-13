import { Icon } from "@/components/ui/Icon";

export function SupabaseRequiredNotice({ feature }: { feature: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl bg-surface-container-low px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon name="cloud_off" className="text-3xl" />
      </span>
      <div>
        <h2 className="font-bold text-on-surface">Connect Supabase to enable {feature}</h2>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          This is a fully built feature — it just needs a Supabase project. Add{" "}
          <code className="rounded bg-surface-container-highest px-1.5 py-0.5 text-badge-text">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-surface-container-highest px-1.5 py-0.5 text-badge-text">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to <code className="rounded bg-surface-container-highest px-1.5 py-0.5 text-badge-text">.env.local</code>{" "}
          and run the migration in <code className="rounded bg-surface-container-highest px-1.5 py-0.5 text-badge-text">supabase/migrations</code>.
          See the README for step-by-step setup.
        </p>
      </div>
    </div>
  );
}
