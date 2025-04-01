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

const topics: Record<string, string> = {
  docker: "Docker is a platform for building, sharing, and running applications in containers. It helps developers streamline development and deployment.",
  api: "An API (Application Programming Interface) allows different software applications to communicate with each other. APIs are commonly used to fetch data, integrate services, and enable automation.",
  react: "React is a JavaScript library for building user interfaces, primarily for single-page applications. It allows developers to create reusable UI components.",
  nextjs: "Next.js is a React framework that enables server-side rendering, static site generation, and API routes. It provides optimized performance, SEO benefits, and built-in features like image optimization and middleware.",
};

const generateFallbackResponse = async (query: string) => {
  const apiKey = process.env.TOGETHER_API_KEY;

  if (!apiKey) {
    console.error("Together AI API key is missing!");
    return "I'm unable to fetch an AI response right now. Try again later!";
  }

  for (const key in topics) {
    if (query.includes(key)) {
      return topics[key];
    }
  }

  try {
    const response = await fetch("https://api.together.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Provide a concise but complete response (2-3 sentences max). Ensure the response ends with a full sentence. Format URLs as <a href='URL'>text</a> and wrap code snippets inside \`\`\` code \`\`\`.`,
        messages: [{ role: "user", content: query }],
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        temperature: 0.3,
        max_tokens: 250,
        top_p: 0.5,
      }),
    });

    const data = await response.json();

    const aiResponse = data.choices?.[0]?.message?.content?.trim() ||  "I couldn't find a precise answer, but you might find something useful in my blog!";
    return `${aiResponse}\n\nIf you need more details, check out my blog! I might have something related. If you have a specific topic in mind, please contact me!`;
  } catch (error) {
    console.error("Together AI error:", error);
    return "That's an interesting topic! Unfortunately, I don't have an article on that yet, but you might find something related in my blog.";
  }
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

    // If no match, provide a fallback response (Ensure we await it!)
    const fallbackResponse = await generateFallbackResponse(lowerMessage); // <-- Fix: Added await

    return NextResponse.json({
      reply: `${fallbackResponse} \n Feel free to explore my blog for more content!`,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json({ reply: "I'm having trouble responding right now. Try again later." });
  }
}
