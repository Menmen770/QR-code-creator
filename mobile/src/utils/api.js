import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * הגדרות חיבור ל-backend
 * - API_PORT: פורט השרת (ברירת מחדל 5000)
 * - CUSTOM_IP: null = אוטומטי. למכשיר פיזי: "192.168.1.34"
 */
const API_PORT = 5000;
const CUSTOM_IP = "192.168.1.34";

function getHostFromExpo() {
  try {
    const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest?.hostUri;
    if (hostUri) {
      const host = hostUri.split(":")[0];
      if (host && host !== "localhost" && !host.startsWith("127.")) return host;
    }
  } catch (_) {}
  return null;
}

export function getApiBaseUrl() {
  const host =
    CUSTOM_IP ||
    getHostFromExpo() ||
    (Platform.OS === "android" ? "10.0.2.2" : "localhost");
  return `http://${host}:${API_PORT}`;
}
