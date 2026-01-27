import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/**
 * TASK 2c — Edit project form (~45 min)
 *
 * Implement:
 * 1. Read project id from useLocalSearchParams().
 * 2. Fetch project with useQuery; pre-fill form with existing data.
 * 3. Same form fields as create (name, description, status) with validation.
 * 4. Submit with useMutation + updateProject. On success, invalidate
 *    list + detail queries and navigate back to detail or list.
 * 5. Loading states for fetch and submit; error handling.
 *
 * See ASSESSMENT.md for full task description.
 */
export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Task 2c: Edit project</Text>
      <Text style={styles.hint}>Project ID: {id ?? '—'}</Text>
      <Text style={styles.subhint}>
        Pre-fill from useQuery, useMutation for update, invalidate & navigate.
      </Text>
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
