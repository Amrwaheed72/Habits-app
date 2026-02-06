import '@/global.css';
import { Tabs } from 'expo-router';
import { ThemeToggle } from './index';
import { Calendar, ChartLine, PlusCircle } from 'lucide-react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: '#858585',
        tabBarActiveTintColor: '#6200ee',
        headerShadowVisible: false,
        tabBarStyle: { borderTopWidth: 0, elevation: 0, shadowOpacity: 0 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
          headerRight: () => ThemeToggle(),
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: 'Streaks',
          headerRight: () => ThemeToggle(),
          tabBarIcon: ({ color, size }) => <ChartLine size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          title: 'Add Habit',
          headerRight: () => ThemeToggle(),
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
