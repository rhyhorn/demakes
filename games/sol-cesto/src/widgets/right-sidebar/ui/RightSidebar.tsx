import { ExitPanel } from './ExitPanel';
import { HeroPanel } from './HeroPanel';
import { PiggyBankPanel } from './PiggyBankPanel';
import styles from './RightSidebar.module.css';

export function RightSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Права панель">
      <section className={styles.slot} aria-label="Героїня">
        <HeroPanel />
      </section>
      <section className={styles.slot} aria-label="Двері">
        <ExitPanel />
      </section>
      <section className={styles.slot} aria-label="Скарбничка">
        <PiggyBankPanel />
      </section>
    </aside>
  );
}
