import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "../utils/api";
import { useAccessibility } from "../context/AccessibilityContext";
import AuthFooter from "../components/AuthFooter";
import BackToTopButton, { SCROLL_THRESHOLD } from "../components/BackToTopButton";
import ScreenWithAccessibility from "../components/ScreenWithAccessibility";

const RECENT_QR_KEY = "qrMasterRecentHistory";

export default function QrGeneratorScreen() {
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [url, setUrl] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const y = e?.nativeEvent?.contentOffset?.y ?? 0;
    setShowBackToTop(y > SCROLL_THRESHOLD);
  };

  const generateQr = async () => {
    if (!url.trim()) {
      setError("נא להזין כתובת אתר תקינה");
      setQrImage(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQrImage(null);

      const response = await fetch(`${getApiBaseUrl()}/api/generate-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: url.trim(),
          color: "#000000",
          bgColor: "#ffffff",
          dotsType: "square",
          cornersType: "square",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "היצירה נכשלה");
      }

      if (!data?.qrImage) {
        throw new Error("התקבלה תשובה ללא תמונת QR");
      }

      setQrImage(data.qrImage);

      try {
        const entry = {
          id: Date.now(),
          type: "url",
          value: url.trim(),
          createdAt: new Date().toISOString(),
        };
        const raw = await AsyncStorage.getItem(RECENT_QR_KEY);
        const existing = raw ? JSON.parse(raw) : [];
        const deduped = existing.filter(
          (item) => !(item.type === entry.type && item.value === entry.value)
        );
        const next = [entry, ...deduped].slice(0, 8);
        await AsyncStorage.setItem(RECENT_QR_KEY, JSON.stringify(next));
      } catch (_) {}
    } catch (requestError) {
      setError(requestError.message || "שגיאה בתקשורת עם השרת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithAccessibility>
    <View style={styles.pageInner}>
    <ScrollView
      ref={scrollRef}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={styles.content}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>מחולל QR בעיצוב אישי</Text>
        <Text style={styles.heroSubtitle}>
          שלב ראשון במובייל: יצירה בסיסית מ-URL
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>כתובת אתר</Text>
        <TextInput
          value={url}
          onChangeText={(text) => {
            setUrl(text);
            setError("");
          }}
          placeholder="https://example.com"
          autoCapitalize="none"
          keyboardType="url"
          style={styles.input}
          textAlign="right"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          onPress={generateQr}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>צור QR</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.previewTitle}>תצוגה מקדימה</Text>
        <View style={styles.previewBox}>
          {loading && <ActivityIndicator size="large" color={colors.primary} />}

          {!loading && qrImage ? (
            <Image
              source={{ uri: qrImage }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          ) : null}

          {!loading && !qrImage ? (
            <Text style={styles.placeholderText}>לא נוצר עדיין QR</Text>
          ) : null}
        </View>
      </View>
      <AuthFooter />
    </ScrollView>
    <BackToTopButton visible={showBackToTop} scrollRef={scrollRef} />
    </View>
    </ScreenWithAccessibility>
  );
}

const createStyles = (colors) => StyleSheet.create({
  pageInner: {
    flex: 1,
    overflow: "visible",
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
  hero: {
    alignItems: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.subText,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.inputBg,
  },
  error: {
    marginTop: 8,
    color: colors.error,
    textAlign: "right",
    fontSize: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
    marginBottom: 10,
  },
  previewBox: {
    minHeight: 230,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  placeholderText: {
    color: colors.subText,
    fontSize: 14,
  },
});
