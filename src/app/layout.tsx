// app/layout.tsx
import type { Metadata } from "next";
import ClientLayout from "./layout/client-layout";
import "../styles/global.scss";

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
        alt: 'Glo2Facial'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
