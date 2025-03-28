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
  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    'h-captcha-response': string;
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

          {submitted ? (
            <div className={styles.success}>
              <div className={styles.smiley}>
                <h2>Thank you!</h2>
              </div>
              <p>Your message has been successfully sent. I will get back to you soon.</p>
            </div>
          ) : (
            <div className={styles.content}>
              <h1>Get In Touch</h1>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.input}>
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="Enter Your First Name"
                      {...register("firstName", { required: "First name is required" })}
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                  </div>
                  <div className={styles.input}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter Your Last Name"
                      {...register("lastName", { required: "Last name is required" })}
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.input}>
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                  </div>
                </div>

                <div className={styles.input}>
                  <label>Message</label>
                  <textarea
                    placeholder="Type your message here..."
                    {...register("message", { required: "Message is required" })}
                  ></textarea>
                  {errors.message && <span className={styles.error}>{errors.message?.message?.toString()}</span>}
                </div>

                <HCaptcha
                  sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                  reCaptchaCompat={false}
                  onVerify={onHCaptchaChange}
                />

                <Button title="Submit" variant="primary" type="submit">
                  <IconContact />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
