import { SCENE_HEIGHT, SCENE_WIDTH } from '@/shared/config';
import { ScaledStage } from '@/shared/ui';
import { LeftSidebar } from '@/widgets/left-sidebar';
import { RightSidebar } from '@/widgets/right-sidebar';
import { ShopRoom } from '@/widgets/shop-room';

import styles from './ShopPage.module.css';

/** The shop: the same sidebars around the offered items. */
export function ShopPage() {
  return (
    <ScaledStage width={SCENE_WIDTH} height={SCENE_HEIGHT}>
      <div className={styles.scene}>
        <LeftSidebar />
        <ShopRoom />
        <RightSidebar />
      </div>
    </ScaledStage>
  );
}
