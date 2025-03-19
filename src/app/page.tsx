import fs from "fs";
import path from "path";
import Link from "next/link";

// ✅ Server-Side function to fetch all articles
function getArticles() {
  const articlesDir = path.join(process.cwd(), "src/app/articles");

  return fs
    .readdirSync(articlesDir)
    .filter((slug) => !slug.startsWith("["))
    .map((slug) => ({ slug, title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) }));
}

export default function Home() {
  const articles = getArticles();

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold">My Blog</h1>
      <ul className="mt-4 space-y-2">
        {articles.map(({ slug, title }) => (
          <li key={slug}>
            <Link href={`/articles/${slug}`} className="text-blue-500 hover:underline">
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
