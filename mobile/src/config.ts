import { Platform } from 'react-native';

/**
 * Backend API base URL.
 * - iOS simulator: localhost
 * - Android emulator: 10.0.2.2 (host loopback)
 * - Physical device: use your machine's LAN IP, e.g. http://192.168.1.x:3000
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');
