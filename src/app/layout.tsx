// app/layout.tsx
import type { Metadata } from "next";
import ClientLayout from "./layout/client-layout";
import "../styles/global.scss";

export const metadata: Metadata = {
  title: "Cesar's Blog",
  description: "Your website description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
