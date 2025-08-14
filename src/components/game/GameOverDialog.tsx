import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GameOverDialogProps {
  isOpen: boolean;
  reason: string;
  onRestart: () => void;
}

export default function GameOverDialog({ isOpen, reason, onRestart }: GameOverDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive text-2xl font-bold">Game Over</AlertDialogTitle>
          <AlertDialogDescription className="pt-4 text-base text-foreground">
            {reason}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onRestart} className="w-full bg-primary hover:bg-primary/90">
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
