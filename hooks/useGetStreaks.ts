import { useAuth } from '@/lib/auth-context';
import { getStreaks } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const useGetStreaks = () => {
  const { user } = useAuth();
  const id = user?.$id as string;
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['completed', id],
    queryFn: () => getStreaks(id),
    enabled: !!id,
  });
  return { data, isPending, error, refetch };
};

export default useGetStreaks;
