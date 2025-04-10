import type { Metadata } from "next";
import Action from "../../components/action";
import ProfileCard from "../../components/profile-card";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "About Me | Blog+++",
  description: "Learn more about me, my background, and my journey in the tech world.",
  keywords: "software engineer, web developer, tech enthusiast",
  authors: [{ name: "Cesar Useche" }],
  creator: "Cesar Useche",
  publisher: "Cesar Useche",
  openGraph: {
    title: "About Me",
    description: "Learn more about me, my background, and my journey in the tech world.",
    url: "https://blogplusplus.com/about",
    siteName: "Tech, Code & Life | Blog+++",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/assets/images/blog-thumbnail.webp',
        width: 800,
        height: 600,
        alt: 'About Me | Blog+++'
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me",
    description: "Learn more about me, my background, and my journey in the tech world.",
    creator: "@cesaruseche"
  }
};

export default function AboutPage() {
  return (
    <main role="main" className={styles.container}>
      <Action category="About" />
      <ProfileCard  />
    </main>
  )
}