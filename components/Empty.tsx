import { ArrowRight, PackageOpen } from 'lucide-react-native';
import { View } from 'react-native';
import { Icon } from './ui/icon';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { Href, useRouter } from 'expo-router';

const Empty = ({ to }: { to: Href }) => {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center gap-4 p-2">
      <Icon as={PackageOpen} size={120} className="text-purple-600" strokeWidth={1} />
      <Text className="text-center tracking-widest">
        Your current habits list is Empty, Try to add new ones!
      </Text>
      <Button
        onPress={() => router.replace(to)}
        variant={null}
        className="bg-purple-600 active:bg-purple-700">
        <Text className="text-white">Add new Habit</Text>
        <Icon as={ArrowRight} className="text-white" />
      </Button>
    </View>
  );
};

export default Empty;
