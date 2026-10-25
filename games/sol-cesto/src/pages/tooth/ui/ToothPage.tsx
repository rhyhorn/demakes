import { SCENE_HEIGHT, SCENE_WIDTH } from '@/shared/config';
import { ScaledStage } from '@/shared/ui';
import { LeftSidebar } from '@/widgets/left-sidebar';
import { RightSidebar } from '@/widgets/right-sidebar';
import { ToothRoom } from '@/widgets/tooth-room';

import styles from './ToothPage.module.css';

/** The tooth room, as on `design/reference4.png`: the same sidebars around the offered teeth. */
export function ToothPage() {
  return (
    <ScaledStage width={SCENE_WIDTH} height={SCENE_HEIGHT}>
      <div className={styles.scene}>
        <LeftSidebar />
        <ToothRoom />
        <RightSidebar />
      </div>
    </ScaledStage>
  );
}
