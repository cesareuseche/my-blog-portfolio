import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Send, X } from "lucide-react";
import styles from "./style.module.scss";
import IconChatbot from "../icons/chatbot-icon";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 600); // Matches the transition duration
  };

  return (
    <div className={styles.chatbot}>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button className={styles.chatbot__button}>
            <IconChatbot />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.chatbot__overlay} />
          <Dialog.Content className={`${styles.chatbot__modal} ${isOpen ? styles.open : ""} ${isClosing ? styles.closing : ""}`}>

            <div className={styles.chatbot__header}>
              <Dialog.Title>Chatbot</Dialog.Title>
              <Dialog.Close asChild>
                <button className={styles.chatbot__close} onClick={handleClose}>
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            <div className={styles.chatbot__messages}>
              <div className="message bot">Hello! How can I help you?</div>
            </div>

            <div className={styles.chatbot__input__container}>
              <textarea className={styles.chatbot__input} placeholder="Ask something..." />
              <button className={styles.chatbot__send}>
                <Send size={16} />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
