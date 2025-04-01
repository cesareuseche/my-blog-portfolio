import Link from "next/link";
import styles from "./style.module.scss";
import SocialMedia from "@/components/social-media";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          CESAR BLOG
        </Link>

        <div className={styles.menu}>
          <nav className={styles.nav}>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <span className={styles.separator}>—</span>

          <SocialMedia className={styles.icons} />
        </div>

      </div>
      <hr className={styles.divider} />
    </header>
  );
};
