import Empty from '@/components/Empty';
import ErrorFallback from '@/components/ErrorFallback';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import useGetHabits from '@/hooks/useGetHabits';
import useGetStreaks from '@/hooks/useGetStreaks';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Flame, Medal, Trophy } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface StreakData {
  streak: number;
  bestStreak: number;
  total: number;
}
const StreaksScreen = () => {
  const [retryCount, setRetryCount] = useState(0);
  const { data, isPending, error, refetch } = useGetHabits();
  const {
    data: completedHabits,
    isPending: isLoadingCompletedHabits,
    error: errorCompletedHabits,
    refetch: refetchCompletedHabits,
  } = useGetStreaks();
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
  if (!completedHabits || completedHabits.length === 0) return <Empty to="/" />;

  const getStreakData = (habitId: string): StreakData => {
    const habitCompletions = completedHabits.filter((ch) => ch.habit_id === habitId);

    if (habitCompletions.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }
    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletions.length;
    let lastDate: Date | null = null;
    let currentStreak = 0;

    habitCompletions.forEach((c) => {
      const date = new Date(c.completed_at);
      if (lastDate) {
        const diff = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        if (currentStreak > bestStreak) bestStreak = currentStreak;
        streak = currentStreak;
        lastDate = date;
      }
    });
    return { streak, bestStreak, total };
  };
  const habitStreaks = data?.map((habit) => {
    const { streak, bestStreak, total } = getStreakData(habit.$id);
    return {
      habit,
      streak,
      bestStreak,
      total,
    };
  });
  const rankedHabits = habitStreaks?.sort((a, b) => a.bestStreak - b.bestStreak)!;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={rankedHabits}
        keyExtractor={(item) => item.habit.$id}
        contentContainerClassName="p-6 gap-4 pb-20"
        ListHeaderComponent={
          <View className="mb-2">
            <Text variant={'h2'} className="title mb-4">
              Habit's Streaks
            </Text>
            {rankedHabits.length > 0 && (
              <View className="mb-4">
                {/* Header Title */}
                <View className="mb-3 flex-row items-center gap-2 px-1">
                  <Icon as={Medal} size={20} className="text-yellow-500" />
                  <Text className="text-lg font-bold text-foreground">Top Streaks</Text>
                </View>

                <View className="gap-3">
                  {rankedHabits.slice(0, 3).map((item, index) => {
                    let rankColor = 'text-gray-400';
                    let bgColor = 'bg-gray-50 dark:bg-gray-900';
                    let borderColor = 'border-gray-200 dark:border-gray-800';

                    if (index === 0) {
                      rankColor = 'text-yellow-500';
                      bgColor = 'bg-yellow-50 dark:bg-yellow-950/20';
                      borderColor = 'border-yellow-200 dark:border-yellow-800';
                    } else if (index === 1) {
                      rankColor = 'text-slate-400';
                      bgColor = 'bg-slate-50 dark:bg-slate-900';
                      borderColor = 'border-slate-200 dark:border-slate-700';
                    } else if (index === 2) {
                      rankColor = 'text-orange-700';
                      bgColor = 'bg-orange-50 dark:bg-orange-950/20';
                      borderColor = 'border-orange-200 dark:border-orange-800';
                    }

                    return (
                      <View
                        key={item.habit.$id}
                        className={`flex-row items-center rounded-xl border p-3 ${borderColor} ${bgColor}`}>
                        <View className="mr-3 w-8 items-center justify-center">
                          {index === 0 ? (
                            <Icon as={Trophy} size={24} className={rankColor} />
                          ) : (
                            <Text className={`text-xl font-bold ${rankColor}`}>#{index + 1}</Text>
                          )}
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold text-foreground"
                            numberOfLines={1}>
                            {item.habit.title}
                          </Text>
                          <Text className="text-xs text-muted-foreground">
                            Best: {item.bestStreak} days
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1 rounded-full border border-border bg-background px-2 py-1">
                          <Icon as={Flame} size={14} className="text-orange-500" />
                          <Text className="text-sm font-bold text-foreground">{item.streak}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            <View className="my-2 h-[1px] w-full bg-border" />
          </View>
        }
        renderItem={({ item: { habit, streak, bestStreak, total } }) => (
          <Card className="w-full">
            <CardHeader className="flex-row">
              <View className="relative flex-1 flex-row justify-between">
                <View className="flex-1 gap-1.5">
                  <CardTitle>{habit.title}</CardTitle>
                  <CardDescription>{habit.description}</CardDescription>
                </View>
              </View>
            </CardHeader>
            <CardContent className="w-full flex-row items-center justify-between px-4 py-2">
              <View className="items-center gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Flame} size={20} className="text-orange-500" />
                  <Text className="text-xl font-bold text-foreground">{streak}</Text>
                </View>
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current
                </Text>
              </View>
              <View className="h-8 w-[1px] bg-border" />
              <View className="items-center gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Trophy} size={20} className="text-yellow-500" />
                  <Text className="text-xl font-bold text-foreground">{bestStreak}</Text>
                </View>
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Best
                </Text>
              </View>
              <View className="h-8 w-[1px] bg-border" />
              <View className="items-center gap-1">
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Check} size={20} className="text-green-500" />
                  <Text className="text-xl font-bold text-foreground">{total}</Text>
                </View>
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total
                </Text>
              </View>
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
};

export default StreaksScreen;
