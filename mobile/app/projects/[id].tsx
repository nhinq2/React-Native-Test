import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

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

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Task 2a: Project detail</Text>
      <Text style={styles.hint}>Project ID: {id ?? '—'}</Text>
      <Text style={styles.subhint}>Fetch with useQuery, show loading/error, add Edit navigation.</Text>
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
  placeholder: { fontSize: 18, fontWeight: '600', color: '#a78bfa', marginBottom: 8 },
  hint: { fontSize: 14, color: '#999', marginBottom: 4 },
  subhint: { fontSize: 13, color: '#555', textAlign: 'center' },
});
