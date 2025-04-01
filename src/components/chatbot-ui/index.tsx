'use client'

import { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./style.module.scss";
import IconChatbot from "../icons/icon-chatbot";
import IconAiChat from "../icons/icon-ai-chat";
import IconUserChat from "../icons/icon-user-chat";
import IconSend from "../icons/icon-send";
import LottieAnimation from "../icons/icon-animation-ai";
import IconClose from "../icons/icon-close";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I help you?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 600);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't understand that." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to AI service." }]);
    }

    setLoading(false);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.chatbot}>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button
            className={`${styles.chatbot__button} ${isOpen ? styles.open : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.chatbot__text}>Ask my AI chatbot</span>
            <IconChatbot />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.chatbot__overlay} />
          <Dialog.Content className={`${styles.chatbot__modal} ${isOpen ? styles.open : ""} ${isClosing ? styles.closing : ""}`}>
            <div className={styles.chatbot__header}>
              <div className={styles.chatbot__title}>
                <Dialog.Title>
                  <LottieAnimation />
                  Chatbot
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className={styles.chatbot__close} onClick={handleClose}>
                  <IconClose />
                </button>
              </Dialog.Close>
            </div>

            <div className={styles.chatbot__messages}>
              {messages.map((msg, index) => (
                <div className={msg.sender === "bot" ? styles.left : styles.right} key={index}>
                  {msg.sender === "bot" ? (
                    <IconAiChat />
                  ):
                    <IconUserChat />
                  }
                  <div key={index} className={msg.sender === "bot" ? styles.bot : styles.user}>
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeText = String(children).replace(/\n$/, "");

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
                              {codeText}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...props}>{children}</code>
                          );
                        }
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className={styles.loader__container}>
                  <div className={styles.loader}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatbot__input__container}>
              <textarea
                className={styles.chatbot__input}
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              />
              <button className={styles.chatbot__send} onClick={handleSend} disabled={loading}>
                <IconSend />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}