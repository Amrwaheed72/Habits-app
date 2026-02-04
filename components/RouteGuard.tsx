import { useAuth } from '@/lib/auth-context';
import { useRouter, useSegments } from 'expo-router';
import { ReactNode, useEffect } from 'react';

const RouteGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'auth';
    if (!user && !inAuthGroup) {
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, segments, isLoading, router]);
  return <>{children}</>;
};

export default RouteGuard;
