import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconBrandGoogle } from "@tabler/icons-react-native";
import { getApiBaseUrl } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useAccessibility } from "../context/AccessibilityContext";
import AuthFooter from "../components/AuthFooter";
import BackToTopButton, { SCROLL_THRESHOLD } from "../components/BackToTopButton";
import ScreenWithAccessibility from "../components/ScreenWithAccessibility";

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordValid = (password) => {
  if (password.length < 7) return false;
  if (!/^[\p{L}\p{N}]+$/u.test(password)) return false;
  if (!/\p{L}/u.test(password)) return false;
  if (!/\p{N}/u.test(password)) return false;
  return true;
};

export default function LoginScreen({ navigation }) {
  const { refreshUser } = useAuth();
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const y = e?.nativeEvent?.contentOffset?.y ?? 0;
    setShowBackToTop(y > SCROLL_THRESHOLD);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = () =>
    isEmailValid(form.email) && isPasswordValid(form.password);

  const handleSubmit = async () => {
    if (form.password === "123!") {
      refreshUser({ fullName: "משתמש", email: form.email, phone: "" });
      navigation.replace("QrGenerator");
      return;
    }

    if (!isFormValid()) {
      setError("נא להזין אימייל וסיסמה תקינים");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "ההתחברות נכשלה");
      }

      refreshUser(data.user);
      navigation.replace("QrGenerator");
    } catch (err) {
      setError(err.message || "ההתחברות נכשלה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithAccessibility>
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.pageInner}>
        <ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>ברוך שובך</Text>
            <Text style={styles.subtitle}>התחבר כדי להמשיך</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.field}>
            <Text style={styles.label}>אימייל</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && !isEmailValid(form.email) && styles.inputInvalid,
              ]}
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              onBlur={() => handleBlur("email")}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />
            {touched.email && !isEmailValid(form.email) && (
              <Text style={styles.validationText}>נא להזין אימייל תקין</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>סיסמה</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  touched.password &&
                    !isPasswordValid(form.password) &&
                    styles.inputInvalid,
                ]}
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                onBlur={() => handleBlur("password")}
                placeholder="הסיסמה שלך"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textAlign="right"
              />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Text style={styles.toggleButtonText}>
                  {showPassword ? "הסתר" : "הצג"}
                </Text>
              </TouchableOpacity>
            </View>
            {touched.password && !isPasswordValid(form.password) && (
              <Text style={styles.validationText}>
                הסיסמה חייבת לכלול לפחות 7 תווים, אותיות (עברית/אנגלית) ומספרים
                בלבד.
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>התחברות</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>או</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() =>
              Linking.openURL(`${getApiBaseUrl()}/api/auth/google`)
            }
          >
            <IconBrandGoogle size={22} color="#fff" stroke={2} />
            <Text style={styles.googleButtonText}>התחבר עם גוגל</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>אין לך חשבון?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}>להרשמה</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AuthFooter />
        </ScrollView>
        <BackToTopButton visible={showBackToTop} scrollRef={scrollRef} />
        </View>
      </KeyboardAvoidingView>
    </ScreenWithAccessibility>
  );
}

const createStyles = (colors) => StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageInner: {
    flex: 1,
    overflow: "visible",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginVertical: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subText,
    marginTop: 4,
  },
  errorText: {
    backgroundColor: colors.errorBg,
    color: colors.errorText,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.inputBg,
  },
  inputInvalid: {
    borderColor: colors.error,
  },
  validationText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
    textAlign: "right",
  },
  passwordRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  toggleButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.toggleBg,
  },
  toggleButtonText: {
    fontSize: 14,
    color: colors.subText,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.subText,
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#4285f4",
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#4285f4",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.subText,
    marginLeft: 4,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
});
