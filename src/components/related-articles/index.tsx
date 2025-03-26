import { getAllArticles } from "@/lib/articles";
import BlogCard from "@/components/blog-card";
import styles from './style.module.scss';

export default function RelatedArticles() {
  const articles = getAllArticles().sort((a, b) => {
      const parseDate = (dateStr: string) => {
        return new Date(dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1"));
      };

      return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  return (
    <div className={styles.container}>
      <h2>
        Recent Articles
      </h2>
      <div className={styles.grid}>
        {articles.slice(0, 3).map((article) => (
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
      </div>
    </div>
  );
}