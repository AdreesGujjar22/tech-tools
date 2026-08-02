"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
import { formatDiffValue, jsonDiff, parseJson, type JsonDifference } from "@/lib/dev-text-4";
import { useTranslations } from "next-intl";

const statusClasses = {
  added: "border-emerald-200 bg-emerald-50 text-emerald-800",
  removed: "border-rose-200 bg-rose-50 text-rose-800",
  updated: "border-amber-200 bg-amber-50 text-amber-800",
  "children-updated": "border-sky-200 bg-sky-50 text-sky-800",
  unchanged: "border-slate-200 bg-white text-slate-700",
};

function DiffNode({ node, depth = 0 }: { node: JsonDifference; depth?: number }) {
  const [open, setOpen] = useState(true);
  const expandable = Boolean(node.children?.length);
  return (
    <div className={`border-l-4 ${statusClasses[node.status]}`} style={{ marginLeft: depth * 14 }}>
      <div className="flex items-center gap-2 px-3 py-2 font-mono text-sm">
        {expandable ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle nested JSON difference"
            className="rounded p-0.5 hover:bg-black/5"
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <span className="font-bold">{String(node.key)}</span>
        <span className="ml-auto rounded-full bg-black/10 px-2 py-0.5 text-xs font-semibold capitalize">
          {node.status === "updated" ? "changed" : node.status.replace("-", " ")}
        </span>
      </div>
      {!expandable && (
        <div className="grid gap-2 border-t border-current/10 px-3 py-2 text-xs sm:grid-cols-2">
          <pre className="overflow-x-auto whitespace-pre-wrap text-rose-700">
            {node.status !== "added" ? formatDiffValue(node.oldValue) : ""}
          </pre>
          <pre className="overflow-x-auto whitespace-pre-wrap text-emerald-700">
            {node.status !== "removed" ? formatDiffValue(node.value) : ""}
          </pre>
        </div>
      )}
      {expandable && open && (
        <div className="pb-2">
          {node.children!.map((child) => (
            <DiffNode key={String(child.key)} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JsonDiff() {
  const t = useTranslations("Tools.JsonDiff");
  const faqs = getFaqsForRoute("json-diff");
  const [left, setLeft] = useState('{\n  "name": "Ada",\n  "age": 36,\n  "roles": ["admin"]\n}');
  const [right, setRight] = useState('{\n  "name": "Ada",\n  "age": 37,\n  "roles": ["admin", "editor"]\n}');
  const [onlyDifferences, setOnlyDifferences] = useState(true);

  const result = useMemo(() => {
    try {
      return { tree: jsonDiff(parseJson(left), parseJson(right), onlyDifferences), error: "" };
    } catch {
      return { tree: null, error: t("invalid") };
    }
  }, [left, right, onlyDifferences, t]);

  return (
    <main className="min-h-screen px-6 pb-20 pt-32 text-foreground">
      <SEO
        title={t("title")}
        description={t("description")}
        keywords="JSON structural diff comparison, json comparison online"
        categoryName="Developer Tools"
        toolName={t("title")}
      />
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1>
          <p className="mt-3 text-[#4A6857]">{t("description")}</p>
        </header>

        <section aria-labelledby="input-payloads-heading">
          <h2 id="input-payloads-heading" className="sr-only">Input Payloads</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="glass-card-dark rounded-[24px] p-6 text-sm font-semibold text-[#2D4D35]">
              {t("original")}
              <textarea
                value={left}
                onChange={(event) => setLeft(event.target.value)}
                rows={14}
                spellCheck={false}
                className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal text-[#2D4D35]"
              />
            </label>
            <label className="glass-card-dark rounded-[24px] p-6 text-sm font-semibold text-[#2D4D35]">
              {t("updated")}
              <textarea
                value={right}
                onChange={(event) => setRight(event.target.value)}
                rows={14}
                spellCheck={false}
                className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal text-[#2D4D35]"
              />
            </label>
          </div>
        </section>

        <section aria-labelledby="diff-results-heading" className="glass-card-dark mt-6 rounded-[24px] p-6">
          <h2 id="diff-results-heading" className="text-xl font-bold text-[#1F3A26] mb-4">Comparison Output</h2>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-[#2D4D35]">
            <input
              type="checkbox"
              checked={onlyDifferences}
              onChange={(event) => setOnlyDifferences(event.target.checked)}
            />
            {t("showOnlyDifferences")}
          </label>
          {result.error ? (
            <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#E0E0E0]">
              <DiffNode node={result.tree!} />
            </div>
          )}
        </section>
      </div>

      <FaqSection items={faqs} title="JSON Diff FAQs" />
    </main>
  );
}
