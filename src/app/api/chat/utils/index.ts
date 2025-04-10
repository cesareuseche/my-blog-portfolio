import { fuse, cleanQuery, articles, type Article } from "../core/fuse";

const typedArticles: Article[] = articles as Article[];
import { summarizeArticle } from "../core/summarize";
import { userSessions } from "../core/session";

export function isRequestingArticlesByTopic(query: string) {
  const patterns = [
    /show\s+(?:me\s+)?(?:all\s+)?(?:the\s+)?articles\s+(?:about|on|related\s+to)\s+(\w+)/i,
    /articles\s+(?:about|on|related\s+to)\s+(\w+)/i,
    /(\w+)\s+articles/i
  ];
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match && match[1]) return match[1].toLowerCase();
  }
  return null;
}

export function extractReferencedArticle(query: string, sessionId: string, currentSlug?: string) {
  const ordinalMap: Record<string, number> = {
    "first": 0, "1st": 0, "second": 1, "2nd": 1, "third": 2, "3rd": 2,
  };
  const lower = query.toLowerCase();
  const recent = userSessions[sessionId]?.recentArticles;

  for (const [key, index] of Object.entries(ordinalMap)) {
    if (lower.includes(key) && recent?.[index]) return recent[index];
  }
    if (currentSlug) return typedArticles.find((a: Article) => a.url.includes(currentSlug));
  if (lower.includes("that article") || lower.includes("this article") || lower.includes("it")) {
    if (currentSlug) return articles.find((a: Article) => a.url.includes(currentSlug));
    if (recent?.length) return recent[0];
  }
  return null;
}

export function findRelatedArticles(query: string) {
  const topic = isRequestingArticlesByTopic(query);
  if (topic) {
    const fields: Array<keyof Article> = ["title", "tag", "description"];
    for (const field of fields) {
      const match = articles.filter((a: Article) => a[field].toLowerCase().includes(topic));
      if (match.length > 0) return match;
    }
  }
  const cleaned = cleanQuery(query);
  if (!cleaned) return [];
  return fuse.search(cleaned).filter(r => r.score! < 0.6).map(r => r.item);
}

export async function isRequestingArticleSummary(query: string, sessionId: string, currentSlug?: string) {
  const summaryPatterns = [
    /summarize\s+(?:the\s+)?(?:article\s+)?(?:about|on|related\s+to)?\s*(.+)/i,
    /give\s+me\s+(?:a\s+)?summary\s+(?:of\s+)?(?:the\s+)?(?:article\s+)?(?:about|on|related\s+to)?\s*(.+)/i,
    /can\s+you\s+summarize\s+(?:this|that|the\s+\w+)?\s*article/i,
    /can\s+you\s+summarize\s+it/i,
    /summarize\s+it/i,
  ];

  for (const pattern of summaryPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const topic = match[1].toLowerCase().trim();
      const result: Article | undefined = fuse.search(topic).filter((r: { score?: number; item: Article }) => r.score! < 0.3)[0]?.item;
      if (result) {
        const summary = await summarizeArticle(result);
        if (summary) return {
          title: result.title,
          description: result.description,
          url: result.url,
          summary,
          preface: `Here’s a summary of the article titled \"${result.title}\":`,
        };
      }
    }
  }

  const referenced = extractReferencedArticle(query, sessionId, currentSlug);
  if (referenced) {
    const summary = await summarizeArticle(referenced);
    if (summary) return {
      title: referenced.title,
      description: referenced.description,
      url: referenced.url,
      summary,
      preface: `I think you're referring to the last article I showed. Here's a summary of \"${referenced.title}\":`,
    };
  }
  return null;
}