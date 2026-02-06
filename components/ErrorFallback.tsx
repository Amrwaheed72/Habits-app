import { RotateCcw, TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from './ui/text';
import { Icon } from './ui/icon';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'sonner-native';

interface Props {
  error: string | undefined;
  onRetry: () => void;
  isPending: boolean;
  retryCount: number;
  setRetryCount: Dispatch<SetStateAction<number>>;
}
const ErrorFallback = ({ error, onRetry, isPending, retryCount, setRetryCount }: Props) => {
  useEffect(() => {
    if (retryCount === 3) {
      toast.warning('If this issue continues, please contact support and come back later.');
      setRetryCount(0);
    }
  }, [retryCount]);
  const handleRetry = () => {
    onRetry();
    setRetryCount((prev) => prev + 1);
  };
  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <Icon as={TriangleAlert} size={96} color={'red'} strokeWidth={1} />
      <Text variant="h4" className="text-center">
        Error occurred while processing
      </Text>
      <Input readOnly className="border-red-500 text-center text-xs text-red-500" value={error} />
      <Button onPress={handleRetry} variant={null} className="bg-purple-600 active:bg-purple-700">
        <Text>Try again</Text>
        {isPending ? (
          <Spinner className="border-t-purple-500" variant="ring" size="sm" />
        ) : (
          <Icon as={RotateCcw} />
        )}
      </Button>
    </View>
  );
};

export default ErrorFallback;
