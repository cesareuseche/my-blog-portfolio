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
        content: content.toLowerCase(),
        url: `/articles/${file.replace(".md", "")}`,
      };
    });
};

const articles = loadArticles();
const fuse = new Fuse(articles, {
  keys: [
    { name: "title", weight: 0.8 },
    { name: "description", weight: 0.5 },
    { name: "tag", weight: 0.7 },
    { name: "content", weight: 0.1 },
  ],
  threshold: 0.6,
  minMatchCharLength: 2,
  includeScore: true,
});

// Function to clean the query
const cleanQuery = (query: string) => {
  return query
    .toLowerCase()
    .replace(/\b(what|is|how|do|i|a|the|of|in|on|to|for|with|about|any|articles|have|know|can|you|show)\b/g, "")
    .trim();
};

// Function to generate a fallback response
const generateFallbackResponse = (query: string) => {
  const topics: Record<string, string> = {
    docker: "Docker is a platform for building, sharing, and running applications in containers. It helps developers streamline development and deployment.",
    api: "An API (Application Programming Interface) allows different software applications to communicate with each other. APIs are commonly used to fetch data, integrate services, and enable automation.",
    react: "React is a JavaScript library for building user interfaces, primarily for single-page applications. It allows developers to create reusable UI components.",
    nextjs: "React is a JavaScript library for building user interfaces, primarily for single-page applications. It allows developers to create reusable UI components.",
  };

  const matchedTopic = Object.keys(topics).find(topic => query.toLowerCase().includes(topic));
  return matchedTopic ? topics[matchedTopic] :
    "That's an interesting topic! Unfortunately, I don't have an article on that yet, but you might find something related in my blog.";
};

// Function to check if the query is asking for all articles about a topic
function isRequestingArticlesByTopic(query: string) {
  // Extract topic from direct requests for articles
  const articlePatterns = [
    /show\s+(?:me\s+)?(?:all\s+)?(?:the\s+)?articles\s+(?:about|on|related\s+to)\s+(\w+)/i,
    /articles\s+(?:about|on|related\s+to)\s+(\w+)/i,
    /(\w+)\s+articles/i
  ];

  // Extract topic from learning/tutorial questions
  const learningPatterns = [
    /how\s+(?:can|do)\s+(?:i|we|you)?\s+learn\s+(\w+)/i,
    /how\s+to\s+(?:learn|use|start\s+with)\s+(\w+)/i,
    /(?:teach|show)\s+me\s+(\w+)/i,
    /(?:beginner|getting\s+started|tutorial|learn|guide)\s+(?:for|with|on)?\s+(\w+)/i
  ];

  // Check article patterns first
  for (const pattern of articlePatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  }

  // Then check learning patterns
  for (const pattern of learningPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  }

  // If no direct pattern matches, try to extract topic from the query
  // Check if query contains specific technologies or topics
  const commonTopics = [
    "python", "javascript", "react", "node", "docker", "kubernetes",
    "aws", "nextjs", "typescript", "graphql", "mongodb", "sql", "frontend", "backend",
    "web accessibility", "accessibility"
  ];

  for (const topic of commonTopics) {
    if (query.toLowerCase().includes(topic)) {
      return topic;
    }
  }

  return null;
}

// Function to find related articles
function findRelatedArticles(query: string) {
  const topicRequest = isRequestingArticlesByTopic(query);

  if (topicRequest) {
    const priorityOrder: Array<keyof typeof articles[0]> = ["title", "tag", "description"];

    for (const key of priorityOrder) {
      const matches = articles.filter(article => article[key].toLowerCase().includes(topicRequest));
      if (matches.length > 0) return matches;
    }
  }

  // 🚨 Only use Fuse.js if no direct matches are found
  const cleanedQuery = cleanQuery(query);
  if (!cleanedQuery) return [];

  return fuse.search(cleanedQuery)
    .filter(result => result.score !== undefined && result.score < 0.6)
    .map(result => result.item);
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
