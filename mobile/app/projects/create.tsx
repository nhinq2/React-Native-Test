import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../../src/api/projects';
import { FormField } from '../../src/components/FormField';
import { ApiErrorBanner } from '../../src/components/ApiErrorBanner';
import type { ProjectStatus } from '../../src/types/project';

const STATUS_OPTIONS: ProjectStatus[] = ['draft', 'active', 'completed'];

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('draft');
  const [touchedName, setTouchedName] = useState(false);
  const [touchedDescription, setTouchedDescription] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // 2. Client-side validation: non-empty name and description (validate on blur + submit)
  const nameError = (touchedName || submitAttempted) && !name.trim() ? 'Name is required' : null;
  const descriptionError =
    (touchedDescription || submitAttempted) && !description.trim()
      ? 'Description is required'
      : null;
  const isValid = name.trim().length > 0 && description.trim().length > 0;

  // 3. useMutation + createProject; on success invalidate list and navigate to /projects
  const mutation = useMutation({
    mutationFn: (input: { name: string; description: string; status: ProjectStatus }) =>
      createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      router.replace('/projects');
    },
  });

  const apiErrors = (mutation.error as Error & { errors?: string[] })?.errors;
  const apiErrorMessage = mutation.error?.message;

  const handleSubmit = () => {
    setSubmitAttempted(true);
    setTouchedName(true);
    setTouchedDescription(true);
    if (!isValid) return;
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    mutation.mutate({ name: trimmedName, description: trimmedDesc, status });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Form fields: name (required), description (required), status (default draft) — modern validation UI */}
        <FormField
          label="Name"
          required
          value={name}
          onChangeText={setName}
          onBlur={() => setTouchedName(true)}
          error={nameError}
          placeholder="Project name"
          editable={!mutation.isPending}
          accessibilityLabel="Project name"
        />
        <FormField
          label="Description"
          required
          value={description}
          onChangeText={setDescription}
          onBlur={() => setTouchedDescription(true)}
          error={descriptionError}
          placeholder="Project description"
          multiline
          numberOfLines={3}
          editable={!mutation.isPending}
          accessibilityLabel="Project description"
        />

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((s) => (
              <Pressable
                key={s}
                style={[
                  styles.statusChip,
                  status === s && styles.statusChipActive,
                ]}
                onPress={() => setStatus(s)}
                disabled={mutation.isPending}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    status === s && styles.statusChipTextActive,
                  ]}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 5. API validation errors — modern banner */}
        <ApiErrorBanner messages={apiErrors ?? []} message={apiErrors?.length ? null : apiErrorMessage} />

        {/* 4. Submit: loading state, disable button */}
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
            <Text style={styles.buttonText}>Create Project</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  field: { marginBottom: 20 },
  label: { fontSize: 14, color: '#aaa', marginBottom: 8, fontWeight: '500' },
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
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
