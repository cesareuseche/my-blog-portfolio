import Image from 'next/image';
import styles from './style.module.scss';

const BlogCard = () => {
  return (
    <div className={styles.card}>

      <div className={styles.details}>
        <p className={styles.date}>16. March 2022</p>
        <span className={styles.category}>ART</span>
      </div>

      <div className={styles.imageContainer}>
        <Image
          src="/assets/images/test-img.jpeg" // ✅ Correct
          alt="Hope dies last"
          width={614}
          height={409}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Hope dies last</h2>
        <p className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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