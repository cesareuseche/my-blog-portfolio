import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Get in touch with me for collaborations, inquiries, or just to say hi!",
  keywords: "contact, inquiries, collaborations",
  authors: [{ name: "Cesar Useche" }],
  creator: "Cesar Useche",
  publisher: "Cesar Useche",
  openGraph: {
    title: "Contact Me",
    description: "Get in touch with me for collaborations, inquiries, or just to say hi!",
    url: "https://tech-life-blog.com/contact",
    siteName: "Tech & Life Blog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/assets/images/contact-form.webp',
        width: 800,
        height: 600,
        alt: 'Contact Me'
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Me",
    description: "Get in touch with me for collaborations, inquiries, or just to say hi!",
    creator: "@cesaruseche"
  }
};

export default function ContactPage() {
  return (
    <main role="main">
      <ContactForm />
    </main>
  )
}