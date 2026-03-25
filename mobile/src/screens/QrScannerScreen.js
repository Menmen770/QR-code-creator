import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useAccessibility } from "../context/AccessibilityContext";
import ScreenWithAccessibility from "../components/ScreenWithAccessibility";

const isUrl = (str) => {
  const s = String(str || "").trim();
  return /^https?:\/\//i.test(s);
};

export default function QrScannerScreen() {
  const navigation = useNavigation();
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    const url = String(data || "").trim();
    if (isUrl(url)) {
      Linking.openURL(url).catch(() => {
        Alert.alert("שגיאה", "לא ניתן לפתוח את הקישור");
        setScanned(false);
      });
      navigation.goBack();
    } else {
      Alert.alert(
        "תוכן שנסרק",
        url || "לא נמצא תוכן",
        [
          {
            text: "סגור",
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  if (!permission) {
    return (
      <ScreenWithAccessibility>
      <View style={styles.center}>
        <Text style={styles.message}>טוען...</Text>
      </View>
      </ScreenWithAccessibility>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenWithAccessibility>
      <View style={styles.container}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>נדרשת הרשאת מצלמה</Text>
          <Text style={styles.permissionText}>
            כדי לסרוק קודי QR, יש לאפשר גישה למצלמה
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>אפשר גישה</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזרה</Text>
        </TouchableOpacity>
      </View>
      </ScreenWithAccessibility>
    );
  }

  return (
    <ScreenWithAccessibility>
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.scanHint}>מרכז את קוד ה-QR בתוך המסגרת</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>סגור</Text>
      </TouchableOpacity>
    </View>
    </ScreenWithAccessibility>
  );
}

const createStyles = (colors) => StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 16,
    color: colors.subText,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    color: colors.subText,
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "transparent",
  },
  scanHint: {
    marginTop: 24,
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  closeButton: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
