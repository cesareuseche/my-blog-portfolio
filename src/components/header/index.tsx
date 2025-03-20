import Link from "next/link";
import styles from "./style.module.scss";
import IconGithub from "../icon-github";
import IconLinkedIn from "../icon-linkedin";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          CESAR BLOG
        </div>

        <div className={styles.menu}>
          <nav className={styles.nav}>
            <Link href="/about">About</Link>
          </nav>

          <span className={styles.separator}>—</span>

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
      <hr className={styles.divider} />
    </header>
  );
};

export default Header;
