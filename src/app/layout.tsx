"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import Header from "@/components/header";
import "../styles/global.scss";
import Footer from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    gsap.fromTo(
      "main",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <Header />
        <main className="main-container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
