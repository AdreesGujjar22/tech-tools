import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPostReader } from "./BlogPostReader";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Next.js 15 compliant dynamic SEO Metadata generation
export async function generateMetadata({ params }: PageProps) {
  try {
    const { slug } = await params;
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);

    if (snap.empty) {
      return {
        title: "Article Not Found | The Craft Blog",
        description: "The requested article does not exist or has been removed."
      };
    }

    const post = snap.docs[0].data() as any;
    const title = post.seoTitle || `${post.title} | The Craft Blog`;
    const description = post.seoDescription || post.excerpt || "Tactical software engineering insights.";
    const keywords = post.seoKeywords || "software craft, programming guides, UI design workflows";
    const featuredImg = post.featuredImage || "";

    const canonicalUrl = `https://ai.studio/build/blog/${slug}`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : String(post.createdAt || ""),
        modifiedTime: post.updatedAt?.toDate ? post.updatedAt.toDate().toISOString() : String(post.updatedAt || ""),
        images: featuredImg ? [{ url: featuredImg, alt: title }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: featuredImg ? [featuredImg] : [],
      }
    };
  } catch (error) {
    console.error("Metadata generator exception: ", error);
    return {
      title: "Insights | The Craft Blog",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <BlogPostReader slug={slug} />;
}
