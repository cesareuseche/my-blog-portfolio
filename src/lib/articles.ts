import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

// Fetches all articles from the `content/articles` directory
export function getAllArticles() {
  return fs.readdirSync(ARTICLES_DIR).map((filename) => ({
    slug: filename.replace(".md", ""),
    ...getArticle(filename.replace(".md", "")),
  }));
}

// Fetch a single article based on the slug
export function getArticle(slug: string) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    date: data.date || "Unknown Date",
    content,
    description: data.description || "",
  };
}