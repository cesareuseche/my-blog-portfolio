"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.scss";
import IconContact from "../icon-contact";
import Button from "../button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.grid}>

          <div className={styles.image}>
            <Image
              src="/assets/images/contact-page.webp"
              alt="Contact Us"
              width={800}
              height={600}
              layout="responsive"
            />
          </div>

          <div className={styles.content}>
            <h1>
              Get In Touch
            </h1>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.input}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter Your First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.input}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter Your Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.input}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.input}>
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <Button
                title="Submit"
                variant="primary"
                type="submit"
                >
                <IconContact />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
