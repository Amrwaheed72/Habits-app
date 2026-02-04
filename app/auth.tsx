import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import {  useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/lib/auth-context';
const schema = z.object({
  email: z.string().email('Please enter a valid email address').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
});
type authSchema = z.infer<typeof schema>;
const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isText, setIsText] = useState<boolean>(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<authSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { signIn, signUp } = useAuth();

  const handleSwitchScreen = () => {
    setIsSignUp((prev) => !prev);
  };
  const onSubmit = async (data: authSchema) => {
    if (!data.email.trim() || !data.password.trim()) return;

    if (isSignUp) {
      const error = await signUp(data.email, data.password);
      if (error) {
        setError('root', { message: error });
        return;
      }
    } else {
      const error = await signIn(data.email.trim(), data.password.trim());
      if (error) {
        setError('root', { message: error });
        return;
      }
    }
    router.replace('/');
  };
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex-1 justify-center p-4">
        <Text className="mb-8 text-center text-3xl font-bold tracking-widest">
          {isSignUp ? 'Create Account' : 'Welcome back'}
        </Text>
        {errors.root?.message && (
          <Text className="mb-4 text-center text-xs tracking-wider text-red-500">
            {errors.root.message}
          </Text>
        )}
        <View className="gap-2 p-2">
          <Label htmlFor="email-address">Email Address</Label>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                autoCapitalize="none"
                textContentType="emailAddress"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoComplete="email"
                keyboardType="email-address"
                placeholder="example@gmail.com"
                className="border-2 focus:shadow-md"
              />
            )}
          />
          {errors.email?.message && (
            <Text className="text-xs tracking-wider text-red-500">{errors?.email?.message}</Text>
          )}
        </View>
        <View className="gap-2 p-2">
          <Label htmlFor="password">Password</Label>
          <Controller
            control={control}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <View className="relative">
                <Input
                  secureTextEntry={isText}
                  autoCapitalize="none"
                  textContentType="password"
                  autoComplete="password"
                  placeholder="********"
                  className="border-2 focus:shadow-md"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
                <Button
                  variant="ghost"
                  className="absolute end-0"
                  onPressIn={(e) => {
                    e.stopPropagation();
                    setIsText((prev) => !prev);
                  }}>
                  {isText ? <Eye size={18} /> : <EyeOff size={18} />}
                </Button>
              </View>
            )}
          />
          {errors.password?.message && (
            <Text className="text-xs tracking-wider text-red-500">{errors?.password?.message}</Text>
          )}
        </View>
        <View className="p-2">
          <Button disabled={isSubmitting} className="w-full" onPress={handleSubmit(onSubmit)}>
            <Text>{isSignUp ? 'Sign up' : 'Sign in'}</Text>
            {isSubmitting && <Spinner size="sm" variant="ring" />}
          </Button>
        </View>
        <View className="flex-row items-center justify-center pt-4">
          <Text className="tracking-widest">
            {isSignUp ? 'Already have an account?' : 'Do not have an account?'}
          </Text>
          <Button variant="link" onPress={handleSwitchScreen}>
            <Text className="tracking-widest">{isSignUp ? 'Sign in' : 'Sign up'}</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
