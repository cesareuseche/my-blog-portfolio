import Image from 'next/image';
import styles from './style.module.scss';

type Props = {
  image: string;
  title: string;
  description: string;
  date: string;
};

const BlogCard = ({ image, title, description, date }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <p className={styles.date}>{date}</p>
        <span className={styles.category}>ART</span>
      </div>

      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          width={614}
          height={409}
          className={styles.image}
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
          <span className={styles.text}><strong>Text</strong> Jakob Gronberg</span>
          <span className={styles.duration}><strong>Duration</strong> 1 Min</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
