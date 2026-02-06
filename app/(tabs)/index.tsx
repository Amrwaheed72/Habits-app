import { useEffect, useRef, useState } from 'react';
import Empty from '@/components/Empty';
import ErrorFallback from '@/components/ErrorFallback';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import useGetHabits from '@/hooks/useGetHabits';
import { useAuth } from '@/lib/auth-context';
import { CircleCheck, Flame, LogOut, MoonStarIcon, SunIcon, Trash } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { FlatList, View } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Swipeable } from 'react-native-gesture-handler';
import { useGlobal } from '@/contexts/global-context';
import DeleteHabitDialog from '@/components/DeleteHabitDialog';
import useCompleteHabit from '@/hooks/useCompleteHabit';
import { toast } from 'sonner-native';
import { useQueryClient } from '@tanstack/react-query';
import useGetCompletedHabitsToday from '@/hooks/useGetCompletedHabitsToday';

export default function Screen() {
  const [retryCount, setRetryCount] = useState(0);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const { signout, isLoggingOut } = useAuth();
  const { data, isPending, error, refetch } = useGetHabits();
  const [completed, setCompleted] = useState<string[]>();
  const {
    data: completedHabits,
    isPending: isLoadingCompletedHabits,
    error: errorCompletedHabits,
    refetch: refetchCompletedHabits,
  } = useGetCompletedHabitsToday();
  const { setOpenDeleteDialog } = useGlobal();
  const { mutate: update, isPending: isUpdating } = useCompleteHabit();
  const queryClient = useQueryClient();
  const swipeableRef = useRef<{ [key: string]: Swipeable | null }>({});
  useEffect(() => {
    if (completedHabits) {
      setCompleted(completedHabits?.map((h) => h.habit_id));
    }
  }, [completedHabits]);
  if (error || errorCompletedHabits)
    return (
      <ErrorFallback
        error={error?.message || errorCompletedHabits?.message}
        onRetry={refetch || refetchCompletedHabits}
        isPending={isPending}
        retryCount={retryCount}
        setRetryCount={setRetryCount}
      />
    );
  if (isPending || isLoadingCompletedHabits)
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner variant="ring" size="xl" className="border-purple-500 border-t-black" />
      </View>
    );
  if (!data || data.length === 0) return <Empty to="/(tabs)/add-habit" />;

  const handleCompletionHabit = (id: string) => {
    const habit = data.find((habit) => habit.$id === id);
    if (!habit) return;
    const updatedToday = completed?.includes(id);
    if (updatedToday) {
      toast('you already completed this habit today');
      return;
    }

    const streakCount = habit.streak_count + 1;
    update(
      { habitId: habit.$id, streakCount },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['habits'] });
          queryClient.invalidateQueries({ queryKey: ['completed-today'] });
          toast.success('updated successfully');
        },
        onError: (error) => {
          console.log(error);
          toast.error(error.message || 'error occurred while updating the habit');
        },
      }
    );
  };

  const isHabitCompleted = (id: string) => {
    return completed?.includes(id) as boolean;
  };

  const renderRightAction = (id: string) => {
    return (
      <View className="w-full items-end justify-center rounded-lg bg-green-600 p-2">
        {isHabitCompleted(id) ? (
          <Text className="text-white">Completed</Text>
        ) : (
          <Icon as={CircleCheck} size={32} className="mr-2 text-white" />
        )}
      </View>
    );
  };
  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-full flex-row items-center justify-between px-6 py-4">
        <Text variant={'h4'} className="title">
          Today's Habits
        </Text>
        <Button variant="ghost" onPress={signout}>
          <Text>Log out</Text>
          {isLoggingOut ? (
            <Spinner variant="ring" size="sm" className="border-t-red-500" />
          ) : (
            <LogOut size={18} color={'red'} />
          )}
        </Button>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="p-6 gap-2 pb-20"
        renderItem={({ item: habit }) => {
          const isNew =
            new Date(habit.$createdAt).toLocaleDateString() === new Date().toLocaleDateString();
          const isCompleted = isHabitCompleted(habit.$id);

          return (
            <Swipeable
              ref={(ref) => (swipeableRef.current[habit.$id] = ref)}
              key={habit.$id}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={() => (
                <View className="w-full items-start justify-center rounded-lg bg-red-600 p-2">
                  <Icon as={Trash} size={32} className="ml-2 text-white" />
                </View>
              )}
              renderRightActions={() => renderRightAction(habit.$id)}
              onSwipeableOpen={(direction) => {
                if (direction === 'left') {
                  setOpenDeleteDialog(true);
                  setSelectedHabitId(habit.$id);
                  swipeableRef.current[habit.$id]?.close();
                }
                if (direction === 'right') {
                  handleCompletionHabit(habit.$id);
                  swipeableRef.current[habit.$id]?.close();
                }
              }}>
              <Card className={`w-full ${isCompleted && 'opacity-50'}`}>
                <CardHeader className="flex-row">
                  <View className="relative flex-1 flex-row justify-between">
                    <View className="flex-1 gap-1.5">
                      <CardTitle>{habit.title}</CardTitle>
                      <CardDescription>{habit.description}</CardDescription>
                    </View>
                    <View className="absolute right-0 flex-row gap-2">
                      {isNew && (
                        <Badge variant={null} className="bg-gray-200/40 dark:bg-gray-300/40">
                          <Text>New</Text>
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant={null} className="bg-green-200 dark:bg-green-600">
                          <Text className="text-xs">completed</Text>
                          <Icon as={CircleCheck} />
                        </Badge>
                      )}
                    </View>
                  </View>
                </CardHeader>
                <CardContent className="w-full flex-row items-center justify-between">
                  <View className="gap-2">
                    <View className="flex-row items-center rounded-lg bg-orange-100 px-2.5 py-1 dark:bg-orange-200">
                      <Icon as={Flame} size={18} className="text-orange-500" />
                      <Text className="ml-1.5 text-sm font-semibold text-orange-400 dark:text-orange-600">
                        {habit.streak_count} day streak
                      </Text>
                    </View>
                  </View>
                  <View className="rounded-lg bg-purple-100 px-3 py-1 dark:bg-purple-800">
                    <Text className="text-sm font-semibold text-purple-400 dark:text-gray-100">
                      {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </Swipeable>
          );
        }}
      />
      <DeleteHabitDialog selectedId={selectedHabitId} />
    </View>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
