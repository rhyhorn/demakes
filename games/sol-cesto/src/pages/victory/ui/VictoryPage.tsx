import { restartGame } from '@/features/level';
import { EndScreen } from '@/shared/ui';

/** Shown once the hero leaves the final level. */
export function VictoryPage() {
  return (
    <EndScreen
      title="You Win"
      titleClassName="text-[#e8c34a]"
      actionLabel="Почати спочатку"
      onAction={() => restartGame()}
    />
  );
}
