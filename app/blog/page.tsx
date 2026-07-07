"use client";

"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { Blog, Category, Tag } from "@shared/api";
import { Search, Calendar, Clock, Tag as TagIcon, Filter, Layers, PlusCircle, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { motion, AnimatePresence } from "motion/react";

export default function BlogArchive() {
  const { user, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    async function fetchBlogData() {
      try {
        setLoading(true);
        // Build Blogs Query
        const blogsRef = collection(db, "blogs");
        let blogsQuery;

        if (isAdmin) {
          // Admin can see drafts and published posts
          blogsQuery = query(blogsRef, orderBy("createdAt", "desc"));
        } else {
          // Public can only see published posts
          blogsQuery = query(
            blogsRef, 
            where("status", "==", "published"),
            orderBy("createdAt", "desc")
          );
        }

        let fetchedBlogs: Blog[] = [];
        let fetchedCats: Category[] = [];
        let fetchedTags: Tag[] = [];

        try {
          const blogSnap = await getDocs(blogsQuery);
          blogSnap.forEach((docSnap) => {
            const data = docSnap.data() as any;
            fetchedBlogs.push({
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
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : String(data.createdAt || ""),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toLocaleDateString() : String(data.updatedAt || ""),
              seoTitle: data.seoTitle || "",
              seoDescription: data.seoDescription || "",
              seoKeywords: data.seoKeywords || ""
            });
          });

          // Fetch categories & tags
          const catSnap = await getDocs(collection(db, "categories"));
          catSnap.forEach((d) => {
            const data = d.data() as any;
            fetchedCats.push({ id: d.id, name: data.name, slug: data.name });
          });

          const tagSnap = await getDocs(collection(db, "tags"));
          tagSnap.forEach((d) => {
            const data = d.data() as any;
            fetchedTags.push({ id: d.id, name: data.name, slug: data.name });
          });
        } catch (dbErr) {
          console.warn("Could not read from cloud Firestore, loading from local fallback: ", dbErr);
        }

        // Merge localStorage items
        if (typeof window !== "undefined") {
          const localBlogsRaw = localStorage.getItem("local_blogs");
          if (localBlogsRaw) {
            try {
              const localBlogs = JSON.parse(localBlogsRaw) as Blog[];
              localBlogs.forEach((lb) => {
                // Determine whether to display: admin sees all, public sees only published
                const isStatusAllowed = isAdmin || lb.status === "published";
                if (isStatusAllowed) {
                  if (!fetchedBlogs.some((fb) => fb.slug === lb.slug)) {
                    fetchedBlogs.unshift(lb); // show newest local articles first
                  } else {
                    fetchedBlogs = fetchedBlogs.map((fb) => fb.slug === lb.slug ? lb : fb);
                  }
                }
              });
            } catch (err) {
              console.error(err);
            }
          }

          const localCatsRaw = localStorage.getItem("local_categories");
          if (localCatsRaw) {
            try {
              const localCats = JSON.parse(localCatsRaw) as Category[];
              localCats.forEach((lc) => {
                if (!fetchedCats.some((fc) => fc.id === lc.id)) {
                  fetchedCats.push(lc);
                }
              });
            } catch (err) {
              console.error(err);
            }
          }

          const localTagsRaw = localStorage.getItem("local_tags");
          if (localTagsRaw) {
            try {
              const localTags = JSON.parse(localTagsRaw) as Tag[];
              localTags.forEach((lt) => {
                if (!fetchedTags.some((ft) => ft.id === lt.id)) {
                  fetchedTags.push(lt);
                }
              });
            } catch (err) {
              console.error(err);
            }
          }
        }

        setBlogs(fetchedBlogs);
        setCategories(fetchedCats.length > 0 ? fetchedCats : [
          { id: "general", name: "General", slug: "general" },
          { id: "engineering", name: "Engineering", slug: "engineering" },
          { id: "design", name: "Design", slug: "design" }
        ]);
        setTags(fetchedTags.length > 0 ? fetchedTags : [
          { id: "nextjs", name: "Next.js", slug: "nextjs" },
          { id: "tailwind", name: "Tailwind", slug: "tailwind" }
        ]);

      } catch (error) {
        console.error("Error fetching blog archive data: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, [isAdmin]);

  // Client side filtering logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(search.toLowerCase()) || 
      (blog.excerpt && blog.excerpt.toLowerCase().includes(search.toLowerCase())) ||
      blog.content.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || 
      blog.category === selectedCategory;

    const matchesTag = 
      selectedTag === "All" || 
      (blog.tags && blog.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  const uniqueCategories = ["All", ...Array.from(new Set(blogs.map(b => b.category || "General")))];
  const uniqueTags = ["All", ...Array.from(new Set(blogs.flatMap(b => b.tags || [])))];

  const featuredPost = filteredBlogs.find(b => b.status === "published");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7F0] via-white to-transparent text-[#2D4D35] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Editorial Title Header */}
        <div className="mb-12 border-b border-[#C5DCC9] pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6" id="blog-header">
          <div>
            <div className="flex items-center gap-2 text-[#10A968] text-xs font-mono uppercase tracking-widest mb-3">
              <Layers size={14} />
              <span>Insights & Artifacts</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold font-sans tracking-tight text-[#1F3A26] mb-4">
              The Craft Blog
            </h1>
            <p className="text-lg text-[#4A6857] max-w-2xl leading-relaxed">
              In-depth investigations, tactical guides, and structural designs to supercharge your software engineering and visual workflow.
            </p>
          </div>
          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-3 rounded-xl bg-[#10A968] hover:bg-[#0d8a52] text-white font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#10A968]/20"
            >
              <PlusCircle size={18} />
              Write New Post
            </Link>
          )}
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12" id="filters-workspace">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A6857]/60">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search articles, keywords, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#C5DCC9] focus:border-[#10A968] rounded-xl focus:outline-none placeholder-[#4A6857]/50 text-[#1F3A26] transition-all text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A6857]/60">
              <Filter size={16} />
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#C5DCC9] focus:border-[#10A968] rounded-xl focus:outline-none text-sm text-[#2D4D35] transition-all appearance-none cursor-pointer"
            >
              <option value="All" className="bg-white">Category: All</option>
              {uniqueCategories.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat} className="bg-white">Category: {cat}</option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A6857]/60">
              <TagIcon size={16} />
            </span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#C5DCC9] focus:border-[#10A968] rounded-xl focus:outline-none text-sm text-[#2D4D35] transition-all appearance-none cursor-pointer"
            >
              <option value="All" className="bg-white">Tag: All</option>
              {uniqueTags.filter(t => t !== "All").map((tag) => (
                <option key={tag} value={tag} className="bg-white">Tag: {tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#F0F7F0]/30 border border-[#C5DCC9]/50 rounded-2xl p-6 h-[400px] animate-pulse flex flex-col justify-between">
                <div>
                  <div className="h-44 bg-[#E8F0E8] rounded-xl mb-4" />
                  <div className="h-6 bg-[#E8F0E8] rounded w-3/4 mb-3" />
                  <div className="h-4 bg-[#E8F0E8] rounded w-1/2" />
                </div>
                <div className="h-10 bg-[#E8F0E8] rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl max-w-lg mx-auto mt-12 border border-dashed border-[#C5DCC9] bg-[#F0F7F0]" id="empty-state">
            <Layers className="mx-auto text-[#10A968]/50 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2 text-[#1F3A26]">No Articles Found</h3>
            <p className="text-[#4A6857] mb-6 text-sm">
              We couldn't find any articles matching your filters. Try clearing your filters or writing a new blog post.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedTag("All");
              }}
              className="text-[#10A968] hover:text-[#0d8a52] font-bold transition-all text-sm underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Featured Post (only displayed when no tight filter is applied) */}
            {featuredPost && search === "" && selectedCategory === "All" && selectedTag === "All" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 premium-card p-6 md:p-8 rounded-3xl"
                id="featured-lens"
              >
                <div className="lg:col-span-7 relative h-64 md:h-96 rounded-2xl overflow-hidden bg-[#F0F7F0]/60 flex items-center justify-center">
                  {featuredPost.featuredImage ? (
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-[#C5DCC9] font-mono text-9xl select-none uppercase font-extrabold rotate-3">
                      CRAFT
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-lg bg-[#10A968]/90 backdrop-blur-md text-xs font-mono font-bold tracking-widest text-white">
                    FEATURED POST
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between py-2">
                  <div>
                    <span className="text-[#10A968] font-mono text-xs uppercase tracking-wider mb-2 block">
                      {featuredPost.category}
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#1F3A26] mb-4 hover:text-[#10A968] transition-colors">
                      <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="text-[#4A6857] text-sm leading-relaxed mb-6">
                      {featuredPost.excerpt || `${featuredPost.content.substring(0, 160).replace(/<[^>]*>/g, "")}...`}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-[#E8F0E8] border border-[#C5DCC9] text-xs text-[#4A6857]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#C5DCC9]/30 pt-6">
                    <div className="flex items-center gap-4 text-xs font-mono text-[#4A6857]/80">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {featuredPost.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {featuredPost.readingTime}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-[#10A968] hover:text-[#0d8a52] font-bold text-sm transition-all"
                    >
                      Read Full Post
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Standard Grid Layout */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1F3A26] mb-8 font-sans">
                {search || selectedCategory !== "All" || selectedTag !== "All" ? `Search Results (${filteredBlogs.length})` : "All Articles"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">
                {filteredBlogs.map((post) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="premium-card rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Cover */}
                      <div className="relative h-48 bg-[#F0F7F0]/60 overflow-hidden flex items-center justify-center">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-300"
                          />
                        ) : (
                          <div className="text-[#C5DCC9] font-mono text-6xl uppercase font-bold select-none">
                            CRAFT
                          </div>
                        )}
                        <span className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-[#1F3A26]/80 backdrop-blur-sm text-[10px] font-mono tracking-widest text-white">
                          {post.category?.toUpperCase()}
                        </span>
                        {post.status === "draft" && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-mono font-bold uppercase">
                            Draft
                          </span>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#1F3A26] mb-2 line-clamp-2 hover:text-[#10A968] transition-colors">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-[#4A6857] text-xs leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt || `${post.content.replace(/<[^>]*>/g, "").substring(0, 110)}...`}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {post.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono text-[#10A968] px-2 py-0.5 rounded bg-[#E8F0E8] border border-[#C5DCC9]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Meta info footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-[#C5DCC9]/30 flex items-center justify-between text-[11px] font-mono text-[#4A6857]/80">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.createdAt}
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readingTime}
                        </span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="hover:scale-110 transition-transform"
                          aria-label="Read full article"
                        >
                          <ArrowUpRight size={14} className="text-[#10A968]" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
