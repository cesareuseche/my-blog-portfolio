import { getArticle } from "@/lib/articles";
import ArticleClient from "./article-client";

type Props =
{ params: { slug: string }};

// ✅ Server Component (Fetches the Markdown Article)
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = getArticle(slug);
  if (!article) return <h1>404 - Article Not Found</h1>;

  return <ArticleClient title={article.title} date={article.date} content={article.content} />;
}

// ✅ Generate Static Paths (SSG for each article)
export async function generateStaticParams() {
  const { getAllArticles } = await import("@/lib/articles");
  const articles = getAllArticles();

  return articles.map((article) => ({ slug: article.slug }));
}
