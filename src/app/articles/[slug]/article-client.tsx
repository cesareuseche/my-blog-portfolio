"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ArticleAction from "@/components/article-action";
import ArticleDetails from "@/components/article-details";
import styles from "./style.module.scss";

type Props = {
  image: string;
  title: string;
  description: string;
  date: string;
  content: string;
  tag: string;
  author: string;
  duration: string;
  category: string;
};

export default function ArticleClient({ image, title, date, content, tag, author, duration, category }: Props) {
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      articleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div className={styles.article}>

      <ArticleAction category={category} />

      <div className={styles.container}>
        <div className={styles.grid}>
          <aside className={styles.article__aside}>
            <div className={styles.article__sidebar}>
              <ArticleDetails image={image} date={date} author={author} duration={duration} />
            </div>
          </aside>

          <main ref={articleRef} className={styles.article__content}>
            <div className={styles.article__header}>
              <div className={styles.article__number}>
                <span>Article</span>
              </div>

              <div className={styles.article__tag}>
                <p>{tag}</p>
              </div>
            </div>

            <h1>
              {title}
            </h1>

            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark}
                      language={match[1]}
                      wrapLongLines={true}
                      showLineNumbers={true}
                      customStyle={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
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
        </div>
      </div>
    </div>
  );
}
