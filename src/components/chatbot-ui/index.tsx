'use client'

import { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "./style.module.scss";
import IconChatbot from "../icons/icon-chatbot";
import IconAiChat from "../icons/icon-ai-chat";
import IconUserChat from "../icons/icon-user-chat";
import IconSend from "../icons/icon-send";
import ChatBotLoader from "../chatbot-loader";
import LottieAnimation from "../icons/icon-animation-ai";
import IconClose from "../icons/icon-close";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Cookies from "js-cookie";
import IconReset from "../icons/icon-reset";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonOpen, setIsButtonOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I help you?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isResetting, setIsResetting] = useState(false);
  const resetIconRef = useRef<SVGSVGElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 600);
  };

  useEffect(() => {
    let sessionId = Cookies.get("chat_session");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      Cookies.set("chat_session", sessionId, { expires: 1 });
    }

    const savedMessages = Cookies.get("chat_history");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      Cookies.set("chat_history", JSON.stringify(messages), { expires: 1 });
    }
  }, [messages]);

  const bounceCheckmark = () => {
    const checkmark = document.querySelector(`.${styles.checkmark}`);

    if (checkmark) {

      gsap.set(checkmark, { scale: 0, opacity: 0 });

      gsap.to(checkmark, {
        scale: 1.3,
        opacity: 1,
        duration: 0.4,
        ease: "bounce.out",
      });
    }
  };

  const handleChatReset = () => {
    setIsResetting(true);

    setTimeout(() => {
      setMessages([{ sender: "bot", text: "Hello! How can I help you?" }]);
      setInput("");
      Cookies.remove("chat_history");
      Cookies.remove("chat_session");
      Cookies.set("chat_session", crypto.randomUUID(), { expires: 1 });

      bounceCheckmark();

      setTimeout(() => {

        gsap.to(`.${styles.checkmark}`, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power1.inOut",
          onComplete: () => {
            setIsResetting(false);
          }
        });
      }, 800);
    }, 1000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const sessionId = Cookies.get("chat_session");
    if (!sessionId) {
      console.error("Session ID not found");
      return;
    }

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId })
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
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsButtonOpen(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  gsap.registerPlugin(ScrollToPlugin);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      gsap.to(messagesEndRef.current.parentElement, {
        duration: 2,
        scrollTo: { y: messagesEndRef.current.offsetTop },
        ease: "power2.out",
      });
    }
  }, [messages]);

  return (
    <div className={styles.chatbot}>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>

        <Dialog.Trigger asChild>
          <button
            className={`${styles.chatbot__button} ${isButtonOpen ? styles.open : ""}`}
            onClick={() => setIsOpen(true)}
            aria-labelledby="chatbot button"
            aria-label="Open chatbot"
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

              <div className={styles.chatbot__actions}>
                <div className={styles.reset}>
                  <Tooltip.Provider delayDuration={200}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        onClick={handleChatReset}
                        className={`${styles.reset} ${isResetting ? styles.resetting : ""}`}
                        title="Reset chat"
                        aria-label="Reset chat"
                      >
                        <IconReset ref={resetIconRef} className={styles.resetIcon} />
                        <span className={styles.checkmark}>✅</span>
                      </button>
                      </Tooltip.Trigger>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <Dialog.Close asChild>
                  <button className={styles.chatbot__close} onClick={handleClose}>
                    <IconClose />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            <div className={styles.chatbot__messages}>
              <div className={styles.chatbot__messages__container}>
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
                  <ChatBotLoader />
                )}
              </div>

              <div className={styles.chatbot__input__container}>
                <textarea
                  ref={textareaRef}
                  className={styles.chatbot__input}
                  placeholder="Ask something..."
                  value={input}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                />
                <button className={styles.chatbot__send} onClick={handleSend} disabled={loading} aria-label="Send message">
                  <IconSend />
                </button>
              </div>
              <div ref={messagesEndRef}></div>
            </div>
          </Dialog.Content>

        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}