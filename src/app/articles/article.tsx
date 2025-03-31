import ArticleAction from "@/components/article-action";
import ArticleDetails from "@/components/article-details";
import RelatedArticles from "@/components/related-articles";
import ArticleClient from "./[slug]/article-client";
import styles from "./[slug]/style.module.scss";


type Props = {
  image: string;
  title: string;
  description: string;
  date: string;
  content: string;
  tag: string;
  author: string;
  duration: string;
  category: string;
};

export default function Article(props: Props) {
  return (
    <main role="main" className={styles.article}>
      <ArticleAction category={props.category} />

      <div className={styles.container}>
        <div className={styles.grid}>
          <aside className={styles.article__aside}>
            <div className={styles.article__sidebar}>
              <ArticleDetails image={props.image} date={props.date} author={props.author} duration={props.duration} />
            </div>
          </aside>
          <ArticleClient {...props} />
        </div>
      </div>
      <RelatedArticles />
    </main>
  );
}
