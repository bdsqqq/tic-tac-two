import { toast } from '@haxiom/ui/use-toast';

export const mockAction = (past: string) => {
  toast({
    title: `Pretend you ${past}`,
    description: "If you're seeing this, I didn't get through all my TODOs.",
  });
};
