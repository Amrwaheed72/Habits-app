import { KeyboardTypeOptions, View } from 'react-native';
import { Label } from './ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from './ui/input';
import { Text } from './ui/text';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  name: string;
  placeholder: string;
  type?: KeyboardTypeOptions;
  error: string | undefined;
  classNames?: string;
}
const FormInput = ({ label, name, placeholder, type = 'default', error, classNames }: Props) => {
  const { control } = useFormContext();
  return (
    <View className={cn(`gap-2 p-2`, classNames)}>
      <Label htmlFor="email-address">{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            keyboardType={type}
            onBlur={onBlur}
            onChangeText={(text) => {
              if (type === 'number-pad') {
                onChange(text === '' ? undefined : Number(text));
              } else {
                onChange(text);
              }
            }}
            value={value}
            placeholder={placeholder}
            className="border-2 focus:shadow-md"
          />
        )}
      />
      {error && <Text className="text-xs tracking-wider text-red-500">{error}</Text>}
    </View>
  );
};

export default FormInput;
