// File: app/api/chat/route.ts
import { NextResponse } from "next/server";
import { userSessions } from "./core/session";
import { findRelatedArticles, isRequestingArticleSummary } from "./utils";
import type { Article } from "./core/fuse";
import { generateFallbackResponse } from "./core/fallback";

const CONTACT_PAGE_URL = "/contact";

export async function POST(req: Request) {
  const { message, sessionId, currentSlug } = await req.json();
  if (!sessionId) return NextResponse.json({ reply: "Session ID is required." });

  if (!userSessions[sessionId]) userSessions[sessionId] = { history: [] };
  const lowerMessage = message.toLowerCase();
  userSessions[sessionId].history.push({ role: "user", content: lowerMessage });

  const summary = await isRequestingArticleSummary(lowerMessage, sessionId, currentSlug);
  if (summary) {
    const { url, summary: body, preface } = summary;
    return NextResponse.json({
      reply: `${preface}\n\n${body}\n\n[Read the full article here](${url}). Let me know if you'd like a deeper dive!`,
    });
  }

  const results = findRelatedArticles(lowerMessage);
  if (results.length > 0) {
    userSessions[sessionId].recentArticles = results;
    return NextResponse.json({
      reply: `Here are some articles you might find useful:\n\n${results
        .map((a: Article) => `- [${a.title}](${a.url})\n${a.description}`)
        .join("\n\n")}`,
    });
  }

  if (lowerMessage.includes("contact") || lowerMessage.includes("email")) {
    return NextResponse.json({ reply: `You can reach me here: - [Contact Page](${CONTACT_PAGE_URL})` });
  }

  const fallback = await generateFallbackResponse(lowerMessage, userSessions[sessionId].history);
  userSessions[sessionId].history.push({ role: "assistant", content: fallback });

  return NextResponse.json({ reply: `${fallback}\n\nFeel free to explore my blog for more content!` });
}
