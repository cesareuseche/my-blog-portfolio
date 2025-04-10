import type { Article } from "./fuse";

export type Session = {
  history: { role: string; content: string }[];
  recentArticles?: Article[];
};

export const userSessions: Record<string, Session> = {};