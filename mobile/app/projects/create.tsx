import { View, Text, StyleSheet } from 'react-native';

/**
 * TASK 2b — Create project form (~1h)
 *
 * Implement:
 * 1. Form with fields: name (required), description (required), status (picker, default "draft").
 * 2. Client-side validation: non-empty name and description.
 * 3. Submit with React Query (useMutation + createProject). On success, invalidate
 *    projects list query and navigate back to /projects.
 * 4. Show loading state on submit button; disable while submitting.
 * 5. Show API validation errors if returned (e.g. 400).
 *
 * See ASSESSMENT.md for full task description.
 */
export default function CreateProjectScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Task 2b: Create project form</Text>
      <Text style={styles.hint}>
        Form (name, description, status) + validation + useMutation + invalidate & navigate.
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
  hint: { fontSize: 14, color: '#666', textAlign: 'center' },
});
