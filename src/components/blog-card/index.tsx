import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

type Props = {
  image: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  slug: string;
  id: number;
  duration: string;
  author: string;
};

const BlogCard = ({ image, title, description, date, tag, slug, author, duration }: Props) => {
  return (
    <article className={styles.card}>

      <Link href={`/articles/${slug}`}></Link>

      <div className={styles.details}>
        <p className={styles.date}>
          {date}
        </p>
        <span className={styles.tag}>
          {tag}
        </span>
      </div>

      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          width={614}
          height={409}
          className={styles.image}
          loading='lazy'
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>
          {description}
        </p>
        <div className={styles.meta}>
          <span className={styles.text}><strong>Text</strong>
            {author}
          </span>
          <span className={styles.duration}><strong>Duration</strong>
            {duration}
          </span>
        </div>
      </div>

    </article>
  );
};

export default BlogCard;
