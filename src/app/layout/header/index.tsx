import Link from "next/link";
import styles from "./style.module.scss";
import SocialMedia from "@/components/social-media";

export default function Header() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Blog Home">
          BLOG+++
        </Link>

        <div className={styles.menu}>
          <nav aria-label="Main Navigation">
            <ul className={styles.nav}>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          <span className={styles.separator} aria-hidden="true">—</span>

          <SocialMedia className={styles.icons} aria-label="Social media links" />
        </div>
      </div>
      <hr className={styles.divider} />
    </header>
  );
};
