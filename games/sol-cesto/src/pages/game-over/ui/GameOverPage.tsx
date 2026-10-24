import { restartGame } from '@/features/level';
import { EndScreen } from '@/shared/ui';

export function GameOverPage() {
  return (
    <EndScreen
      title="Game Over"
      titleClassName="text-[#c8323c]"
      actionLabel="Почати спочатку"
      onAction={() => restartGame()}
    />
  );
}
