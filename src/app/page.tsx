import type { Metadata } from "next";
import BlogCardGrid from '@/components/blog-card-grid';
import HomepageHero from '@/components/hp-hero';
import HomepageTitle from '@/components/hp-title';
import styles from '../styles/home.module.scss';

export const metadata: Metadata = {
  title: "Tech & Life Blog",
  description: "Explore insights on software engineering, web development, and life beyond code. A blog for tech enthusiasts and creatives alike.",
  keywords: "software engineering, web development, tech blog, programming, coding tutorials, developer life",
  authors: [{ name: "Cesar Useche" }],
  creator: "Cesar Useche",
  publisher: "Cesar Useche",
  openGraph: {
    title: "Tech & Life Blog",
    description: "Explore insights on software engineering, web development, and life beyond code. A blog for tech enthusiasts and creatives alike.",
    url: "https://tech-life-blog.com",
    siteName: "Tech & Life Blog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/assets/images/blog-thumbnail.webp',
        width: 800,
        height: 600,
        alt: 'Tech & Life Blog'
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech & Life Blog",
    description: "Explore insights on software engineering, web development, and life beyond code. A blog for tech enthusiasts and creatives alike.",
    creator: "@cesaruseche"
  }

};

export default function Home() {
  return (
    <main className={styles.container}>
      <HomepageHero />
      <HomepageTitle />
      <BlogCardGrid />
    </main>
  );
}

