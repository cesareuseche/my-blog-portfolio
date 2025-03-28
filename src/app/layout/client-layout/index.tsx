// app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import Header from "../header";
import Footer from "../footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        "main",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 2, ease: "power2.out" }
      );
    }
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="main-container">{children}</main>
      <Footer />
    </>
  );
}
