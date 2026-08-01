import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders a Markdown product description — multiple paragraphs, headings,
 * lists, GFM tables, and FAQ-style sections. Raw HTML is intentionally NOT
 * enabled, so vendor-authored content can't inject scripts.
 */
export function RichText({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("text-body-md leading-relaxed text-on-surface-variant", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="my-3 first:mt-0 last:mb-0">{children}</p>,
          h2: ({ children }) => <h2 className="mb-3 mt-6 text-xl font-extrabold text-on-surface first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-5 text-lg font-bold text-on-surface first:mt-0">{children}</h3>,
          h4: ({ children }) => <h4 className="mb-2 mt-4 font-bold text-on-surface first:mt-0">{children}</h4>,
          ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary underline underline-offset-2">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-bold text-on-surface">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="my-6 border-outline-variant" />,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-secondary bg-surface-container-low py-2 pl-4 pr-3 text-on-surface">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-surface-container px-1.5 py-0.5 text-body-sm text-on-surface">{children}</code>
          ),
          // GFM tables — wrapped so wide specs scroll instead of breaking layout.
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl border border-outline-variant">
              <table className="w-full border-collapse text-left text-body-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-surface-container-high text-on-surface">{children}</thead>,
          th: ({ children }) => <th className="border-b border-outline-variant px-4 py-2.5 font-bold">{children}</th>,
          td: ({ children }) => <td className="border-b border-outline-variant/60 px-4 py-2.5 align-top">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Strips Markdown to plain text for meta descriptions and JSON-LD. */
export function toPlainText(markdown: string, maxLength = 300): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/^\s{0,3}[-*+]\s+/gm, "") // bullets
    .replace(/^\s{0,3}\d+\.\s+/gm, "") // numbered
    .replace(/\|/g, " ") // table pipes
    .replace(/[*_>`~#]/g, "") // emphasis / misc markers
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}
