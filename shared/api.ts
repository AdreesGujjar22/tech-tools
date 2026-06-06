export interface DemoResponse {
  message: string;
}

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  status: "draft" | "published";
  readingTime?: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
}

export interface Tag {
  id?: string;
  name: string;
  slug: string;
}
