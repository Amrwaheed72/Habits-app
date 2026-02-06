import { deleteHabit } from '@/services/api';
import { useMutation } from '@tanstack/react-query';

const useDeleteHabit = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteHabit(id),
  });
  return { mutate, isPending };
};

export default useDeleteHabit;
