import { SCENE_HEIGHT, SCENE_WIDTH } from '@/shared/config';
import { ScaledStage } from '@/shared/ui';
import { LeftSidebar } from '@/widgets/left-sidebar';
import { RightSidebar } from '@/widgets/right-sidebar';
import { UpgradeRoom } from '@/widgets/upgrade-room';

import styles from './UpgradePage.module.css';

/** The upgrade room, as on `design/reference3.png`: the same sidebars around two altars. */
export function UpgradePage() {
  return (
    <ScaledStage width={SCENE_WIDTH} height={SCENE_HEIGHT}>
      <div className={styles.scene}>
        <LeftSidebar />
        <UpgradeRoom />
        <RightSidebar />
      </div>
    </ScaledStage>
  );
}
