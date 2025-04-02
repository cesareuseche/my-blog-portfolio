---
title: "How to Implement AI Features in a NextJS Blog"
date: "March 31st 2025"
description: "AI is transforming online content interaction. This guide shows how to integrate AI features in a NextJS blog step-by-step guide"
image: "/assets/images/chatbot-nextjs.png"
tag: "NextJS 👨🏽‍💻"
id: 4
author: "Cesar Useche"
duration: "~10 min"
category: "TECH+++"
---
AI is changing how users interact with content online. If you have a blog built with [NextJS](https://nextjs.org/ 'NextJS'), integrating AI-powered features like search, chatbots, and content recommendations can boost user engagement and accessibility. This guide walks through implementing these features using open-source and cost-effective solutions.

In this guide you will learn how to set up a very basic blog and implement an AI feature like a chatbot, let's start.

## Why Use NextJS?

Next.js is a powerful React framework that offers server-side rendering (SSR), static site generation (SSG), and API routes out of the box. These features make it an excellent choice for an AI-powered blog by improving performance, SEO, and user experience. Additionally, Next.js seamlessly integrates with various AI tools, APIs, and serverless functions, making it easy to build dynamic and intelligent web applications.

## Why Use the App Router Instead of the Page Router?

Next.js introduced the App Router as a modern way to build applications, replacing the Page Router. Here’s why you should use the App Router for your AI-powered blog:

- **Server Components:** Reduce client-side JavaScript and improve performance.

- **Streaming and Suspense:** Load parts of your page progressively for a smoother user experience.

- **Simplified Data Fetching:** Use React’s use hook for fetching data in server components.

- **Better API and Middleware Support:** Easier handling of backend logic and API routes.

- **File-based Routing with Layouts:** Organize UI components more efficiently.

By leveraging the App Router, you get a more scalable, maintainable, and performant blog setup.

## 1. Setting Up a NextJS Blog with Markdown

To follow this guide, first, set up a simple blog where each post is stored as a Markdown file.

- **Steps to Create a Markdown-Based Blog**

``` sh
npx create-next-app@latest my-blog --experimental-app
cd my-blog
npm install gray-matter react-markdown
```

- **Organize Blog Content** Inside the content/articles folder, create Markdown files ```(.md)``` for each blog post.

``` sh
mkdir -p content/articles
echo "---\ntitle: 'My First Post'\ndate: '2025-04-01'\ntags: ['nextjs', 'blog']\n---\n\nThis is my first blog post." > content/articles/post-1.md
```

- **Load Markdown Content**
Create a directory named ```lib``` inside that create a ```article.ts``` file that is going to handle the Markdown files and convert them into structured data

``` ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export function getAllArticles() {
  return fs.readdirSync(ARTICLES_DIR).map((filename) => ({
    slug: filename.replace(".md", ""),
    ...getArticle(filename.replace(".md", "")),
  }));
}

export function getArticle(slug: string) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    date: data.date || "Unknown Date",
    content,
    description: data.description || "",
    image: data.image || "",
    tag: data.tag || "Uncategorized",
    id: data.id || "",
    author: data.author || "",
    duration: data.duration || "",
    category: data.category || "",
  };
}
```

- **Create a Dynamic Blog Post Page** In ```app/articles/[slug]/page.tsx```
``` tsx
import { getAllArticles } from "../../../lib/articles";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function BlogPost({ params }) {
  const articles = getAllArticles();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return notFound();

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.date}</p>
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </article>
  );
}
```

- **List Blog Posts on the Homepage** Update ```app/page.tsx```

``` tsx
import Link from "next/link";
import { getAllArticles } from "./lib/articles";

export default function Home() {
  const articles = getAllArticles();
  return (
    <div>
      <h1>My Blog</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 2. AI-Powered Search with Fuse.js

A robust search feature ensures readers find content quickly. [Fuse.js](https://www.fusejs.io/ 'FuseJS Library') is a flexible and powerful fuzzy search library that can efficiently index and search blog articles.

## Why Use Fuse.js

Here's a few reasons why I'm using Fuse.js for this example:

- **Lightweight & Fast:** Fuse.js is optimized for fuzzy search and does not require a backend database or indexing service, making it ideal for static site search.

- **Fuzzy Matching:** Unlike simple string matching, it finds relevant results even when users make typos or use different word orders.

- **Custom Scoring & Weighting:** It allows fine-tuning search relevance by assigning weights to different fields (e.g., title, tags, content).

- **Ease of Use:** Simple API that integrates seamlessly with Next.js and Markdown-based blogs.

## Steps to Implement Fuse.js Search

- **Install Fuse.js:** Add the library to your project.
``` sh
npm install fuse.js
```

- **Load and Index Articles with Fuse.js:**

``` ts
import Fuse from 'fuse.js';
import { getAllArticles } from '@/lib/articles';

const articles = getAllArticles();
const fuse = new Fuse(articles, { keys: ['title', 'content', 'tag'] });

export function searchArticles(query: string) {
  return fuse.search(query).map(result => result.item);
}

// Initialize Fuse instance outside the function for performance
let fuseInstance: Fuse<Article> | null = null;

function getFuseInstance() {
  if (!fuseInstance) {
    const articles = getAllArticles();
    const options: IFuseOptions<Article> = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'tag', weight: 0.2 },
        { name: 'description', weight: 0.1 }
      ],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
    };
    fuseInstance = new Fuse(articles, options);
  }
  return fuseInstance;
}

export function searchArticles(query: string): Article[] {
  if (!query || query.trim().length < 2) { // Basic validation
    return [];
  }
  const fuse = getFuseInstance();
  return fuse.search(query).map(result => result.item);
}

```

## 3. AI-Powered Chatbot with Together AI

For enhancing user interaction on your blog, implementing an AI-powered chatbot can offer personalized responses to users. [Together AI](https://www.together.ai/ 'Together AI') offers free access to various AI models, which can be leveraged to provide chatbot functionality without the cost associated with APIs like OpenAI's GPT. Here's why you might choose Together AI:

- **Free Access to Powerful Models:** You can access large, powerful models for free or for very affordable prices in comparison to others like OpenAI, which competes well with other premium models.

- **Cost-Effective Scaling:** Ideal for projects where scalability and cost are a concern. You don’t have to worry about usage caps or pricing increases as with other platforms.

- **Flexibility in Integration:** Together AI models are easy to integrate into your blog, offering rich, dynamic responses for user queries.

### Steps to Integrate Together AI Chatbot

- 1. **Sign Up for Together AI:** Visit Together AI to get access to free models like Llama-3.3-70B-Instruct-Turbo.

- 2. **Create a Chatbot API Route:** Set up an API route in Next.js that sends user queries to Together AI's models.

Let's create a directory inside app named ```api``` and inside that we will have ```/chatbot/route.ts```

``` ts
import fetch from 'node-fetch';

export async function POST(request: Request) {
  const { question } = await request.json();

  const response = await fetch("https://api.together.ai/models/meta-llama/Llama-3.3-70B-Instruct-Turbo/completions", {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: question,
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

```

Now, let's create a simple chatbot component

``` tsx
import { useState } from "react";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the message is not empty
    if (!message.trim()) return;

    const userMessage = message;
    setMessage(""); // Reset message field

    const res = await fetch("/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ question: userMessage }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setResponse(data.answer || "Sorry, I don't have an answer.");
  };

  // Toggle chat window visibility
  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Chat Button */}
      {!isChatOpen && (
        <button onClick={toggleChatWindow} aria-label="Open Chat">
          Chat
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div>
          <button onClick={toggleChatWindow} aria-label="Close Chat">
            X
          </button>
          <h3>Ask me anything!</h3>
          <div>
            {response && <p>Bot: {response}</p>}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
              aria-label="Message input"
            />
            <button type="submit">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
```

Finally you can render this component inside your layout component that way it renders in every page

## Conclusion
Integrating AI-powered features like chatbots, search, and content recommendations into a Next.js blog can significantly enhance user engagement and provide a smarter user experience. By leveraging tools like Fuse.js for search and Together AI for chatbot functionality, you can offer cutting-edge, cost-effective features to your users.

Next.js provides the perfect framework for building dynamic, AI-powered web applications. With Together AI, you can make use of free models, making it an ideal choice for scaling without the cost concerns that come with other premium AI models. By following the steps outlined in this guide, you can take your blog to the next level with advanced AI-powered features.

I hope you find this article helpful, let's code a cool blog with a chatbot 🤖
