import type { Article } from "./fuse";

export async function summarizeArticle(article: Article) {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.together.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Summarize the following article in 2-3 concise sentences using simple language. Focus only on the main point.\n\nTitle: \"${article.title}\"\n\nContent:\n${article.content}`,
        messages: [
          { role: "system", content: "You are a helpful assistant that writes concise article summaries." },
          { role: "user", content: `Summarize the article \"${article.title}\" in 2-3 short sentences.` },
        ],
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        temperature: 0.3,
        max_tokens: 250,
        top_p: 0.5,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}