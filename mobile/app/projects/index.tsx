import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * TASK 1 — Projects list screen (~1.5–2h)
 *
 * Implement:
 * 1. Fetch projects from the API using React Query (useQuery).
 *    - Use fetchProjects from src/api/projects.ts
 *    - Optional: use status filter from useFilterStore (Task 3)
 * 2. Render a FlatList of projects (name, description, status).
 * 3. Loading state: show a spinner or skeleton while fetching.
 * 4. Error state: show a message and retry option.
 * 5. Pull-to-refresh (RefreshControl) to refetch.
 * 6. Tappable rows: navigate to /projects/[id] for detail.
 * 7. FAB or header button: navigate to /projects/create.
 *
 * See ASSESSMENT.md for full task description.
 */
export default function ProjectsListScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Task 1: Implement projects list</Text>
      <Text style={styles.hint}>
        Use React Query (useQuery), FlatList, loading/error states, pull-to-refresh.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push('/projects/create')}
      >
        <Text style={styles.buttonText}>Create Project (nav only)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a78bfa',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
