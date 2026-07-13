"use client";

import { useState, type FormEvent } from "react";

export function NewsletterCTA() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-primary py-20 text-white">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <h2 className="text-4xl font-extrabold md:text-5xl">Stay Updated on the Latest Drops</h2>
          <p className="text-lg opacity-90">
            Join our community and be the first to know about new arrivals, limited editions, and exclusive
            city-wide discounts.
          </p>
          {submitted ? (
            <p className="font-bold">You&apos;re on the list — welcome to City Gadgets. 🎉</p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-grow rounded-xl border border-white/20 bg-white/10 px-6 py-4 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-8 py-4 font-bold text-primary transition-colors hover:bg-surface-off-white"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
