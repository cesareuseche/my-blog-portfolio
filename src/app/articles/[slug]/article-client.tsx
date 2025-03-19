"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  title: string;
  date: string;
  content: string;
};

export default function ArticleClient({ title, date, content }: Props) {
  const articleRef = useRef<HTMLDivElement>(null);

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
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={materialDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-200 px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </main>
  );
}
