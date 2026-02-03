import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FormFieldProps = {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (t: string) => void;
  onBlur?: () => void;
  error: string | null;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  accessibilityLabel?: string;
  containerStyle?: ViewStyle;
};

/**
 * Reusable form field with modern validation styling:
 * - Error state: red border, subtle error background, icon + message
 * - Valid state (touched + filled): subtle success border
 */
export function FormField({
  label,
  required,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  multiline,
  numberOfLines = 3,
  editable = true,
  accessibilityLabel,
  containerStyle,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.trim().length > 0;
  const showValid = hasValue && !error && (focused === false);

  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error && styles.inputError,
          showValid && styles.inputValid,
          focused && styles.inputFocused,
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        placeholderTextColor="#555"
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={editable}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !editable }}
        accessibilityValue={{ text: value }}
        accessibilityHint={error ?? undefined}
      />
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={16} color="#f87171" style={styles.errorIcon} />
          <Text style={styles.fieldError}>{error}</Text>
        </View>
      ) : showValid ? (
        <View style={styles.validRow}>
          <Ionicons name="checkmark-circle" size={16} color="#34d399" style={styles.validIcon} />
          <Text style={styles.validText}>Looks good</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 20 },
  label: { fontSize: 14, color: '#aaa', marginBottom: 8, fontWeight: '500' },
  required: { color: '#f87171' },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#eee',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputMultiline: { minHeight: 88, textAlignVertical: 'top' },
  inputFocused: { borderColor: '#6366f1', backgroundColor: '#1e1e32' },
  inputError: {
    borderColor: '#f87171',
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
  },
  inputValid: {
    borderColor: 'rgba(52, 211, 153, 0.5)',
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingLeft: 2,
  },
  errorIcon: { marginRight: 6 },
  fieldError: { fontSize: 13, color: '#f87171', flex: 1 },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingLeft: 2,
  },
  validIcon: { marginRight: 6 },
  validText: { fontSize: 13, color: '#34d399' },
});
