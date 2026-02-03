import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '../../src/api/projects';

/**
 * TASK 2a — Project detail screen (~45 min)
 *
 * Implement:
 * 1. Read project id from useLocalSearchParams().
 * 2. Fetch project by id with React Query (useQuery + fetchProjectById).
 * 3. Show loading and error states.
 * 4. Display name, description, status, dates.
 * 5. Add an "Edit" button that navigates to /projects/[id]/edit.
 *
 * See ASSESSMENT.md for full task description.
 */
export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 1. Read id from useLocalSearchParams; 2. Fetch with useQuery + fetchProjectById
  const { data: project, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id!),
    enabled: !!id,
  });

  // 3. Loading state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#a78bfa" />
        <Text style={styles.loadingText}>Loading project…</Text>
      </View>
    );
  }

  // 3. Error state
  if (isError || !project) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error?.message ?? 'Project not found'}</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => refetch()}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // 4. Display name, description, status, dates
  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{project.name}</Text>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{project.description || '—'}</Text>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, styles.status]}>{project.status}</Text>
        <Text style={styles.label}>Created</Text>
        <Text style={styles.valueSecondary}>{formatDate(project.createdAt)}</Text>
        <Text style={styles.label}>Updated</Text>
        <Text style={styles.valueSecondary}>{formatDate(project.updatedAt)}</Text>
      </View>
      {/* 5. Edit button → /projects/[id]/edit */}
      <Pressable
        style={({ pressed }) => [styles.button, styles.editButton, pressed && styles.buttonPressed]}
        onPress={() => router.push(`/projects/${id}/edit`)}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 24,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 15, color: '#999' },
  errorText: { fontSize: 16, color: '#f87171', textAlign: 'center', marginBottom: 20 },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  editButton: { marginTop: 24 },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
  },
  label: { fontSize: 12, color: '#888', marginTop: 12, marginBottom: 4, textTransform: 'uppercase' },
  value: { fontSize: 17, color: '#eee', marginBottom: 4 },
  valueSecondary: { fontSize: 14, color: '#999' },
  status: { color: '#a78bfa', textTransform: 'capitalize' },
});
