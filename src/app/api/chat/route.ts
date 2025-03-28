import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";
import matter from "gray-matter";

const CONTACT_PAGE_URL = "/contact";
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

// Load and index articles with Fuse.js
const loadArticles = () => {
  const files = fs.readdirSync(ARTICLES_DIR);
  return files
    .filter((file) => fs.statSync(path.join(ARTICLES_DIR, file)).isFile())
    .map((file) => {
      const rawContent = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      const { data, content } = matter(rawContent);
      return {
        title: data.title || file.replace(".md", ""),
        description: data.description || content.substring(0, 150) + "...",
        tag: (data.tag || "").toLowerCase(),
        category: (data.category || "").toLowerCase(),
        content: content.toLowerCase(),
        url: `/articles/${file.replace(".md", "")}`,
      };
    });
};

const articles = loadArticles();
const fuse = new Fuse(articles, {
  keys: [
    { name: "title", weight: 0.6 },
    { name: "description", weight: 0.4 },
    { name: "tag", weight: 0.3 },
    { name: "category", weight: 0.3 },
    { name: "content", weight: 0.2 },
  ],
  threshold: 0.7, // Looser match for better results
  minMatchCharLength: 2,
  includeScore: true,
});

// Function to clean the query
const cleanQuery = (query: string) => {
  return query
    .toLowerCase()
    .replace(/\b(what|is|how|do|i|a|the|of|in|on|to|for|with|about|any|articles|have|know)\b/g, "")
    .trim();
};

// Function to generate a fallback response
const generateFallbackResponse = (query: string) => {
  if (query.includes("docker")) {
    return "Docker is a platform for building, sharing, and running applications in containers. It helps developers streamline development and deployment.";
  } else if (query.includes("api")) {
    return "An API (Application Programming Interface) allows different software applications to communicate with each other. APIs are commonly used to fetch data, integrate services, and enable automation.";
  } else if (query.includes("react")) {
    return "React is a JavaScript library for building user interfaces, primarily for single-page applications. It allows developers to create reusable UI components.";
  } else {
    return "That's an interesting topic! Unfortunately, I don't have an article on that yet, but you might find something related in my blog.";
  }
};

// Function to find related articles
function findRelatedArticles(query: string) {
  const cleanedQuery = cleanQuery(query);

  if (cleanedQuery === "") {
    return articles; // Return all articles for very broad queries
  }

  // First try the fuzzy search with Fuse.js
  const results = fuse.search(cleanedQuery);

  // Be a bit more lenient with the threshold to catch more potential matches
  const matchedArticles = results
    .filter((result) => result.score !== undefined && result.score < 0.6)
    .map((result) => result.item);

  if (matchedArticles.length > 0) {
    return matchedArticles;
  }

  // If no matches from Fuse.js, try a more targeted keyword approach
  const queryTerms = cleanedQuery.split(/\s+/).filter(term => term.length > 2);

  if (queryTerms.length === 0) {
    return []; // No valid search terms
  }

  // Calculate a relevance score for each article
  const scoredArticles = articles.map(article => {
    const articleText = `${article.title.toLowerCase()} ${article.description.toLowerCase()} ${article.tag.toLowerCase()} ${article.category.toLowerCase()}`;
    let matchCount = 0;

    queryTerms.forEach(term => {
      if (articleText.includes(term)) {
        matchCount++;
      }
    });

    // Calculate percentage of terms matched
    const relevanceScore = matchCount / queryTerms.length;

    return {
      article,
      relevanceScore
    };
  });

  // Only return articles with at least 30% of the query terms matched
  return scoredArticles
    .filter(item => item.relevanceScore >= 0.3)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map(item => item.article)
    .slice(0, 3); // Limit to top 3 most relevant results
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lowerMessage = message.toLowerCase();

    // Contact page check
    if (lowerMessage.includes("contact") || lowerMessage.includes("email")) {
      return NextResponse.json({
        reply: `You can reach me here: - [Contact Page](${CONTACT_PAGE_URL})`,
      });
    }

    // Search for related articles
    const relatedArticles = findRelatedArticles(lowerMessage);
    if (relatedArticles.length > 0) {
      const articleList = relatedArticles
        .map((a) => `- [${a.title}](${a.url})  \n${a.description}`)
        .join("\n\n");

      return NextResponse.json({
        reply: `Here are some articles you might find useful:\n\n${articleList}`,
      });
    }

    // If no match, provide a fallback response
    const fallbackResponse = generateFallbackResponse(lowerMessage);
    return NextResponse.json({
      reply: `${fallbackResponse} Feel free to explore my blog for more content!`,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json({ reply: "I'm having trouble responding right now. Try again later." });
  }
}
