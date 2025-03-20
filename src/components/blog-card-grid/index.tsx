import { getAllArticles } from "@/lib/articles";
import styles from './style.module.scss';
import BlogCard from "@/components/blog-card";

export default function BlogCardGrid() {
  const articles = getAllArticles();
  return (
    <main className={styles.container}>
      {articles.map((article) => (
        <div key={article.slug} className={styles.article}>
          <BlogCard
            image={article.image}
            title={article.title}
            description={article.description}
            date={article.date}
            tag={article.tag}
            slug={article.slug}
          />
        </div>
      ))}
    </main>
  )
}