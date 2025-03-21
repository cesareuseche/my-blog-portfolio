import Image from "next/image";
import styles from "./style.module.scss";
import IconGithub from "../icon-github";
import IconLinkedIn from "../icon-linkedin";

type Props = {
  image: string;
  date: string;
  author: string;
  duration: string;
};

export default function ArticleDetails({ image, date, author, duration }: Props) {
  return (
    <div className={styles.article__details}>
      <div className={styles.article__details__wrapper}>
        <Image src={image} alt="Article Thumbnail" width={300} height={200} />

        <div className={styles.article__details__author}>
          <Image
            src="/assets/images/profile-pic.png"
            alt=""
            width={100}
            height={100}
          />
          <p>
            {author}
          </p>
        </div>
      </div>

      <div className={styles.article__details__info}>
        <p className={styles.article__details__date}>
          Date <span>{date}</span>
        </p>
        <p className={styles.article__details__duration}>
          Duration <span>{duration}</span>
        </p>
        <div className={styles.article__details__social}>
          <p>
            Connect
          </p>
          <div>
            <a href="https://github.com/cesareuseche" target="_blank" rel="noopener noreferrer">
              <IconGithub />
            </a>
            <a href="https://www.linkedin.com/in/cesar-useche-profile/" target="_blank" rel="noopener noreferrer">
              <IconLinkedIn />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
