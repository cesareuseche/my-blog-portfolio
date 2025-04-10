import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export const loadArticles = () => {
  const files = fs.readdirSync(ARTICLES_DIR);
  return files
    .filter((file) => fs.statSync(path.join(ARTICLES_DIR, file)).isFile())
    .map((file) => {
      const rawContent = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      const { data, content } = matter(rawContent);
      return {
        title: data.title || file.replace(".md", ""),
        description: data.description || content.substring(0, 150) + "...",
        tag: (data.tag || "").toLowerCase(),
        content: content.toLowerCase(),
        url: `/articles/${file.replace(".md", "")}`,
      };
    });
};