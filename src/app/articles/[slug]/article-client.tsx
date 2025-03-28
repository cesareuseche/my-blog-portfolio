"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import VideoEmbed from "@/components/video-embed";
import styles from "./style.module.scss";
import IconCopy from "@/components/icons/icon-copy";

type Props = {
  title: string;
  content: string;
  tag: string;
};

export default function ArticleClient({ title, content, tag }: Props) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [copiedBlocks, setCopiedBlocks] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    gsap.fromTo(
      articleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedBlocks((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedBlocks((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    });
  };

  let codeBlockCounter = 0;

  return (
    <main ref={articleRef} className={styles.article__content}>
      <div className={styles.article__header}>
        <div className={styles.article__number}>
          <span>Article</span>
        </div>

        <div className={styles.article__tag}>
          <p>{tag}</p>
        </div>
      </div>

      <h1>{title}</h1>

      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");
            const index = codeBlockCounter++;

            return !inline && match ? (
              <div className={styles.code}>
                <div className={styles.copy}>
                  <button
                    className={styles.copy__button}
                    onClick={() => handleCopy(codeText, index)}
                    type="button"
                  >
                    {copiedBlocks[index] ? "Copied" : (<><IconCopy /> Copy</>)}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  wrapLongLines={true}
                  showLineNumbers={true}
                  customStyle={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  PreTag="div"
                  {...props}
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code {...props}>{children}</code>
            );
          },
          a({ href, children }) {
            if (href && (href.includes("youtube.com") || href.includes("youtu.be") || href.includes("vimeo.com"))) {
              return <VideoEmbed url={href} />;
            }
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{children}</a>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </main>
  );
}
