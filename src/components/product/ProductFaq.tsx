import { Icon } from "@/components/ui/Icon";

/**
 * Visible, crawlable FAQ. The <summary> question is always rendered and the
 * answer stays in the DOM even while collapsed, so search engines read the
 * full keyword-rich text — no client JS required.
 */
export function ProductFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="mb-4 text-headline-lg font-bold text-on-surface">Frequently Asked Questions</h2>
      <div className="divide-y divide-outline-variant rounded-2xl border border-outline-variant bg-white">
        {faqs.map((faq) => (
          <details key={faq.q} className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-on-surface">
              {faq.q}
              <Icon name="expand_more" className="shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-1 pt-3 text-body-md leading-relaxed text-on-surface-variant">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
