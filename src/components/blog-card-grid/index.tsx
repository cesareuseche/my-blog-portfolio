import { getAllArticles } from "@/lib/articles";
import styles from './style.module.scss';
import BlogCard from "@/components/blog-card";

export default function BlogCardGrid() {
  const articles = getAllArticles().sort((a, b) => {
    const parseDate = (dateStr: string) => {
      return new Date(dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1"));
    };
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  return (
    <section className={styles.container} aria-labelledby="blog-section">
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
            author={article.author}
            duration={article.duration}
          />
        </div>
      ))}
    </section>
  )
}
