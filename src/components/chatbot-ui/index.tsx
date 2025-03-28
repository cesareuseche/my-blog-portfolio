import { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Send, X } from "lucide-react";
import gsap from "gsap";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      gsap.fromTo(chatRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
    }
  }, [chatRef]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();

    setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button>Chat</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content
            ref={chatRef}
            className="fixed bottom-4 right-4 w-80 bg-white p-4 shadow-lg rounded-lg flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Chatbot</span>
              <Dialog.Close asChild>
                <button><X size={16} /></button>
              </Dialog.Close>
            </div>
            <div className="h-60 overflow-y-auto border p-2 rounded">
              {messages.map((msg, index) => (
                <div key={index} className={`p-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <span className={msg.role === "user" ? "bg-blue-200" : "bg-gray-200"}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." />
              <button onClick={sendMessage} className="ml-2">
                <Send size={16} />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
