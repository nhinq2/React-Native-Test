import { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../../src/api/projects';
import { useFilterStore } from '../../src/stores/filterStore';
import type { ProjectStatus } from '../../src/types/project';

const FILTER_OPTIONS: { value: ProjectStatus | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

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
 *
 * ---
 *
 * TASK 3 — Filter and polish (30-45 minutes)
 *
 * 1. Status filter:
 *    - useFilterStore holds selected status (null = "all", draft | active | completed).
 *    - useQuery calls fetchProjects(status ?? undefined) so "all" sends no param, others send ?status=...
 *    - UI: horizontal chips (All, Draft, Active, Completed) above the list with selected/pressed styles.
 *
 * 2. Polish:
 *    - Empty state: "No projects yet. Tap Create to add your first project." when no filter; when filtered,
 *      "No {status} projects. Try another filter or create one."
 *    - Accessibility: accessibilityRole="button" and accessibilityLabel on Create, Retry, filter chips,
 *      list rows, loading view, filter row, and empty state; accessibilityState={{ selected }} on chips.
 */
export default function ProjectsListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const {status, setStatus} = useFilterStore();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['projects', status],
    queryFn: () => fetchProjects(status ?? undefined),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => router.push('/projects/create')}
          style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Create new project"
        >
          <Text style={styles.headerButtonText}>Create</Text>
        </Pressable>
      ),
    });
  }, [navigation, router]);

  const projects = data ?? [];
  const hasActiveFilter = status !== null;
  const emptyMessage = hasActiveFilter
    ? `No ${status} projects. Try another filter or create one.`
    : 'No projects yet. Tap Create to add your first project.';

  const showLoadingInBody = isLoading && !data;
  const showErrorInBody = isError && !data;

  return (
    <View style={styles.container}>
      <View style={styles.filterRow} accessibilityLabel="Filter by status">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_OPTIONS.map(({ value, label }) => {
            const selected = status === value;
            return (
              <Pressable
                key={label}
                onPress={() => setStatus(value)}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${label}`}
                accessibilityState={{ selected }}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {showLoadingInBody ? (
        <View style={styles.bodyCentered} accessibilityLabel="Loading projects">
          <ActivityIndicator size="large" color="#a78bfa" />
          <Text style={styles.loadingText}>Loading projects…</Text>
        </View>
      ) : showErrorInBody ? (
        <View style={styles.bodyCentered}>
          <Text style={styles.errorText}>
            {error?.message ?? 'Failed to load projects'}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => refetch()}
            accessibilityRole="button"
            accessibilityLabel="Retry loading projects"
          >
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={projects.length === 0 ? styles.listEmpty : styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#a78bfa"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState} accessibilityLabel={emptyMessage}>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => router.push(`/projects/${item.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Open project ${item.name}, status ${item.status}`}
            >
              <Text style={styles.rowName}>{item.name}</Text>
              <Text style={styles.rowDescription} numberOfLines={2}>
                {item.description || '—'}
              </Text>
              <Text style={styles.rowStatus}>{item.status}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#0f0f1a',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
  },
  chipSelected: {
    backgroundColor: '#6366f1',
  },
  chipPressed: { opacity: 0.85 },
  chipText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bodyCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  row: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  rowPressed: { opacity: 0.9 },
  rowName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#eee',
    marginBottom: 4,
  },
  rowDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
  },
  rowStatus: {
    fontSize: 13,
    color: '#a78bfa',
    textTransform: 'capitalize',
  },
  headerButton: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  headerButtonPressed: { opacity: 0.85 },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
});
