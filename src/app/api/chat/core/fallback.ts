export const generateFallbackResponse = async (
  query: string,
  history?: { role: string; content: string }[]
) => {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) return "I'm unable to fetch an AI response right now. Try again later!";
  if (!history) history = [];

  try {
    const response = await fetch("https://api.together.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Provide a concise but complete response (2-3 sentences max)...`,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...history.slice(-5),
          { role: "user", content: query },
        ],
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        temperature: 0.3,
        max_tokens: 250,
        top_p: 0.5,
      }),
    });

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content?.trim() ??
      "I couldn't find a precise answer, but you might find something useful in my blog!"
    );
  } catch {
    return "That's an interesting topic! I might have something related in my blog.";
  }
}