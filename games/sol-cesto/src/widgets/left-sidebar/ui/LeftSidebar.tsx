import styles from './LeftSidebar.module.css';
import { InventoryPanel } from './InventoryPanel';
import { ModifiersPanel } from './ModifiersPanel';
import { PortraitPanel } from './PortraitPanel';

export function LeftSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Ліва панель">
      <section className={styles.slot} aria-label="Портрет">
        <PortraitPanel />
      </section>
      <section className={styles.slot}>Зуби</section>
      <section className={styles.slot}>
        <InventoryPanel />
      </section>
      <section className={styles.slot}>
        <ModifiersPanel />
      </section>
    </aside>
  );
}
