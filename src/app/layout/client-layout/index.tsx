"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import Header from "../header";
import Footer from "../footer";
import Chatbot from "@/components/chatbot-ui";
import "./style.scss";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure main is hidden before animation starts
      gsap.set("main", { opacity: 0, y: 20 });

      // Animate main once it's ready
      gsap.to("main", {
        opacity: 1,
        y: 0,
        duration: 2, // Shortened for a smoother experience
        ease: "power2.out",
      });
    }
  }, [pathname]);

  return (
    <>
      <Header />
        <main className="main-container">{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}
