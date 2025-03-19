import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ArticleClient from "./article-client";

type Props = { params: { slug: string } };

// ✅ Server-Side function to fetch article content
function getArticle(slug: string) {
  const filePath = path.join(process.cwd(), "src/app/articles", slug, "content.md");

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    date: data.date || "Unknown Date",
    content,
  };
}

// ✅ Server Component (Loads Markdown File)
export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);

  if (!article) return <h1>404 - Article Not Found</h1>;

  return <ArticleClient title={article.title} date={article.date} content={article.content} />;
}
