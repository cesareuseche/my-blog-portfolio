import { getArticle } from "@/lib/articles";
import ArticleClient from "./article-client";
import { Metadata } from "next";

// Define the correct type where params is an async function
type PageProps = {
  params: Promise<{ slug: string }>;
};

// Ensure correct typing for params in generateMetadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ Correct since params is a Promise
  const article = getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | My Blog",
      description: "This article does not exist.",
    };
  }

  return {
    title: `${article.title} | My Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url: `/articles/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

// Ensure correct typing for params in ArticlePage
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params; // ✅ Correct since params is a Promise

  const article = getArticle(slug);
  if (!article) return <h1>404 - Article Not Found</h1>;

  return (
    <ArticleClient
      image={article.image}
      title={article.title}
      description={article.description}
      date={article.date}
      content={article.content}
      tag={article.tag}
      author={article.author}
      duration={article.duration}
    />
  );
}

// Ensure correct return type for generateStaticParams
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { getAllArticles } = await import("@/lib/articles");
  const articles = getAllArticles();

  return articles.map((article) => ({ slug: article.slug }));
}
