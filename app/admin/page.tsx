"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Blog, Category, Tag } from "@shared/api";
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Key, 
  User as UserIcon, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  UploadCloud, 
  Eye, 
  EyeOff, 
  Settings, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ArrowLeft,
  ChevronRight,
  Globe
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import BlogEditor from "@/components/admin/BlogEditor";

export default function AdminPage() {
  const {
    user,
    isAdmin,
    loading: authLoading,
    loginWithEmail
  } = useAuth();

  // Auth Forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Core CMS state
  const [articles, setArticles] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [cmsLoading, setCmsLoading] = useState(true);

  // Active view management
  // 'list' or 'editor'
  const [cmsView, setCmsView] = useState<"list" | "editor">("list");
  const [activeTab, setActiveTab] = useState<"posts" | "taxonomies">("posts");

  // Post form state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postCategory, setPostCategory] = useState("General");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postFeaturedImage, setPostFeaturedImage] = useState("");
  const [postStatus, setPostStatus] = useState<"draft" | "published">("draft");
  const [postReadingTime, setPostReadingTime] = useState("3 min read");
  const [postSeoTitle, setPostSeoTitle] = useState("");
  const [postSeoDescription, setPostSeoDescription] = useState("");
  const [postSeoKeywords, setPostSeoKeywords] = useState("");

  const [savingPost, setSavingPost] = useState(false);

  // Auto slug generation toggles
  const [autoSlug, setAutoSlug] = useState(true);

  // Taxonomies Form States
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  // Populate data on login
  useEffect(() => {
    if (user && isAdmin) {
      fetchCmsData();
    }
  }, [user, isAdmin]);

  // Live Auto Slug Generation
  useEffect(() => {
    if (autoSlug && postTitle && !editingPostId) {
      const slugValue = postTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .trim()
        .replace(/\s+/g, "-") // replace spaces with -
        .replace(/-+/g, "-"); // merge multi-dashes
      setPostSlug(slugValue);
    }
  }, [postTitle, autoSlug, editingPostId]);

  async function fetchCmsData() {
    try {
      setCmsLoading(true);
      
      let fetchedArticles: Blog[] = [];
      let fetchedCats: Category[] = [];
      let fetchedTags: Tag[] = [];

      // 1. Try reading from Firestore
      try {
        const articlesSnap = await getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc")));
        articlesSnap.forEach((docSnap) => {
          const d = docSnap.data() as any;
          fetchedArticles.push({
            id: docSnap.id,
            title: d.title || "",
            slug: d.slug || "",
            content: d.content || "",
            status: d.status || "draft",
            excerpt: d.excerpt || "",
            category: d.category || "General",
            tags: d.tags || [],
            featuredImage: d.featuredImage || "",
            readingTime: d.readingTime || "3 min read",
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : String(d.createdAt || ""),
            updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toLocaleDateString() : String(d.updatedAt || ""),
            seoTitle: d.seoTitle || "",
            seoDescription: d.seoDescription || "",
            seoKeywords: d.seoKeywords || ""
          });
        });

        // Fetch Categories
        const categoriesSnap = await getDocs(collection(db, "categories"));
        categoriesSnap.forEach((d) => {
          const data = d.data() as any;
          fetchedCats.push({ id: d.id, name: data.name, slug: data.name });
        });

        // Fetch Tags
        const tagsSnap = await getDocs(collection(db, "tags"));
        tagsSnap.forEach((d) => {
          const data = d.data() as any;
          fetchedTags.push({ id: d.id, name: data.name, slug: data.name });
        });
      } catch (fbError) {
        console.warn("Could not read from cloud Firestore, using local storage fallback:", fbError);
      }

      // 2. Read and merge localStorage items for seamless offline or simulated dev experience
      if (typeof window !== "undefined") {
        const localBlogsRaw = localStorage.getItem("local_blogs");
        if (localBlogsRaw) {
          try {
            const localBlogs = JSON.parse(localBlogsRaw) as Blog[];
            // Filter duplicates by slug/id (prefer local overriding if matched, or append)
            localBlogs.forEach(lb => {
              if (!fetchedArticles.some(fa => fa.slug === lb.slug)) {
                fetchedArticles.unshift(lb); // add local blogs first
              } else {
                // replace existing with local
                fetchedArticles = fetchedArticles.map(fa => fa.slug === lb.slug ? lb : fa);
              }
            });
          } catch (e) {
            console.error(e);
          }
        }

        const localCatsRaw = localStorage.getItem("local_categories");
        if (localCatsRaw) {
          try {
            const localCats = JSON.parse(localCatsRaw) as Category[];
            localCats.forEach(lc => {
              if (!fetchedCats.some(fc => fc.id === lc.id)) {
                fetchedCats.push(lc);
              }
            });
          } catch (e) {
            console.error(e);
          }
        }

        const localTagsRaw = localStorage.getItem("local_tags");
        if (localTagsRaw) {
          try {
            const localTags = JSON.parse(localTagsRaw) as Tag[];
            localTags.forEach(lt => {
              if (!fetchedTags.some(ft => ft.id === lt.id)) {
                fetchedTags.push(lt);
              }
            });
          } catch (e) {
            console.error(e);
          }
        }
      }

      setArticles(fetchedArticles);
      setCategories(fetchedCats);
      setTags(fetchedTags);

    } catch (error) {
      console.error("Error fetching CMS database: ", error);
      toast.error("Could not fetch CMS data.");
    } finally {
      setCmsLoading(false);
    }
  }

  // Handle Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter admin email and password.");
      return;
    }
    try {
      setSigningIn(true);
      await loginWithEmail(email, password);
      toast.success("Admin logged in successfully!");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Authentication Error:", error);
      toast.error(error.message || "Authentication failed - invalid credentials.");
    } finally {
      setSigningIn(false);
    }
  };

  // Add / Remove Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const slug = newCategory.toLowerCase().trim().replace(/\s+/g, "-");
    const isSimulated = typeof window !== "undefined" && localStorage.getItem("dev_bypass_active") === "true";

    try {
      if (isSimulated) {
        throw new Error("Simulated dev mode");
      }
      const ref = doc(db, "categories", slug);
      await setDoc(ref, { name: newCategory.trim() });
      toast.success("Category added to Firebase!");
    } catch (err) {
      console.warn("Saving to Firebase failed / bypassed, falling back to local storage:", err);
      if (typeof window !== "undefined") {
        const localCatsRaw = localStorage.getItem("local_categories") || "[]";
        const localCats = JSON.parse(localCatsRaw) as Category[];
        if (!localCats.some(c => c.id === slug)) {
          localCats.push({ id: slug, name: newCategory.trim(), slug: slug });
          localStorage.setItem("local_categories", JSON.stringify(localCats));
        }
      }
      toast.success("Category added locally!");
    }
    setNewCategory("");
    fetchCmsData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const isSimulated = typeof window !== "undefined" && localStorage.getItem("dev_bypass_active") === "true";
    try {
      if (isSimulated) {
        throw new Error("Simulated dev mode");
      }
      await deleteDoc(doc(db, "categories", id));
      toast.success("Category deleted from Firebase.");
    } catch (err) {
      console.warn("Deleting from Firebase failed or bypassed, deleting locally:", err);
      if (typeof window !== "undefined") {
        const localCatsRaw = localStorage.getItem("local_categories") || "[]";
        let localCats = JSON.parse(localCatsRaw) as Category[];
        localCats = localCats.filter(c => c.id !== id);
        localStorage.setItem("local_categories", JSON.stringify(localCats));
      }
      toast.success("Category deleted locally.");
    }
    fetchCmsData();
  };

  // Add / Remove Tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const slug = newTag.toLowerCase().trim().replace(/\s+/g, "-");
    const isSimulated = typeof window !== "undefined" && localStorage.getItem("dev_bypass_active") === "true";

    try {
      if (isSimulated) {
        throw new Error("Simulated dev mode");
      }
      const ref = doc(db, "tags", slug);
      await setDoc(ref, { name: newTag.trim() });
      toast.success("Tag added to Firebase!");
    } catch (err) {
      console.warn("Saving to Firebase failed / bypassed, saving locally:", err);
      if (typeof window !== "undefined") {
        const localTagsRaw = localStorage.getItem("local_tags") || "[]";
        const localTags = JSON.parse(localTagsRaw) as Tag[];
        if (!localTags.some(t => t.id === slug)) {
          localTags.push({ id: slug, name: newTag.trim(), slug: slug });
          localStorage.setItem("local_tags", JSON.stringify(localTags));
        }
      }
      toast.success("Tag added locally!");
    }
    setNewTag("");
    fetchCmsData();
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    const isSimulated = typeof window !== "undefined" && localStorage.getItem("dev_bypass_active") === "true";
    try {
      if (isSimulated) {
        throw new Error("Simulated dev mode");
      }
      await deleteDoc(doc(db, "tags", id));
      toast.success("Tag deleted from Firebase.");
    } catch (err) {
      console.warn("Deleting from Firebase failed or bypassed, deleting locally:", err);
      if (typeof window !== "undefined") {
        const localTagsRaw = localStorage.getItem("local_tags") || "[]";
        let localTags = JSON.parse(localTagsRaw) as Tag[];
        localTags = localTags.filter(t => t.id !== id);
        localStorage.setItem("local_tags", JSON.stringify(localTags));
      }
      toast.success("Tag deleted locally.");
    }
    fetchCmsData();
  };

  // Post Submission / Saving (Create & Update workflows)
  const savePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postSlug || !postContent) {
      toast.error("Please fill in Title, Slug, and content.");
      return;
    }

    const isSimulated = typeof window !== "undefined" && localStorage.getItem("dev_bypass_active") === "true";

    try {
      setSavingPost(true);
      
      // Enforce duplicate slug check on creation
      if (!editingPostId && !isSimulated) {
        try {
          const blogsRef = collection(db, "blogs");
          const dupQuery = query(blogsRef, where("slug", "==", postSlug));
          const dupSnap = await getDocs(dupQuery);
          if (!dupSnap.empty) {
            toast.error("Slug already exists! Please write a unique slug.");
            setSavingPost(false);
            return;
          }
        } catch (slugError) {
          console.warn("Duplicate slug query failed rules-side, relying on local check.");
        }
      }

      // Check unique slug in local blogs
      if (!editingPostId && typeof window !== "undefined") {
        const localBlogsRaw = localStorage.getItem("local_blogs") || "[]";
        const localBlogs = JSON.parse(localBlogsRaw) as Blog[];
        if (localBlogs.some(lb => lb.slug === postSlug)) {
          toast.error("Slug already exists in local storage! Please write a unique slug.");
          setSavingPost(false);
          return;
        }
      }

      const postData = {
        title: postTitle,
        slug: postSlug,
        content: postContent,
        excerpt: postExcerpt,
        category: postCategory,
        tags: postTags,
        featuredImage: postFeaturedImage,
        status: postStatus,
        readingTime: postReadingTime,
        seoTitle: postSeoTitle || `${postTitle} | The Craft Blog`,
        seoDescription: postSeoDescription || postExcerpt,
        seoKeywords: postSeoKeywords,
        updatedAt: new Date(),
      };

      if (isSimulated) {
        throw new Error("Simulated dev active, bypassing cloud write.");
      }

      if (editingPostId) {
        // Update
        if (editingPostId.startsWith("post_local_")) {
          throw new Error("Local post edit - fallback to local storage write.");
        }
        const docRef = doc(db, "blogs", editingPostId);
        await setDoc(docRef, {
          ...postData,
          createdAt: articles.find(a => a.id === editingPostId)?.createdAt 
            ? new Date(articles.find(a => a.id === editingPostId)!.createdAt) 
            : new Date()
        }, { merge: true });
        toast.success("Post updated successfully on Firebase!");
      } else {
        // Create
        const docId = `post_${Date.now()}`;
        const docRef = doc(db, "blogs", docId);
        await setDoc(docRef, {
          ...postData,
          createdAt: new Date(),
        });
        toast.success("New post created successfully on Firebase!");
      }

      // Refresh listings
      fetchCmsData();
      resetPostForm();
      setCmsView("list");
    } catch (err: any) {
      console.warn("Save Post cloud operation bypassed or failed, saving locally:", err);
      
      // FALLBACK TO LOCAL STORAGE
      if (typeof window !== "undefined") {
        const localBlogsRaw = localStorage.getItem("local_blogs") || "[]";
        const localBlogs = JSON.parse(localBlogsRaw) as Blog[];
        
        const localPostData: Blog = {
          id: editingPostId || `post_local_${Date.now()}`,
          title: postTitle,
          slug: postSlug,
          content: postContent,
          excerpt: postExcerpt,
          category: postCategory,
          tags: postTags,
          featuredImage: postFeaturedImage || "https://picsum.photos/seed/blog/800/600",
          status: postStatus,
          readingTime: postReadingTime,
          createdAt: articles.find(a => a.id === editingPostId)?.createdAt || new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString(),
          seoTitle: postSeoTitle || `${postTitle} | Local Workspaces`,
          seoDescription: postSeoDescription || postExcerpt,
          seoKeywords: postSeoKeywords
        };

        if (editingPostId) {
          const index = localBlogs.findIndex(b => b.id === editingPostId);
          if (index !== -1) {
            localBlogs[index] = localPostData;
          } else {
            localBlogs.push(localPostData);
          }
          toast.success("Post updated locally!");
        } else {
          localBlogs.push(localPostData);
          toast.success("Post created locally!");
        }
        localStorage.setItem("local_blogs", JSON.stringify(localBlogs));
      }

      fetchCmsData();
      resetPostForm();
      setCmsView("list");
    } finally {
      setSavingPost(false);
    }
  };

  // Launch Editor
  const openPostEditor = (postToEdit?: Blog) => {
    if (postToEdit) {
      setEditingPostId(postToEdit.id || null);
      setPostTitle(postToEdit.title);
      setPostSlug(postToEdit.slug);
      setPostContent(postToEdit.content);
      setPostExcerpt(postToEdit.excerpt || "");
      setPostCategory(postToEdit.category || "General");
      setPostTags(postToEdit.tags || []);
      setPostFeaturedImage(postToEdit.featuredImage || "");
      setPostStatus(postToEdit.status);
      setPostReadingTime(postToEdit.readingTime || "3 min read");
      setPostSeoTitle(postToEdit.seoTitle || "");
      setPostSeoDescription(postToEdit.seoDescription || "");
      setPostSeoKeywords(postToEdit.seoKeywords || "");
      setAutoSlug(false);
    } else {
      resetPostForm();
    }
    setCmsView("editor");
  };

  // Delete Post Entry
  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this post? This cannot be undone.")) return;
    const isSimulated = typeof window !== "undefined" && localStorage.getItem("dev_bypass_active") === "true";
    
    try {
      if (isSimulated || id.startsWith("post_local_")) {
        throw new Error("Local post delete fallback.");
      }
      await deleteDoc(doc(db, "blogs", id));
      toast.success("Post deleted from Firebase.");
    } catch (err) {
      console.warn("Delete failed or bypassed, deleting locally:", err);
      if (typeof window !== "undefined") {
        const localBlogsRaw = localStorage.getItem("local_blogs") || "[]";
        let localBlogs = JSON.parse(localBlogsRaw) as Blog[];
        localBlogs = localBlogs.filter(b => b.id !== id);
        localStorage.setItem("local_blogs", JSON.stringify(localBlogs));
      }
      toast.success("Post deleted locally.");
    }
    fetchCmsData();
  };

  const handlePostStatusToggle = async (postItem: Blog) => {
    const isSimulated = typeof window !== "undefined" && localStorage.getItem("dev_bypass_active") === "true";
    const nextStatus = postItem.status === "draft" ? "published" : "draft";

    try {
      if (isSimulated || postItem.id!.startsWith("post_local_")) {
        throw new Error("Local post toggle fallback.");
      }
      await setDoc(doc(db, "blogs", postItem.id!), {
        status: nextStatus,
        updatedAt: new Date()
      }, { merge: true });
      toast.success(`Post status toggled to ${nextStatus}!`);
    } catch (error) {
      console.warn("Toggle failed or bypassed, toggling locally:", error);
      if (typeof window !== "undefined") {
        const localBlogsRaw = localStorage.getItem("local_blogs") || "[]";
        const localBlogs = JSON.parse(localBlogsRaw) as Blog[];
        const index = localBlogs.findIndex(b => b.id === postItem.id);
        if (index !== -1) {
          localBlogs[index].status = nextStatus;
          localStorage.setItem("local_blogs", JSON.stringify(localBlogs));
          toast.success(`Post status toggled locally to ${nextStatus}!`);
        }
      }
    }
    fetchCmsData();
  };

  const resetPostForm = () => {
    setEditingPostId(null);
    setPostTitle("");
    setPostSlug("");
    setPostContent("");
    setPostExcerpt("");
    setPostCategory("General");
    setPostTags([]);
    setPostFeaturedImage("");
    setPostStatus("draft");
    setPostReadingTime("3 min read");
    setPostSeoTitle("");
    setPostSeoDescription("");
    setPostSeoKeywords("");
    setAutoSlug(true);
  };

  const toggleTagSelection = (tagName: string) => {
    if (postTags.includes(tagName)) {
      setPostTags(postTags.filter(t => t !== tagName));
    } else {
      setPostTags([...postTags, tagName]);
    }
  };

  // Handle Loading Gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0C142B] text-slate-300 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-mono text-indigo-400">Loading sessions context...</p>
      </div>
    );
  }

  // View Gate 1: No User Authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0C142B] text-slate-300 pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md premium-card p-8 rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />
          
          <div className="text-center mb-8">
            <Layers className="mx-auto text-indigo-400 mb-2" size={36} />
            <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-400/80">
              Tech Tool Blog Station
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              CMS Admin Access
            </h2>
            <p className="text-[#C7C4D8] text-xs mt-2 leading-relaxed">
              Unlock drafting, categorization, tags, SEO optimization tools, and content authoring panels securely.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                Workspace Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C7C4D8]/50">
                  <UserIcon size={14} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-600 text-sm text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                Secure Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C7C4D8]/50">
                  <Key size={14} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-600 text-sm text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={signingIn}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-505 font-bold text-white transition-all text-sm shadow-lg shadow-indigo-600/20 hover:active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {signingIn ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin Panel</span>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // View Gate 2: Not authorized as admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0C142B] text-slate-300 pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-lg premium-card p-8 rounded-2xl border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          <ShieldAlert className="mx-auto text-red-500 mb-4 animate-pulse" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-[#C7C4D8] text-sm leading-relaxed max-w-sm mx-auto mb-6">
            Your credentials do not have admin access. Please contact the site administrator.
          </p>
        </div>
      </div>
    );
  }

  // Core Authorized CMS Layout
  return (
    <div className="min-h-screen bg-[#0C142B] text-[#E2DFFF] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Core View 1: Articles and Taxonomies Lists */}
        {cmsView === "list" && (
          <div>
            
            {/* Dashboard Welcome header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/5 mb-8">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                  CMS ADMINISTRATIVE DESK
                </span>
                <h1 className="text-4xl font-bold font-sans tracking-tight text-white mt-1">
                  Control Panel
                </h1>
                <p className="text-sm text-[#C7C4D8] mt-1">
                  Manage posts, schedule drafts, configure metadata, and track categories.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openPostEditor()}
                  className="px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-indigo-50 font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <Plus size={16} />
                  Create New Post
                </button>
              </div>
            </div>

            {/* Admin Index Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="metrics-panel">
              <div className="premium-card p-5 rounded-xl border border-white/5">
                <span className="text-xs font-mono tracking-wider text-[#C7C4D8]/80 block">TOTAL ARTICLES</span>
                <span className="text-3xl font-black text-white mt-1 block">{articles.length}</span>
              </div>
              <div className="premium-card p-5 rounded-xl border border-white/5">
                <span className="text-xs font-mono tracking-wider text-[#C7C4D8]/80 block">PUBLISHED POSTS</span>
                <span className="text-3xl font-black text-indigo-400 mt-1 block">
                  {articles.filter(a => a.status === "published").length}
                </span>
              </div>
              <div className="premium-card p-5 rounded-xl border border-white/5">
                <span className="text-xs font-mono tracking-wider text-[#C7C4D8]/80 block">SAVED DRAFTS</span>
                <span className="text-3xl font-black text-amber-400 mt-1 block">
                  {articles.filter(a => a.status === "draft").length}
                </span>
              </div>
              <div className="premium-card p-5 rounded-xl border border-white/5">
                <span className="text-xs font-mono tracking-wider text-[#C7C4D8]/80 block">TAXONOMIES COUNT</span>
                <span className="text-3xl font-black text-emerald-400 mt-1 block">
                  {categories.length + tags.length}
                </span>
              </div>
            </div>

            {/* Workspace Tab bar toggles */}
            <div className="flex border-b border-white/5 mb-8">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-3 px-6 font-semibold text-sm transition-all relative ${
                  activeTab === "posts" ? "text-white border-b-2 border-indigo-500" : "text-[#C7C4D8] hover:text-white"
                }`}
              >
                All Articles ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab("taxonomies")}
                className={`py-3 px-6 font-semibold text-sm transition-all relative ${
                  activeTab === "taxonomies" ? "text-white border-b-2 border-indigo-500" : "text-[#C7C4D8] hover:text-white"
                }`}
              >
                Taxonomy Manager ({categories.length + tags.length})
              </button>
            </div>

            {/* Loader inside dynamic components */}
            {cmsLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="animate-spin text-indigo-400 mx-auto mb-4" size={32} />
                <p className="text-xs text-indigo-400 font-mono">Loading data assets...</p>
              </div>
            ) : activeTab === "posts" ? (
              
              /* POSTS ARCHIVE DIRECTORY LIST */
              <div className="space-y-4">
                {articles.length === 0 ? (
                  <div className="premium-card p-12 text-center rounded-xl max-w-md mx-auto">
                    <FileText className="text-indigo-400 mb-3 mx-auto opacity-40" size={36} />
                    <h3 className="font-semibold text-white mb-1">No Posts Created Yet</h3>
                    <p className="text-[#C7C4D8]/80 text-xs mb-4">
                      Get started immediately by drafting your very first structural article.
                    </p>
                    <button
                      onClick={() => openPostEditor()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Start Blogging
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full text-left border-collapse bg-slate-900/10">
                      <thead>
                        <tr className="border-b border-white/5 bg-slate-900/35 font-mono text-[10px] text-[#C7C4D8]/80 tracking-widest uppercase">
                          <th className="py-4 px-6 font-normal">State</th>
                          <th className="py-4 px-6 font-normal">Title</th>
                          <th className="py-4 px-6 font-normal">Category</th>
                          <th className="py-4 px-6 font-normal">Created At</th>
                          <th className="py-4 px-6 font-normal">SEO Slug</th>
                          <th className="py-4 px-6 font-normal text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {articles.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/20 transition-colors text-sm text-[#DAD7FF]">
                            
                            {/* State Column */}
                            <td className="py-4 px-6">
                              <button
                                onClick={() => handlePostStatusToggle(item)}
                                className={`px-2.5 py-1 rounded inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider font-mono cursor-pointer ${
                                  item.status === "published"
                                    ? "bg-slate-950 text-emerald-400 border border-emerald-500/10"
                                    : "bg-slate-950 text-amber-500 border border-amber-500/10"
                                }`}
                                title="Click to toggle publish/draft status"
                              >
                                {item.status === "published" ? (
                                  <>
                                    <Eye size={10} /> Published
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={10} /> Draft
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Title Column */}
                            <td className="py-4 px-6 font-bold text-white max-w-xs truncate">
                              {item.title}
                            </td>

                            {/* Category */}
                            <td className="py-4 px-6 font-mono text-xs">
                              {item.category}
                            </td>

                            {/* Custom Date formatting */}
                            <td className="py-4 px-6 font-mono text-xs text-[#C7C4D8]/80">
                              {item.createdAt}
                            </td>

                            {/* SEO Slug */}
                            <td className="py-4 px-6 text-[#C7C4D8]/80 text-xs">
                              <span className="font-mono text-indigo-400">/blog/</span>
                              <span className="underline">{item.slug}</span>
                            </td>

                            {/* Actions Column */}
                            <td className="py-4 px-6 text-right">
                              <div className="inline-flex gap-2.5 justify-end">
                                <Link
                                  to={`/blog/${item.slug}`}
                                  className="p-1.5 rounded bg-indigo-950/45 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950 transition-all border border-indigo-900/40"
                                  title="View Article"
                                >
                                  <Eye size={14} />
                                </Link>
                                <button
                                  onClick={() => openPostEditor(item)}
                                  className="p-1.5 rounded bg-slate-950 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all border border-indigo-500/20"
                                  title="Edit Post"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(item.id!)}
                                  className="p-1.5 rounded bg-slate-950 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-red-500/20"
                                  title="Delete Post permanently"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              
              /* CATEGORIES & TAGS TAXONOMY ENGINE */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Category Board list */}
                <div className="premium-card p-6 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">
                    <Layers size={13} />
                    <span>SYSTEM CATEGORIES</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-6">
                    Category Engine
                  </h3>

                  {/* Add category form */}
                  <form onSubmit={handleAddCategory} className="flex gap-2.5 mb-6">
                    <input
                      type="text"
                      placeholder="E.g. Engineering, Design, Product..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg focus:outline-none placeholder-slate-700 text-sm text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-[#E2DFFF] text-xs font-bold rounded-lg transition-all"
                    >
                      Add
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="text-xs font-mono text-slate-500 p-2 italic">No custom categories registered.</p>
                    ) : (
                      categories.map((cat) => (
                        <div key={cat.id} className="px-4 py-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800 flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-200">{cat.name}</span>
                          <div className="flex items-center gap-4 text-[#C1C3D1]">
                            <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded bg-slate-950 text-[#C7C4D8]/80 border border-white/5">
                              slug: {cat.id}
                            </span>
                            <button
                              onClick={() => handleDeleteCategory(cat.id!)}
                              className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Tags Board list */}
                <div className="premium-card p-6 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">
                    <Settings size={13} />
                    <span>SYSTEM TAG INDEXES</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-6">
                    Tag Library
                  </h3>

                  {/* Add tag form */}
                  <form onSubmit={handleAddTag} className="flex gap-2.5 mb-6">
                    <input
                      type="text"
                      placeholder="E.g. nextjs, drizzle, custom..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg focus:outline-none placeholder-slate-700 text-sm text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-[#E2DFFF] text-xs font-bold rounded-lg transition-all"
                    >
                      Add
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto">
                    {tags.length === 0 ? (
                      <p className="text-xs font-mono text-slate-500 p-2 italic">No custom tags indexed.</p>
                    ) : (
                      tags.map((tg) => (
                        <div key={tg.id} className="px-4 py-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800 flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-200">#{tg.name}</span>
                          <div className="flex items-center gap-4 text-[#C1C3D1]">
                            <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded bg-slate-950 text-[#C7C4D8]/80 border border-white/5">
                              slug: {tg.id}
                            </span>
                            <button
                              onClick={() => handleDeleteTag(tg.id!)}
                              className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete tag"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Core View 2: High-contrast rich WYSIWYG editor & side-by-side Live Markdown rendering */}
        {cmsView === "editor" && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <button
                  onClick={() => setCmsView("list")}
                  className="text-xs text-[#C7C4D8] hover:text-white flex items-center gap-1.5 uppercase font-mono tracking-widest mb-2 cursor-pointer pb-1"
                >
                  <ArrowLeft size={12} /> Back to dashboard
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
                  {editingPostId ? "Reform Workspaces Post" : "Draft Structural Insights"}
                </h1>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCmsView("list")}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 border border-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={savePostSubmit}
                  disabled={savingPost}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  {savingPost ? <RefreshCw className="animate-spin" size={12} /> : null}
                  Save Post
                </button>
              </div>
            </div>

            {/* Split Grid - Left Editor, Right Live Markdown Reader */}
            <form onSubmit={savePostSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="editorial-form">
              
              <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/25 p-6 border border-slate-800 rounded-2xl">
                {/* Left side variables configurations */}
                <div className="md:col-span-8 space-y-5">
                  
                  {/* Post Title & auto generating Slug */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. Designing High-Contrast Interfaces"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-700 text-white font-bold"
                      required
                    />
                  </div>

                  {/* Slug field with Manual Override control */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider block">
                        URL Slug (SEO friendly) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setAutoSlug(!autoSlug)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          autoSlug ? "bg-indigo-950 text-indigo-400 border border-indigo-900/30" : "bg-slate-900 text-slate-400 border border-white/5"
                        }`}
                      >
                        {autoSlug ? "✓ Auto generation active" : "✎ Manual override active"}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#C7C4D8]/50">
                        /blog/
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. designing-high-contrast-interfaces"
                        value={postSlug}
                        onChange={(e) => {
                          setPostSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                          setAutoSlug(false);
                        }}
                        className="w-full pl-[52px] pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl focus:outline-none font-mono text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Short Excerpt * (Summarize in 1-2 editorial lines)
                    </label>
                    <textarea
                      placeholder="E.g. A tactical deep-dive into establishing structural color contrast..."
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl focus:outline-none placeholder-slate-700 text-xs text-[#DAD7FF]"
                      rows={2}
                      maxLength={1000}
                    />
                  </div>

                </div>

                {/* Right side properties config panel */}
                <div className="md:col-span-4 space-y-4">
                  
                  {/* Category dropdown */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Category Selection
                    </label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg focus:outline-none text-xs text-white cursor-pointer"
                    >
                      <option value="General">General</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status drafting toggle */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-[#C7C4D8] uppercase block mb-1">
                        State Mode
                      </label>
                      <select
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value as any)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-850 rounded text-xs select-none cursor-pointer text-white font-semibold"
                      >
                        <option value="draft">Draft Save</option>
                        <option value="published">Publish Live</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-[#C7C4D8] uppercase block mb-1">
                        Reading Time
                      </label>
                      <input
                        type="text"
                        value={postReadingTime}
                        onChange={(e) => setPostReadingTime(e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-850 rounded text-xs text-white text-center font-mono"
                        placeholder="E.g. 5 min read"
                      />
                    </div>
                  </div>

                  {/* Featured Header Image URL */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Featured Cover Image (Full HTTPS URL)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <UploadCloud size={14} />
                      </span>
                      <input
                        type="url"
                        placeholder="https://picsum.photos/seed/vibrant/1200/600"
                        value={postFeaturedImage}
                        onChange={(e) => setPostFeaturedImage(e.target.value)}
                        className="w-full pl-[36px] pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl focus:outline-none text-xs text-white"
                        pattern="https://.*"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Jodit Rich Text Editor Content Workstation */}
              <div className="lg:col-span-12 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider block">
                      Blog Post Content (Rich Text Editor) *
                    </label>
                    <p className="text-[10px] font-mono text-[#C7C4D8]/70 mt-1">
                      Format your content with headings, lists, links, images, tables, code blocks, quotes, and more.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-green-400 whitespace-nowrap">
                    ● Live Editor
                  </span>
                </div>

                {/* Jodit Editor Component */}
                <BlogEditor
                  value={postContent}
                  onChange={setPostContent}
                  placeholder="Write your blog post content here. Use the rich formatting toolbar to add structure, emphasis, links, and media to your content..."
                />
              </div>

              {/* SEO METADATA PANEL COMPILER CARD */}
              <div className="lg:col-span-12 premium-card p-6 rounded-2xl border border-white/5 space-y-6">
                
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#C7C4D8] uppercase tracking-wider border-b border-white/5 pb-3">
                  <Globe size={14} className="text-indigo-400" />
                  <span>SEO METADATA COMPILER (DYNAMIC PREVIEW GOOGLE, CANVAS & TWITTER CARDS)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* SEO Title Tag */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Search SEO Title (Limit: 70 chars)
                    </label>
                    <input
                      type="text"
                      placeholder="Designing High-Contrast Interfaces - Craft"
                      value={postSeoTitle}
                      onChange={(e) => setPostSeoTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg focus:outline-none text-xs text-white"
                      maxLength={120}
                    />
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Fallback: Post Title | The Craft Blog
                    </p>
                  </div>

                  {/* SEO Description Tag */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Search SEO Description (Limit: 160 chars)
                    </label>
                    <textarea
                      placeholder="Our structural guide investigating relative luminance..."
                      value={postSeoDescription}
                      onChange={(e) => setPostSeoDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg focus:outline-none text-xs text-slate-300"
                      rows={2}
                      maxLength={200}
                    />
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Fallback: Excerpt
                    </p>
                  </div>

                  {/* Tag Multi-Selector Selection library */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Associated Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-950 border border-slate-800 rounded-lg max-h-24 overflow-y-auto">
                      {tags.length === 0 ? (
                        <p className="text-[10px] italic text-[#C7C4D8]/55">First index tags in the parameters tab.</p>
                      ) : (
                        tags.map((tg) => {
                          const isSelected = postTags.includes(tg.name);
                          return (
                            <button
                              key={tg.id}
                              type="button"
                              onClick={() => toggleTagSelection(tg.name)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                                isSelected 
                                  ? "bg-indigo-600 text-white font-bold" 
                                  : "bg-slate-900 text-slate-400 hover:text-white"
                              }`}
                            >
                              #{tg.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5 bg-slate-950/30 p-4 rounded-xl">
                  {/* Google Preview mock */}
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Search results snapshot (Dynamic google render):</p>
                    <div className="bg-slate-900 border border-slate-850 p-4 rounded-lg flex flex-col">
                      <span className="text-slate-400 font-mono text-[10px]">https://ai.studio/build/blog/{postSlug || "your-slug"}</span>
                      <span className="text-indigo-400 font-bold text-sm leading-tight mt-0.5 truncate">{postSeoTitle || postTitle || "Your Blog Title | The Craft Blog"}</span>
                      <p className="text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed">{postSeoDescription || postExcerpt || "Blogging text markdown excerpt from writing canvas rendering description."}</p>
                    </div>
                  </div>

                  {/* Keywords Tag block metadata */}
                  <div>
                    <label className="text-xs font-semibold text-[#DAD7FF]/80 uppercase font-mono tracking-wider mb-1.5 block">
                      Search SEO Keywords (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="design, coding, performance, react"
                      value={postSeoKeywords}
                      onChange={(e) => setPostSeoKeywords(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg focus:outline-none text-xs text-white"
                    />
                  </div>
                </div>

              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
