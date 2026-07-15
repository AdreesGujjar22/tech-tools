"use client";

"use client";

import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

import { Blog, Category , Tag } from "@shared/api";
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
  Globe,
  Heading2,
  Link as LinkIcon,
  Zap,
  Folder,
  Pin,
  Clock,
  PenTool,
  Search,
  Sparkles as Rainbow
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";

const BlogEditor = dynamic(() => import("@/components/admin/BlogEditor"), {
  ssr: false,
  loading: () => <p className="animate-pulse text-slate-400 p-8 text-center text-sm">Loading editor...</p>,
});

const ImageUploader = dynamic(() => import("@/components/admin/ImageUploader"), {
  ssr: false,
  loading: () => <p className="animate-pulse text-slate-400 p-4 text-sm">Loading uploader...</p>,
});

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
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

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
  const [saveError, setSaveError] = useState("");

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

      const articlesSnap = await Promise.race([
        getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc"))),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000))
      ]);

      (articlesSnap as any).forEach((docSnap: any) => {
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

      const categoriesSnap = await Promise.race([
        getDocs(collection(db, "categories")),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000))
      ]);
      (categoriesSnap as any).forEach((d: any) => {
        const data = d.data() as any;
        fetchedCats.push({ id: d.id, name: data.name, slug: data.name });
      });

      const tagsSnap = await Promise.race([
        getDocs(collection(db, "tags")),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000))
      ]);
      (tagsSnap as any).forEach((d: any) => {
        const data = d.data() as any;
        fetchedTags.push({ id: d.id, name: data.name, slug: data.name });
      });

      setArticles(fetchedArticles);
      setCategories(fetchedCats);
      setTags(fetchedTags);

    } catch (error) {
      console.error("Error fetching CMS database: ", error);
      toast.error(error instanceof Error ? error.message : "Could not fetch CMS data.");
    } finally {
      setCmsLoading(false);
    }
  }

  // Handle Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAuthError("");
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      const message = "Enter your email address.";
      setAuthError(message);
      toast.error(message);
      emailInputRef.current?.focus();
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      const message = "Enter a valid email address.";
      setAuthError(message);
      toast.error(message);
      emailInputRef.current?.focus();
      return;
    }

    if (!password) {
      const message = "Enter your password.";
      setAuthError(message);
      toast.error(message);
      passwordInputRef.current?.focus();
      return;
    }

    try {
      setSigningIn(true);
      await loginWithEmail(normalizedEmail, password);
      toast.success("Welcome back. Your admin workspace is ready.");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      const errorMessage = error?.message || "We could not sign you in. Please try again.";
      setAuthError(errorMessage);
      toast.error(errorMessage);
      if (errorMessage.toLowerCase().includes("email")) {
        emailInputRef.current?.focus();
      } else {
        passwordInputRef.current?.focus();
      }
    } finally {
      setSigningIn(false);
    }
  };

  // Add / Remove Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const slug = newCategory.toLowerCase().trim().replace(/\s+/g, "-");
    try {
      const ref = doc(db, "categories", slug);
      await setDoc(ref, { name: newCategory.trim(), slug });
      toast.success("Category added to Firebase!");
    } catch (err) {
      console.error("Could not add category to Firebase:", err);
      toast.error(err instanceof Error ? err.message : "Could not add category. Please try again.");
    }
    setNewCategory("");
    fetchCmsData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      toast.success("Category deleted from Firebase.");
    } catch (err) {
      console.error("Could not delete category from Firebase:", err);
      toast.error(err instanceof Error ? err.message : "Could not delete category. Please try again.");
    }
    fetchCmsData();
  };

  // Add / Remove Tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const slug = newTag.toLowerCase().trim().replace(/\s+/g, "-");
    try {
      const ref = doc(db, "tags", slug);
      await setDoc(ref, { name: newTag.trim(), slug });
      toast.success("Tag added to Firebase!");
    } catch (err) {
      console.error("Could not add tag to Firebase:", err);
      toast.error(err instanceof Error ? err.message : "Could not add tag. Please try again.");
    }
    setNewTag("");
    fetchCmsData();
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      await deleteDoc(doc(db, "tags", id));
      toast.success("Tag deleted from Firebase.");
    } catch (err) {
      console.error("Could not delete tag from Firebase:", err);
      toast.error(err instanceof Error ? err.message : "Could not delete tag. Please try again.");
    }
    fetchCmsData();
  };

  // Post Submission / Saving (Create & Update workflows)
  const savePostSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaveError("");
    if (!postTitle || !postSlug || !postContent) {
      const message = "Please fill in Title, Slug, and content.";
      setSaveError(message);
      toast.error(message);
      return;
    }


    try {
      setSavingPost(true);
      
      const blogsRef = collection(db, "blogs");
      const dupQuery = query(blogsRef, where("slug", "==", postSlug));
      const dupSnap = await getDocs(dupQuery);
      if (dupSnap.docs.some((duplicate) => duplicate.id !== editingPostId)) {
        const message = "Slug already exists! Please write a unique slug.";
        setSaveError(message);
        toast.error(message);
        setSavingPost(false);
        return;
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

      if (editingPostId) {
        const docRef = doc(db, "blogs", editingPostId);
        await setDoc(docRef, postData, { merge: true });
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
      await fetchCmsData();
      resetPostForm();
      setCmsView("list");
    } catch (err: any) {
      const message = err?.message || "Could not save post. Please try again.";
      console.error("Could not save post to Firebase:", err);
      setSaveError(message);
      toast.error(message);
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
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("Post deleted from Firebase.");
    } catch (err) {
      console.error("Could not delete post from Firebase:", err);
      toast.error(err instanceof Error ? err.message : "Could not delete post. Please try again.");
    }
    fetchCmsData();
  };

  const handlePostStatusToggle = async (postItem: Blog) => {
    const nextStatus = postItem.status === "draft" ? "published" : "draft";

    try {
      await setDoc(doc(db, "blogs", postItem.id!), {
        status: nextStatus,
        updatedAt: new Date()
      }, { merge: true });
      toast.success(`Post status toggled to ${nextStatus}!`);
    } catch (error) {
      console.error("Could not update post status in Firebase:", error);
      toast.error(error instanceof Error ? error.message : "Could not update post status. Please try again.");
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
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <p className="text-sm font-mono text-primary">Preparing your workspace...</p>
      </div>
    );
  }

  // View Gate 1: No User Authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md premium-card p-8 rounded-2xl border border-border relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 left-0 right-0 h-1 brand-gradient" />
          
          <div className="text-center mb-8">
            <Layers className="mx-auto text-primary mb-2" size={36} />
            <span className="text-[10px] font-mono tracking-widest uppercase text-primary/80">
              Tech Tool Blog Station
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              CMS Admin Access
            </h2>
            <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
              Sign in to continue.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground/80 uppercase font-mono tracking-wider mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                  <UserIcon className="text-primary" size={16} />
                </span>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setAuthError(""); }}
                  placeholder="name@company.com"
                  aria-invalid={Boolean(authError)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl focus:outline-none placeholder-slate-400 text-sm text-foreground transition-colors ${authError ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 uppercase font-mono tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                  <Key className="text-primary" size={16} />
                </span>
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
                  placeholder="••••••••"
                  aria-invalid={Boolean(authError)}
                  className={`w-full pl-10 pr-12 py-2.5 bg-white border rounded-xl focus:outline-none placeholder-slate-400 text-sm text-foreground transition-colors ${authError ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            {authError && <p className="text-sm text-red-600" role="alert">{authError}</p>}

            <button
              type="submit"
              disabled={signingIn}
              className="w-full py-3 rounded-xl brand-gradient hover:opacity-90 font-bold text-primary-foreground transition-all text-sm shadow-lg shadow-indigo-600/20 hover:active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {signingIn ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
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
      <div className="min-h-screen bg-background text-foreground pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-lg premium-card p-8 rounded-2xl border border-border text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
          <ShieldAlert className="mx-auto text-red-500 mb-4 animate-pulse" size={48} />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto mb-6">
            Your credentials do not have admin access. Please contact the site administrator.
          </p>
        </div>
      </div>
    );
  }

  // Core Authorized CMS Layout
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Core View 1: Articles and Taxonomies Lists */}
        {cmsView === "list" && (
          <div>
            
            {/* Dashboard Welcome header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border mb-8">
              <div>
                <span className="text-xs font-mono text-primary uppercase tracking-widest">
                  CONTENT WORKSPACE
                </span>
                <h1 className="text-4xl font-bold font-sans tracking-tight text-foreground mt-1">
                  Your publishing workspace
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Create, edit, and publish helpful content from one simple place.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openPostEditor()}
                  className="px-5 py-3 rounded-lg brand-gradient hover:opacity-90 text-primary-foreground font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <Plus size={16} />
                  New post
                </button>
              </div>
            </div>

            {/* Admin Index Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="metrics-panel">
              <div className="premium-card p-5 rounded-xl border border-border">
                <span className="text-xs font-mono tracking-wider text-muted-foreground/80 block">TOTAL ARTICLES</span>
                <span className="text-3xl font-black text-foreground mt-1 block">{articles.length}</span>
              </div>
              <div className="premium-card p-5 rounded-xl border border-border">
                <span className="text-xs font-mono tracking-wider text-muted-foreground/80 block">PUBLISHED POSTS</span>
                <span className="text-3xl font-black text-primary mt-1 block">
                  {articles.filter(a => a.status === "published").length}
                </span>
              </div>
              <div className="premium-card p-5 rounded-xl border border-border">
                <span className="text-xs font-mono tracking-wider text-muted-foreground/80 block">SAVED DRAFTS</span>
                <span className="text-3xl font-black text-amber-600 mt-1 block">
                  {articles.filter(a => a.status === "draft").length}
                </span>
              </div>
              <div className="premium-card p-5 rounded-xl border border-border">
                <span className="text-xs font-mono tracking-wider text-muted-foreground/80 block">TAXONOMIES COUNT</span>
                <span className="text-3xl font-black text-emerald-600 mt-1 block">
                  {categories.length + tags.length}
                </span>
              </div>
            </div>

            {/* Workspace Tab bar toggles */}
            <div className="flex border-b border-border mb-8">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-3 px-6 font-semibold text-sm transition-all relative ${
                  activeTab === "posts" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Articles ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab("taxonomies")}
                className={`py-3 px-6 font-semibold text-sm transition-all relative ${
                  activeTab === "taxonomies" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Categories & tags ({categories.length + tags.length})
              </button>
            </div>

            {/* Loader inside dynamic components */}
            {cmsLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="animate-spin text-primary mx-auto mb-4" size={32} />
                <p className="text-xs text-primary font-mono">Loading your content...</p>
              </div>
            ) : activeTab === "posts" ? (
              
              /* POSTS ARCHIVE DIRECTORY LIST */
              <div className="space-y-4">
                {articles.length === 0 ? (
                  <div className="premium-card p-12 text-center rounded-xl max-w-md mx-auto">
                    <FileText className="text-primary mb-3 mx-auto opacity-40" size={36} />
                    <h3 className="font-semibold text-foreground mb-1">Your story starts here</h3>
                    <p className="text-muted-foreground/80 text-xs mb-4">
                      Create your first article and share something useful with your audience.
                    </p>
                    <button
                      onClick={() => openPostEditor()}
                      className="px-4 py-2 brand-gradient text-primary-foreground rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Create an article
                    </button>
                  </div>
                ) : (
                  <div className="premium-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse bg-background">
                      <thead>
                        <tr className="border-b border-border bg-muted/30 font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                          <th className="py-4 px-6 font-normal">State</th>
                          <th className="py-4 px-6 font-normal">Title</th>
                          <th className="py-4 px-6 font-normal">Category</th>
                          <th className="py-4 px-6 font-normal">Created At</th>
                          <th className="py-4 px-6 font-normal">SEO Slug</th>
                          <th className="py-4 px-6 font-normal text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {articles.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/30 transition-colors text-sm text-foreground">
                            
                            {/* State Column */}
                            <td className="py-4 px-6">
                              <button
                                onClick={() => handlePostStatusToggle(item)}
                                className={`px-2.5 py-1 rounded inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider font-mono cursor-pointer ${
                                  item.status === "published"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
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
                            <td className="py-4 px-6 font-bold text-foreground max-w-xs truncate">
                              {item.title}
                            </td>

                            {/* Category */}
                            <td className="py-4 px-6 font-mono text-xs">
                              {item.category}
                            </td>

                            {/* Custom Date formatting */}
                            <td className="py-4 px-6 font-mono text-xs text-muted-foreground/80">
                              {item.createdAt}
                            </td>

                            {/* SEO Slug */}
                            <td className="py-4 px-6 text-muted-foreground/80 text-xs">
                              <span className="font-mono text-primary">/blog/</span>
                              <span className="underline">{item.slug}</span>
                            </td>

                            {/* Actions Column */}
                            <td className="py-4 px-6 text-right">
                              <div className="inline-flex gap-2.5 justify-end">
                                <Link
                                  to={`/blog/${item.slug}`}
                                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-all border border-primary/20"
                                  title="View Article"
                                >
                                  <Eye size={14} />
                                </Link>
                                <button
                                  onClick={() => openPostEditor(item)}
                                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-all border border-primary/20"
                                  title="Edit Post"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(item.id!)}
                                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-200"
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
                  </div>
                )}
              </div>
            ) : (
              
              /* CATEGORIES & TAGS TAXONOMY ENGINE */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Category Board list */}
                <div className="premium-card p-6 rounded-xl border border-border">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-primary uppercase tracking-wider mb-2">
                    <Layers size={13} />
                    <span>CONTENT ORGANIZATION</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-6">
                    Categories
                  </h3>

                  {/* Add category form */}
                  <form onSubmit={handleAddCategory} className="flex gap-2.5 mb-6">
                    <input
                      type="text"
                      placeholder="E.g. Engineering, Design, Product..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-4 py-2 bg-card border border-border focus:border-primary rounded-lg focus:outline-none placeholder-slate-700 text-sm text-foreground"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 brand-gradient hover:opacity-90 text-foreground text-xs font-bold rounded-lg transition-all"
                    >
                      Add
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="text-xs font-mono text-muted-foreground p-2 italic">No custom categories registered.</p>
                    ) : (
                      categories.map((cat) => (
                        <div key={cat.id} className="px-4 py-2.5 rounded-lg bg-card/50 hover:bg-card border border-border flex justify-between items-center text-sm">
                          <span className="font-bold text-foreground">{cat.name}</span>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded bg-muted text-muted-foreground/80 border border-border">
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
                <div className="premium-card p-6 rounded-xl border border-border">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-primary uppercase tracking-wider mb-2">
                    <Settings size={13} />
                    <span>CONTENT LABELS</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-6">
                    Tags
                  </h3>

                  {/* Add tag form */}
                  <form onSubmit={handleAddTag} className="flex gap-2.5 mb-6">
                    <input
                      type="text"
                      placeholder="E.g. nextjs, drizzle, custom..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-4 py-2 bg-card border border-border focus:border-primary rounded-lg focus:outline-none placeholder-slate-700 text-sm text-foreground"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 brand-gradient hover:opacity-90 text-foreground text-xs font-bold rounded-lg transition-all"
                    >
                      Add
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto">
                    {tags.length === 0 ? (
                      <p className="text-xs font-mono text-muted-foreground p-2 italic">No custom tags indexed.</p>
                    ) : (
                      tags.map((tg) => (
                        <div key={tg.id} className="px-4 py-2.5 rounded-lg bg-card/50 hover:bg-card border border-border flex justify-between items-center text-sm">
                          <span className="font-bold text-foreground">#{tg.name}</span>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded bg-muted text-muted-foreground/80 border border-border">
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
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div>
                <button
                  onClick={() => setCmsView("list")}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 uppercase font-mono tracking-widest mb-2 cursor-pointer pb-1"
                >
                  <ArrowLeft size={12} /> Back to workspace
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">
                  {editingPostId ? "Edit article" : "Create an article"}
                </h1>
                {saveError && (
                  <p className="mt-2 max-w-xl text-sm text-red-600" role="alert">
                    {saveError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCmsView("list")}
                  className="px-4 py-2.5 rounded-xl bg-card hover:bg-muted border border-border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void savePostSubmit()}
                  disabled={savingPost}
                  className="px-5 py-2.5 rounded-xl brand-gradient hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  {savingPost ? <RefreshCw className="animate-spin" size={12} /> : null}
                  Save Post
                </button>
              </div>
            </div>

            {/* Split Grid - Left Editor, Right Live Markdown Reader */}
            <form onSubmit={savePostSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="editorial-form">
              
              <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 premium-card p-6">
                {/* Left side variables configurations */}
                <div className="md:col-span-8 space-y-5">
                  
                  {/* Post Title & auto generating Slug */}
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                      <Heading2 size={16} className="text-primary" />
                      Post Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your blog post title here"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none placeholder:text-muted-foreground text-foreground font-semibold transition"
                      required
                    />
                  </div>

                  {/* Slug field with Manual Override control */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider block flex items-center gap-2">
                        <LinkIcon size={16} className="text-primary" />
                        URL Address *
                      </label>
                      <button
                        type="button"
                        aria-pressed={autoSlug}
                        onClick={() => setAutoSlug(!autoSlug)}
                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/25 ${
                          autoSlug
                            ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                            : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span
                          className={`relative h-4 w-7 rounded-full transition-colors ${
                            autoSlug ? "bg-primary" : "bg-muted-foreground/40"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
                              autoSlug ? "translate-x-3.5" : "translate-x-0.5"
                            }`}
                          />
                        </span>
                        {autoSlug ? "Auto slug" : "Manual slug"}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono text-primary/60">
                        /blog/
                      </span>
                      <input
                        type="text"
                        placeholder="my-awesome-post-title"
                        value={postSlug}
                        onChange={(e) => {
                          setPostSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                          setAutoSlug(false);
                        }}
                        className="w-full pl-[70px] pr-4 py-3 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none font-mono text-sm text-foreground transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                      <Zap size={16} className="text-primary" />
                      Short Summary *
                    </label>
                    <textarea
                      placeholder="Write a brief 1-2 sentence summary of what this post is about"
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none placeholder:text-muted-foreground text-sm text-foreground resize-none transition"
                      rows={2}
                      maxLength={1000}
                    />
                  </div>

                </div>

                {/* Right side properties config panel */}
                <div className="md:col-span-4 space-y-4">
                  
                  {/* Category dropdown */}
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                      <Folder size={16} className="text-primary" />
                      Category
                    </label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground cursor-pointer transition"
                    >
                      <option value="General">General</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status drafting toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                        <Pin size={16} className="text-primary" />
                        Status
                      </label>
                      <select
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm text-foreground font-semibold cursor-pointer transition"
                      >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Public)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={postReadingTime}
                        onChange={(e) => setPostReadingTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm text-foreground text-center font-mono transition"
                        placeholder="5 min"
                      />
                    </div>
                  </div>

                  {/* Featured Header Image Upload */}
                  <ImageUploader
                    value={postFeaturedImage}
                    onChange={setPostFeaturedImage}
                    label="Featured Cover Image"
                    placeholder="Upload a cover image for your blog post"
                  />

                </div>
              </div>

              {/* Jodit Rich Text Editor Content Workstation */}
              <div className="lg:col-span-12 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider block flex items-center gap-2">
                      <PenTool size={16} className="text-primary" />
                      Write Your Content *
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Use the editor below to write your post. Add bold text, lists, images, links, and more.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 whitespace-nowrap px-3 py-1 bg-emerald-950/30 border border-emerald-900/30 rounded-lg">
                    ✓ Ready
                  </span>
                </div>

                {/* Jodit Editor Component */}
                <BlogEditor
                  value={postContent}
                  onChange={setPostContent}
                  placeholder="Start writing your post here. Use the toolbar to add formatting, images, links, and more..."
                />
              </div>

              {/* SEO METADATA PANEL COMPILER CARD */}
              <div className="lg:col-span-12 premium-card p-6 rounded-2xl border border-border space-y-6">
                
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider border-b border-primary/20 pb-4">
                  <Globe size={16} className="text-primary" />
                  <span>Search & Social Media Info (Optional)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* SEO Title Tag */}
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                      <Search size={16} className="text-primary" />
                      Search Title (What Google shows)
                    </label>
                    <input
                      type="text"
                      placeholder="My Post Title - Website Name"
                      value={postSeoTitle}
                      onChange={(e) => setPostSeoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground transition"
                      maxLength={120}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Leave empty to use your post title
                    </p>
                  </div>

                  {/* SEO Description Tag */}
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      Description (What shows in search)
                    </label>
                    <textarea
                      placeholder="Write a 2-3 sentence summary of what this post is about"
                      value={postSeoDescription}
                      onChange={(e) => setPostSeoDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground resize-none transition"
                      rows={2}
                      maxLength={200}
                    />
                  </div>

                  {/* Tag Multi-Selector Selection library */}
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                      <Pin size={16} className="text-primary" />
                      Tags (Click to add)
                    </label>
                    <div className="flex flex-wrap gap-2 p-4 bg-muted/30 border border-input rounded-xl max-h-24 overflow-y-auto">
                      {tags.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No tags yet. Create tags in the sidebar.</p>
                      ) : (
                        tags.map((tg) => {
                          const isSelected = postTags.includes(tg.name);
                          return (
                            <button
                              key={tg.id}
                              type="button"
                              onClick={() => toggleTagSelection(tg.name)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                isSelected
                                  ? "brand-gradient text-primary-foreground"
                                  : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                            >
                              {tg.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-primary/20 bg-indigo-950/10 p-5 rounded-xl">
                  {/* Google Preview mock */}
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">How it looks in Google Search</p>
                    <div className="bg-card border border-border p-4 rounded-lg flex flex-col">
                      <span className="text-muted-foreground font-mono text-xs">blog.website.com/{postSlug || "your-slug"}</span>
                      <span className="text-primary font-bold text-base leading-tight mt-1.5 truncate">{postSeoTitle || postTitle || "Your Blog Title"}</span>
                      <p className="text-foreground text-sm mt-1.5 line-clamp-2 leading-relaxed">{postSeoDescription || postExcerpt || "Your post description will show here"}</p>
                    </div>
                  </div>

                  {/* Keywords Tag block metadata */}
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider mb-2 block flex items-center gap-2">
                      <Search size={16} className="text-primary" />
                      Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="web design, coding tips, javascript, react"
                      value={postSeoKeywords}
                      onChange={(e) => setPostSeoKeywords(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-input hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground transition"
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
