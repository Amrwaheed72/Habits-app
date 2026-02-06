import { useAuth } from '@/lib/auth-context';
import { completeHabit } from '@/services/api';
import { useMutation } from '@tanstack/react-query';

interface Props {
  habitId: string;
  streakCount: number;
}
const useCompleteHabit = () => {
  const { user } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ habitId, streakCount }: Props) =>
      completeHabit(habitId, user?.$id!, streakCount),
  });
  return { mutate, isPending };
};

export default useCompleteHabit;
