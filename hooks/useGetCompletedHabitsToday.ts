import { useAuth } from '@/lib/auth-context';
import { getCompletedHabitsToday } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const useGetCompletedHabitsToday = () => {
  const { user } = useAuth();
  const id = user?.$id as string;
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['completed-today', id],
    queryFn: () => getCompletedHabitsToday(id),
    enabled: !!id,
  });
  return { data, isPending, error, refetch };
};

export default useGetCompletedHabitsToday;
