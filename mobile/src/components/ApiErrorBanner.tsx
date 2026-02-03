import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ApiErrorBannerProps = {
  messages: string[];
  /** Single message when no list (e.g. generic error) */
  message?: string | null;
};

/**
 * Modern banner for API validation/error messages: card style with icon.
 */
export function ApiErrorBanner({ messages, message }: ApiErrorBannerProps) {
  const list = messages?.length ? messages : message ? [message] : [];
  if (list.length === 0) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="warning" size={20} color="#f87171" style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.title}>Please fix the following:</Text>
        {list.map((msg, i) => (
          <Text key={i} style={styles.item}>
            • {msg}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    padding: 14,
    marginBottom: 20,
  },
  icon: { marginRight: 12, marginTop: 2 },
  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: '600', color: '#fca5a5', marginBottom: 6 },
  item: { fontSize: 13, color: '#f87171', marginBottom: 2 },
});
