"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";

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
        <main className="p-6 max-w-2xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
