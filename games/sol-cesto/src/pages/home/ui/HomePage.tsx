import { SCENE_HEIGHT, SCENE_WIDTH } from '../../../shared/config';
import { ScaledStage } from '../../../shared/ui';
import { DungeonBoard } from '../../../widgets/dungeon-board';
import { LeftSidebar } from '../../../widgets/left-sidebar';
import { RightSidebar } from '../../../widgets/right-sidebar';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <ScaledStage width={SCENE_WIDTH} height={SCENE_HEIGHT}>
      <div className={styles.scene}>
        <LeftSidebar />
        <DungeonBoard />
        <RightSidebar />
      </div>
    </ScaledStage>
  );
}
