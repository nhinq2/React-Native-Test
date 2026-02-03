import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjectById, updateProject } from '../../../src/api/projects';
import type { ProjectStatus } from '../../../src/types/project';

const STATUS_OPTIONS: ProjectStatus[] = ['draft', 'active', 'completed'];

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
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('draft');
  const [touched, setTouched] = useState(false);

  // 1. Read id; 2. Fetch with useQuery and pre-fill form
  const { data: project, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setStatus(project.status);
    }
  }, [project]);

  // 3. Same validation as create (no extra UI/UX components)
  const nameError = touched && !name.trim() ? 'Name is required' : null;
  const descriptionError = touched && !description.trim() ? 'Description is required' : null;
  const isValid = name.trim().length > 0 && description.trim().length > 0;

  // 4. useMutation + updateProject; on success invalidate list and detail, navigate back
  const mutation = useMutation({
    mutationFn: (input: { name?: string; description?: string; status?: ProjectStatus }) =>
      updateProject(id!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      router.back();
    },
  });

  const apiErrors = (mutation.error as Error & { errors?: string[] })?.errors;
  const apiErrorMessage = mutation.error?.message;

  const handleSubmit = () => {
    setTouched(true);
    if (!isValid) return;
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    mutation.mutate({ name: trimmedName, description: trimmedDesc, status });
  };

  // 5. Loading state for fetch
  if (isLoading && !project) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#a78bfa" />
        <Text style={styles.loadingText}>Loading project…</Text>
      </View>
    );
  }

  if (isError && !project) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error?.message ?? 'Failed to load project'}</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => refetch()}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={[styles.input, nameError && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Project name"
            placeholderTextColor="#555"
            editable={!mutation.isPending}
            accessibilityLabel="Project name"
          />
          {nameError ? <Text style={styles.fieldError}>{nameError}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline, descriptionError && styles.inputError]}
            value={description}
            onChangeText={setDescription}
            placeholder="Project description"
            placeholderTextColor="#555"
            multiline
            numberOfLines={3}
            editable={!mutation.isPending}
            accessibilityLabel="Project description"
          />
          {descriptionError ? <Text style={styles.fieldError}>{descriptionError}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((s) => (
              <Pressable
                key={s}
                style={[styles.statusChip, status === s && styles.statusChipActive]}
                onPress={() => setStatus(s)}
                disabled={mutation.isPending}
              >
                <Text style={[styles.statusChipText, status === s && styles.statusChipTextActive]}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {apiErrors?.length ? (
          <View style={styles.apiErrors}>
            {apiErrors.map((msg, i) => (
              <Text key={i} style={styles.apiErrorText}>
                {msg}
              </Text>
            ))}
          </View>
        ) : null}
        {apiErrorMessage && !apiErrors?.length ? (
          <Text style={styles.apiErrorText}>{apiErrorMessage}</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!isValid || mutation.isPending) && styles.buttonDisabled,
            pressed && !mutation.isPending && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  centered: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12, fontSize: 15, color: '#999' },
  errorText: { fontSize: 16, color: '#f87171', textAlign: 'center', marginBottom: 20 },
  field: { marginBottom: 20 },
  label: { fontSize: 14, color: '#aaa', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#eee',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputMultiline: { minHeight: 88, textAlignVertical: 'top' },
  inputError: { borderColor: '#f87171' },
  fieldError: { fontSize: 13, color: '#f87171', marginTop: 4 },
  statusRow: { flexDirection: 'row', gap: 10 },
  statusChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
  },
  statusChipActive: { backgroundColor: '#6366f1' },
  statusChipText: { fontSize: 14, color: '#999' },
  statusChipTextActive: { color: '#fff', fontWeight: '600' },
  apiErrors: { marginBottom: 16 },
  apiErrorText: { fontSize: 14, color: '#f87171', marginBottom: 4 },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
