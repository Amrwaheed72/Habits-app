import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { collectionId, databaseId, databases } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { ID } from 'react-native-appwrite';
import z from 'zod';
import { toast } from 'sonner-native';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'expo-router';

const addHabitSchema = z.object({
  title: z.string().min(2, "A habit's title must have at least 2 characters"),
  description: z.string().min(5, "A habit's description must have at least 5 characters"),
  // streak_count: z.number('Do not leave this field empty').min(0, 'Streak count cannot be negative'),
  // last_completed: z.string().min(1, 'Last completed date is required'),
  frequency: z.enum(['monthly', 'weekly', 'daily', 'yearly'], {
    message: 'You must pick a period',
  }),
});

type habitSchema = z.infer<typeof addHabitSchema>;

const FREQUENCY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

const AddHabitScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const methods = useForm<habitSchema>({
    resolver: zodResolver(addHabitSchema),
    defaultValues: {
      title: '',
      description: '',
      frequency: 'daily',
    },
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = methods;

  const onSubmit = async (data: habitSchema) => {
    if (!user) return;
    try {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        user_id: user.$id,
        title: data.title,
        description: data.description,
        frequency: data.frequency,
        streak_count: 0,
        last_completed: new Date().toISOString(),
      });
      toast.success('Habit created successfully!');
      router.back();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
      setError('root', {
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1 p-2">
          <Text className="mb-4 text-center text-2xl font-bold">Add a new Habit!</Text>
          {errors.root?.message && (
            <Text className="mb-4 text-center text-xs tracking-wider text-red-500">
              {errors.root.message}
            </Text>
          )}
          <FormInput
            error={errors?.title?.message}
            placeholder="eg. Football"
            name="title"
            label="Title"
          />
          <FormInput
            error={errors?.description?.message}
            placeholder="eg. football match at friday"
            name="description"
            label="Description"
          />

          <View className="gap-2 p-2">
            <Label nativeID="frequency-label">Frequency</Label>
            <Controller
              control={control}
              name="frequency"
              render={({ field: { onChange, value } }) => {
                const selectedOption = FREQUENCY_OPTIONS.find((option) => option.value === value);

                return (
                  <Select
                    value={selectedOption}
                    onValueChange={(option) => onChange(option?.value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Frequency Period</SelectLabel>
                        {FREQUENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} label={opt.label} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors?.frequency?.message && (
              <Text className="text-xs tracking-wider text-red-500">
                {errors?.frequency?.message}
              </Text>
            )}
          </View>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-4 bg-purple-700 active:bg-purple-800 dark:bg-purple-500 dark:active:bg-purple-600">
            <Text className="text-white">Add Habit</Text>
            {isSubmitting && <Spinner size="sm" variant="ring" />}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default AddHabitScreen;
