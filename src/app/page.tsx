import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import BlogCard from "@/components/blog-card";
import styles from '../styles/home.module.scss';

export default function Home() {
  const articles = getAllArticles();

  return (
    <main className={styles.container}>
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <BlogCard />
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

