import { getArticle } from "@/lib/articles";
import Article from "../article";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | Blog+++",
      description: "This article does not exist.",
    };
  }

  return {
    title: `${article.title} | Blog+++`,
    description: article.description,
    alternates: {
      canonical: `https://blogplusplus.com/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url: `https://blogplusplus.com/articles/${slug}`,
      images: [{ url: article.image, alt: article.title, width: 800, height: 600 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [{ url: article.image, alt: article.title, width: 800, height: 600 }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return <h1>404 - Article Not Found</h1>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author ?? "Blog+++",
      "url": "https://blogplusplus.com",
      "image": {
        "@type": "ImageObject",
        "url": article.image,
        "width": 800,
        "height": 600
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Blog+++",
      "logo": {
        "@type": "ImageObject",
        "url": article.image,
        "width": 800,
        "height": 600
      }
    },
    "datePublished": article.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blogplusplus.com/articles/${slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Article
        image={article.image}
        title={article.title}
        description={article.description}
        date={article.date}
        content={article.content}
        tag={article.tag}
        author={article.author}
        duration={article.duration}
        category={article.category}
      />
    </>
  );
}

// Ensure correct return type for generateStaticParams
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { getAllArticles } = await import("@/lib/articles");
  const articles = getAllArticles();

  return articles.map((article) => ({ slug: article.slug }));
}
