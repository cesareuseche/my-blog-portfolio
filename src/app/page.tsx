import type { Metadata } from "next";
import BlogCardGrid from '@/components/blog-card-grid';
import HomepageHero from '@/components/hp-hero';
import HomepageTitle from '@/components/hp-title';
import styles from '../styles/home.module.scss';

export const metadata: Metadata = {
  title: "Tech, Code & Life | Blog+++",
  description: "Explore insights on software engineering, web development, and life beyond code. A blog for tech enthusiasts and creatives alike.",
  alternates: {
    canonical: "https://blogplusplus.com/",
  },
  keywords: "software engineering, web development, tech blog, programming, coding tutorials, developer life",
  authors: [{ name: "Cesar Useche" }],
  creator: "Cesar Useche",
  publisher: "Cesar Useche",
  openGraph: {
    title: "Tech, Code & Life Blog",
    description: "Explore insights on software engineering, web development, and life beyond code. A blog for tech enthusiasts and creatives alike.",
    url: "https://blogplusplus.com",
    siteName: "Blog+++",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/assets/images/blog-thumbnail.webp',
        width: 800,
        height: 600,
        alt: 'Tech & Life | Blog+++'
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech, Code & Life Blog",
    description: "Explore insights on software engineering, web development, and life beyond code. A blog for tech enthusiasts and creatives alike.",
    creator: "@cesaruseche"
  }
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Blog+++",
    "url": "https://blogplusplus.com",
    "description": "Explore insights on software engineering, web development, and life beyond code. A blog for tech enthusiasts and creatives alike.",
    "publisher": {
      "@type": "Person",
      "name": "Cesar Useche"
    }
  };

  return (
    <main className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageHero />
      <HomepageTitle />
      <BlogCardGrid />
    </main>
  );
}
