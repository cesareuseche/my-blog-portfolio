import BlogCardGrid from '@/components/blog-card-grid';
import styles from '../styles/home.module.scss';
import HomepageHero from '@/components/hp-hero';
import HomepageTitle from '@/components/hp-title';

export default function Home() {
  return (
    <main className={styles.container}>
      <HomepageHero />
      <HomepageTitle />
      <BlogCardGrid />
    </main>
  );
}

