"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";

type Props = {
  title: string;
  date: string;
  content: string;
};

export default function ArticleClient({ title, date, content }: Props) {
  const articleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      articleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <main ref={articleRef} className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-500">{date}</p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}
