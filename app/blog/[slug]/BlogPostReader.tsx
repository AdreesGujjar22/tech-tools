"use client";

"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { Blog } from "@shared/api";
import { ArrowLeft, Calendar, Clock, Share2, Check, ShieldAlert, BookOpen } from "lucide-react";
import { Link, useNavigate } from "@/lib/router-compat";
import { toast } from "sonner";
import { motion } from "motion/react";

export function BlogPostReader({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        let foundPost: Blog | null = null;

        const blogsRef = collection(db, "blogs");
          const q = query(blogsRef, where("slug", "==", slug), limit(1));
          const snap = await getDocs(q);

          if (!snap.empty) {
            const docSnap = snap.docs[0];
            const data = docSnap.data() as any;

            // Safe format dates
            const createdStr = data.createdAt?.toDate 
              ? data.createdAt.toDate().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
              : String(data.createdAt || "");

            foundPost = {
              id: docSnap.id,
              title: data.title || "",
              slug: data.slug || "",
              content: data.content || "",
              status: data.status || "published",
              excerpt: data.excerpt || "",
              category: data.category || "General",
              tags: data.tags || [],
              featuredImage: data.featuredImage || "",
              readingTime: data.readingTime || "3 min read",
              createdAt: createdStr,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toLocaleDateString() : String(data.updatedAt || ""),
              seoTitle: data.seoTitle || "",
              seoDescription: data.seoDescription || "",
              seoKeywords: data.seoKeywords || ""
            };
        }

        setPost(foundPost);
      } catch (error) {
        console.error("Error fetching individual post: ", error);
        toast.error("An error occurred loading the article.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const copyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Article link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      toast.error("Could not copy link.");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin mb-4" />
        <p className="text-sm font-mono text-primary">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 text-center">
        <BookOpen size={48} className="text-primary mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          We couldn't locate the article you're searching for. It may have been renamed or drafts are locked.
        </p>
        <Link to="/blog" className="px-5 py-2.5 rounded-xl brand-gradient hover:opacity-90 text-foreground font-bold transition-all text-sm">
          Back to Blog
        </Link>
      </div>
    );
  }

  // Security Gate: Draft workflows are Admin-locked at component layout level
  if (post.status === "draft" && !isAdmin) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] text-foreground flex flex-col items-center justify-center px-6 text-center">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          This article is currently saved as a draft. You must be authenticated with administrators privileges to preview drafts.
        </p>
        <Link to="/blog" className="px-5 py-2.5 rounded-xl brand-gradient hover:opacity-90 text-foreground font-bold transition-all text-sm">
          Back to Blog System
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-foreground pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[850px] mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between" id="article-actions">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to archive</span>
          </Link>

          <button
            onClick={copyLink}
            className="p-2 px-4 rounded-xl bg-card hover:bg-muted border border-border text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
            <span>{copied ? "Copied!" : "Share Link"}</span>
          </button>
        </div>

        {/* Dynamic Reader Cover */}
        <article id="article-body">
          {/* Header Metadata block */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary font-mono">
                {post.category}
              </span>
              {post.status === "draft" && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-mono font-bold uppercase">
                  <ShieldAlert size={12} />
                  Admin Preview
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.15] mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed font-sans font-normal mb-6 border-l-2 border-primary/45 pl-4">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground/85 font-mono border-y border-border py-4">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>{post.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="w-full h-72 md:h-[420px] rounded-2xl overflow-hidden mb-12 bg-muted/30">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body Content rendered from Jodit HTML editor */}
          <div
            className="prose max-w-none text-foreground/90 font-sans tracking-wide leading-relaxed text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags list footer */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h4 className="text-sm font-mono text-muted-foreground/70 uppercase tracking-wider mb-3">Tagged in:</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground/90 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

      </div>
    </div>
  );
}
