import styles from './RightSidebar.module.css';

export function RightSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Права панель">
      <section className={styles.slot}>Героїня</section>
      <section className={styles.slot}>Двері</section>
      <section className={styles.slot}>Скарбничка</section>
    </aside>
  );
}
