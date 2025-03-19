import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul>
        {articles.map(({ slug, title, date }) => (
          <li key={slug} className="mb-4">
            <Link href={`/articles/${slug}`} className="text-blue-600 hover:underline">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-gray-500 text-sm">{date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

