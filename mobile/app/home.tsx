import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthNavbar } from "@/components/auth-navbar";
import { AuthFooter } from "@/components/auth-footer";

export default function QrScreen() {
  const [url, setUrl] = useState("https://example.com");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("נא להזין כתובת אתר תקינה");
      setQrImage(null);
      return;
    }

    setLoading(true);
    setError(null);
    setQrImage(null);

    try {
      const response = await fetch("http://192.168.1.34:5000/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: url.trim(),
          color: "#000000",
          bgColor: "#ffffff",
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "היצירה נכשלה");
      }

      const data = await response.json();
      if (!data.qrImage) {
        throw new Error("שרת החזיר תגובה ללא תמונת QR");
      }

      setQrImage(data.qrImage);
    } catch (err: any) {
      console.error("QR generation error", err);
      setError(err.message || "היצירה נכשלה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* כותרת */}
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>מחולל QR בעיצוב אישי</Text>
              <Text style={styles.heroSubtitle}>
                ליצור ולהציג קודי QR ישירות מהנייד שלך.
              </Text>
            </View>

            <View style={styles.cardsRow}>
              {/* צד שמאל – קלט */}
              <View style={[styles.card, styles.cardLeft]}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepText}>1</Text>
                  </View>
                  <Text style={styles.stepTitle}>הזן את כתובת האתר שלך</Text>
                </View>

                <TextInput
                  style={styles.input}
                  value={url}
                  onChangeText={(text) => {
                    setUrl(text);
                    setError(null);
                  }}
                  placeholder="https://example.com"
                  keyboardType="url"
                  autoCapitalize="none"
                  textAlign="right"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>צור QR</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* צד ימין – תצוגה מוקדמת */}
              <View style={[styles.card, styles.cardRight]}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepText}>2</Text>
                  </View>
                  <Text style={styles.stepTitle}>קוד ה-QR שלך</Text>
                </View>

                <View style={styles.previewBox}>
                  {loading && (
                    <View style={styles.previewCenter}>
                      <ActivityIndicator size="large" color="#14b8a6" />
                      <Text style={styles.previewMuted}>יוצר QR...</Text>
                    </View>
                  )}

                  {!loading && qrImage && (
                    <View style={styles.previewCenter}>
                      <Image
                        source={{ uri: qrImage }}
                        style={styles.qrImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}

                  {!loading && !qrImage && !error && (
                    <View style={styles.previewCenter}>
                      <Text style={styles.previewPlaceholder}>QR</Text>
                      <Text style={styles.previewMuted}>
                        התחל להקליד כתובת אתר ולחץ על "צור QR".
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          <AuthFooter />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  container: {
    flex: 1,
  },
  hero: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2a33",
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  cardsRow: {
    flexDirection: "column",
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    marginBottom: 8,
  },
  cardRight: {},
  stepHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#14b8a6",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#b91c1c",
    textAlign: "right",
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#14b8a6",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  previewBox: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    padding: 16,
    minHeight: 220,
  },
  previewCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  previewPlaceholder: {
    fontSize: 36,
    fontWeight: "800",
    color: "#9ca3af",
    marginBottom: 8,
  },
  previewMuted: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
  qrImage: {
    width: 200,
    height: 200,
  },
});
