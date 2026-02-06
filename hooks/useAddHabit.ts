import { addHabit } from '@/services/api';
import { AddHabit } from '@/types/api.type';
import { useMutation } from '@tanstack/react-query';

const useAddHabit = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data: AddHabit) => addHabit(data),
  });
  return { mutate, isPending };
};

export default useAddHabit;
