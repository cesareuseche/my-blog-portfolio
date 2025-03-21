import Image from "next/image";
import styles from "./style.module.scss";

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

        <p className={styles.article__details__author}>
          By {author}
        </p>
      </div>

      <div className={styles.article__details__info}>
        <p className={styles.article__details__date}>
          Date: <span>{date}</span>
        </p>
        <p className={styles.article__details__duration}>
          Duration: <span>{duration}</span>
        </p>
      </div>
    </div>
  );
}
