import React, { useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useAccessibility } from "../context/AccessibilityContext";
import ScreenWithAccessibility from "../components/ScreenWithAccessibility";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isAuthenticated = !!user;

  const handleScanQr = () => {
    navigation.navigate("QrScanner");
  };

  const handleCreateQr = () => {
    if (isAuthenticated) {
      navigation.navigate("QrGenerator");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <ScreenWithAccessibility>
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={require("../../assets/images/logo-full.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.cardsSection}>
        <TouchableOpacity
          style={styles.card}
          onPress={handleScanQr}
          activeOpacity={0.85}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>📷</Text>
          </View>
          <Text style={styles.cardTitle}>סרוק QR קיים</Text>
          <Text style={styles.cardSubtitle}>
            סרוק קוד QR כדי לפתוח את התוכן בדפדפן
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardSecondary]}
          onPress={handleCreateQr}
          activeOpacity={0.85}
        >
          <View style={[styles.cardIcon, styles.cardIconSecondary]}>
            <Text style={styles.cardIconText}>✨</Text>
          </View>
          <Text style={styles.cardTitle}>צור QR חדש</Text>
          <Text style={styles.cardSubtitle}>
            יצירת קוד QR אישי – נדרשת התחברות או הרשמה
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScreenWithAccessibility>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
    paddingBottom: 40,
  },
  logo: {
    width: 220,
    height: 72,
  },
  cardsSection: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.15)",
  },
  cardSecondary: {
    borderColor: "rgba(107, 114, 128, 0.12)",
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(20, 184, 166, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardIconSecondary: {
    backgroundColor: "rgba(107, 114, 128, 0.1)",
  },
  cardIconText: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
    textAlign: "right",
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.subText,
    lineHeight: 22,
    textAlign: "right",
  },
});
