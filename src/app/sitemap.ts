import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { getAllArticles } = await import("@/lib/articles");
  const articles = getAllArticles();

  const baseUrl = "https://blogplusplus.com";

  const staticPages = [
    { loc: `${baseUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/contact`, changefreq: "monthly", priority: "0.7" },
  ];

  const staticUrls = staticPages
    .map(
      (page) => `
    <url>
      <loc>${page.loc}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
    )
    .join("");

  const articleUrls = articles
    .map(
      (article) => `
    <url>
      <loc>${baseUrl}/articles/${article.slug}</loc>
      <lastmod>${article.date}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  >
    ${staticUrls}
    ${articleUrls}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
