"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import styles from "./style.module.scss";
import IconContact from "../icons/icon-contact";
import Button from "../button";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    "h-captcha-response": string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({ mode: "onBlur" });

  const onHCaptchaChange = (token: string) => {
    setValue("h-captcha-response", token);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "9536e04d-708c-4176-b21f-fb1e0340b5c0",
          ...data,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          <div className={styles.image}>
            {isLoading && <div className={styles.shimmer}></div>}
            <Image
              src="/assets/images/contact-form.webp"
              className={`${styles.img} ${isLoading ? styles.hidden : ""}`}
              alt="Contact Us"
              width={800}
              height={600}
              onLoad={() => setIsLoading(false)}
              loading="lazy"
            />
          </div>

          {submitted ? (
            <div className={styles.success}>
              <div className={styles.smiley}>
                <h2>Thank you!</h2>
              </div>
              <p>Your message has been successfully sent. I will get back to you soon.</p>
            </div>
          ) : (
            <div className={styles.content}>
              <h1 id="contact-form-title">Get In Touch</h1>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form} role="form" aria-labelledby="contact-form-title">
                <div className={styles.row}>
                  <div className={styles.input}>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" type="text" placeholder="Enter Your First Name" {...register("firstName", { required: "First name is required" })} />
                    {errors.firstName && <span id="firstName-error" className={styles.error}>{errors.firstName.message}</span>}
                  </div>
                  <div className={styles.input}>
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" type="text" placeholder="Enter Your Last Name" {...register("lastName", { required: "Last name is required" })} />
                    {errors.lastName && <span id="lastName-error" className={styles.error}>{errors.lastName.message}</span>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.input}>
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Your Email"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    {errors.email && <span id="email-error" className={styles.error}>{errors.email.message}</span>}
                  </div>
                </div>

                <div className={styles.input}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="Type your message here..." {...register("message", { required: "Message is required" })}></textarea>
                  {errors.message && <span id="message-error" className={styles.error}>{errors.message.message}</span>}
                </div>

                <HCaptcha
                  sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                  reCaptchaCompat={false}
                  onVerify={onHCaptchaChange}
                  aria-describedby="captcha-description"
                />
                <p id="captcha-description" className={styles.visually__hidden}>
                  This captcha is required to submit the form.
                </p>

                <Button title="Submit" variant="primary" type="submit" aria-label="Submit Contact Form">
                  <IconContact />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}