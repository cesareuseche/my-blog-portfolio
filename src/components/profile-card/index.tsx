"use client";

import Image from "next/image";
import { useState } from "react";
import IconGithub from "../../components/icons/icon-github";
import IconLinkedIn from "../../components/icons/icon-linkedin";
import styles from "./style.module.scss";


export default function ProfileCard() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.grid}>

          <div className={styles.left__column}>
            <div className={styles.image__container}>
              {isLoading && <div className={styles.shimmer}></div>}
              <Image
                src="/assets/images/profile-pic.png"
                alt="Louise Jensen"
                width={200}
                height={200}
                className={`${styles.img} ${isLoading ? styles.hidden : ""}`}
                onLoad={() => setIsLoading(false)}
                loading="lazy"
              />
            </div>
            <div className={styles.follow__section}>
              <span className={styles.follow__text}>FOLLOW</span>
              <div className={styles.icons}>
                <a href="https://github.com/cesareuseche" target="_blank" rel="noopener noreferrer">
                  <IconGithub />
                </a>
                <a href="https://www.linkedin.com/in/cesar-useche-profile/" target="_blank" rel="noopener noreferrer">
                  <IconLinkedIn />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.right__column}>
            <h1 className={styles.name}>
              Cesar <br /> Useche
            </h1>
            <p className={styles.intro__text}>
              Hey there! I'm Cesar, a software engineer deeply passionate about technology.
              I'm constantly sharpening my skills and currently pursuing a Master's degree in Computer Science,
              diving into the exciting fields of Machine Learning and AI. Outside of tech, I enjoy exploring other
              interests like producing music, hitting the tennis court, etc.
            </p>
            <p className={styles.main__text}>
              Professionally, I focus on building robust and scalable web applications.
              With expertise in React, Next.js, and TypeScript, I enjoy crafting efficient architectures and seamless,
              visually engaging user experiences. I thrive on tackling complex challenges and optimizing for performance
              and usability.  
            </p>
            <p className={styles.main__text}>
              My background includes leading full-stack development projects, utilizing technologies like GraphQL, Redux/Xstate, and Node.js.
              I also have experience integrating complex animations with GSAP  and leveraging tools like Docker for streamlined development.
              Whether working on sophisticated applications or collaborating with UI/UX designers, my goal is always to deliver maintainable,
              high-quality code.  
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}