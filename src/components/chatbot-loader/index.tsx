import styles from './style.module.scss';

export default function ChatBotLoader() {
  return (
    <div className={styles.loader__container}>
      <div className={styles.loader}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}