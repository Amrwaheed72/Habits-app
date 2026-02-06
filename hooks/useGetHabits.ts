import { useAuth } from '@/lib/auth-context';
import { fetchHabits } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const useGetHabits = () => {
  const { user } = useAuth();
  const id = user?.$id!;
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['habits', id],
    queryFn: () => fetchHabits(id),
    enabled: !!id,
  });
  return { data, isPending, error, refetch };
};

export default useGetHabits;
