import React from "react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  FileText,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  Users,
  FolderOpen,
  Tag,
} from "lucide-react";

interface AdminDashboardProps {
  articles: any[];
  categories: any[];
  tags: any[];
  onCreatePost: () => void;
  onEditPost: (post: any) => void;
}

export default function AdminDashboard({
  articles,
  categories,
  tags,
  onCreatePost,
  onEditPost,
}: AdminDashboardProps) {
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div>
        <span className="text-xs font-mono text-primary uppercase tracking-widest">
          CMS ADMINISTRATIVE
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-2">Control Panel</h1>
        <p className="text-muted-foreground max-w-2xl">
          Manage posts, categories, tags, and configure SEO metadata for your blog.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Articles"
          value={articles.length}
          icon={<FileText className="w-6 h-6" />}
          gradient="indigo"
        />
        <StatCard
          label="Published"
          value={publishedCount}
          icon={<Eye className="w-6 h-6" />}
          change={{ value: publishedCount > draftCount ? 5 : -3, type: "increase" }}
          gradient="emerald"
        />
        <StatCard
          label="Drafts"
          value={draftCount}
          icon={<EyeOff className="w-6 h-6" />}
          gradient="blue"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={<FolderOpen className="w-6 h-6" />}
          gradient="purple"
        />
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">Articles ({articles.length})</TabsTrigger>
          <TabsTrigger value="taxonomy">Taxonomy ({categories.length + tags.length})</TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          {articles.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by creating your first blog post.
              </p>
              <button
                onClick={onCreatePost}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl brand-gradient text-white font-semibold"
              >
                Create Post
              </button>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border/40">
              <table className="w-full">
                <thead className="bg-card/50 border-b border-border/40">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {articles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-card/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <Badge
                          variant={article.status === "published" ? "success" : "warning"}
                        >
                          {article.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground truncate max-w-xs">
                          {article.title}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {article.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {article.createdAt}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onEditPost(article)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-accent transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Taxonomy Tab */}
        <TabsContent value="taxonomy">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No categories yet
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="px-4 py-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                      >
                        <p className="font-semibold text-sm">{cat.name}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8 w-full">
                      No tags yet
                    </p>
                  ) : (
                    tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
