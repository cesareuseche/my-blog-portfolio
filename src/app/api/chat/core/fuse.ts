import Fuse from "fuse.js";
import { loadArticles } from "./articles";

export const articles = loadArticles();
export type Article = typeof articles[0];

export const fuse = new Fuse(articles, {
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

export const cleanQuery = (query: string) => {
  return query
    .toLowerCase()
    .replace(/\b(what|is|how|do|i|a|the|of|in|on|to|for|with|about|any|articles|have|know|can|you|show|learn)\b/g, "")
    .trim();
};