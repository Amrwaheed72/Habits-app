import RouteGuard from '@/components/RouteGuard';
import '@/global.css';
import { AuthProvider } from '@/lib/auth-context';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalProvider } from '@/contexts/global-context';
export { ErrorBoundary } from 'expo-router';
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <RouteGuard>
                <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
                  <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                  <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  </Stack>
                  <PortalHost />
                  <Toaster richColors closeButton />
                </ThemeProvider>
              </RouteGuard>
            </QueryClientProvider>
          </SafeAreaProvider>
        </AuthProvider>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
