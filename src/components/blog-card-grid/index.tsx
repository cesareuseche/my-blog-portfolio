import { getAllArticles } from "@/lib/articles";
import styles from './style.module.scss';
import BlogCard from "@/components/blog-card";

export default function BlogCardGrid() {

  const articles = getAllArticles().sort((a, b) => a.id - b.id);

  return (
    <main className={styles.container}>
      {articles.map((article) => (
        <div key={article.id} className={styles.article}>
          <BlogCard
            image={article.image}
            title={article.title}
            description={article.description}
            date={article.date}
            tag={article.tag}
            slug={article.slug}
            id={article.id}
          />
        </div>
      ))}
    </main>
  )
}