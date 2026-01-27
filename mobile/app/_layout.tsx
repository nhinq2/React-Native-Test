import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#eee',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'IG Assessment' }} />
        <Stack.Screen name="projects/index" options={{ title: 'Projects' }} />
        <Stack.Screen name="projects/[id]" options={{ title: 'Project Detail' }} />
        <Stack.Screen name="projects/create" options={{ title: 'New Project' }} />
        <Stack.Screen name="projects/[id]/edit" options={{ title: 'Edit Project' }} />
      </Stack>
    </QueryClientProvider>
  );
}
