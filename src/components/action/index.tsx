import Link from "next/link";
import IconArrowBack from "../icons/icon-arrow-back";
import styles from "./style.module.scss";

type Props = {
  category?: string;
}

export default function Action({ category }: Props) {
  return (
    <div className={styles.actions}>
      <Link href="/">
        <IconArrowBack /> Go Back
      </Link>
      <p>
        {category}
      </p>
    </div>
  );
}
