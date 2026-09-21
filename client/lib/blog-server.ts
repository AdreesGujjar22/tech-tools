import type { Blog } from "@shared/api";

/**
 * Server-side Firestore REST helpers.
 *
 * The blog previously rendered entirely on the client, which meant crawlers
 * received an empty shell with no article text and identical metadata on every
 * post. These helpers let the server component fetch the post so the HTML that
 * Google receives already contains the real title, description and content.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

type FirestoreValue = {
  stringValue?: string;
  timestampValue?: string;
  booleanValue?: boolean;
  integerValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

function str(value?: FirestoreValue) {
  return value?.stringValue ?? value?.timestampValue ?? "";
}

function arr(value?: FirestoreValue) {
  return (value?.arrayValue?.values || []).map((item) => str(item)).filter(Boolean);
}

function toBlog(document: FirestoreDocument): Blog | null {
  const fields = document.fields;
  if (!fields) return null;

  return {
    id: document.name?.split("/").pop() || "",
    title: str(fields.title),
    slug: str(fields.slug),
    content: str(fields.content),
    status: (str(fields.status) as Blog["status"]) || "draft",
    excerpt: str(fields.excerpt),
    category: str(fields.category) || "General",
    tags: arr(fields.tags),
    featuredImage: str(fields.featuredImage),
    readingTime: str(fields.readingTime) || "3 min read",
    createdAt: str(fields.createdAt) || document.createTime || "",
    updatedAt: str(fields.updatedAt) || document.updateTime || "",
    seoTitle: str(fields.seoTitle),
    seoDescription: str(fields.seoDescription),
    seoKeywords: str(fields.seoKeywords),
  };
}

/** Fetch a single published post by slug, on the server. */
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!PROJECT_ID || !slug) return null;

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "blogs" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "slug" },
                op: "EQUAL",
                value: { stringValue: slug },
              },
            },
            limit: 1,
          },
        }),
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return null;

    const rows = (await response.json()) as Array<{ document?: FirestoreDocument }>;
    const document = rows.find((row) => row.document)?.document;
    if (!document) return null;

    const blog = toBlog(document);
    return blog && blog.status === "published" ? blog : null;
  } catch {
    return null;
  }
}

/** Strip HTML and clamp, for meta descriptions built from post content. */
export function toPlainText(html: string, maxLength = 160) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).replace(/\s+\S*$/, "")}…`;
}
