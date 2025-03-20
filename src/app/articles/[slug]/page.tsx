import { getArticle } from "@/lib/articles";
import ArticleClient from "./article-client";
import { Metadata } from "next";

type Props = { params: { slug: string }};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

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
    />
  )
}

export async function generateStaticParams() {
  const { getAllArticles } = await import("@/lib/articles");
  const articles = getAllArticles();

  return articles.map((article) => ({ slug: article.slug }));
}
