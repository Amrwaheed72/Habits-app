import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { useGlobal } from '@/contexts/global-context';
import useDeleteHabit from '@/hooks/useDeleteHabit';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { Spinner } from './ui/spinner';

const DeleteHabitDialog = ({ selectedId }: { selectedId: string }) => {
  const { openDeleteDialog, setOpenDeleteDialog } = useGlobal();
  const { mutate, isPending: isDeleting } = useDeleteHabit();
  const queryClient = useQueryClient();
  const handleDelete = () => {
    mutate(selectedId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['habits'] });
        toast.success('Habit deleted successfully');
        setOpenDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Habit</DialogTitle>
          <DialogDescription>
            Are you sure you want delete this? this can not be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end">
          <DialogClose asChild>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button disabled={isDeleting} variant="destructive" onPress={handleDelete}>
            <Text className="text-white">Delete</Text>
            {isDeleting && <Spinner variant="ring" size="sm" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteHabitDialog;
