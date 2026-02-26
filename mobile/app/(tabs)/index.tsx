import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { AuthNavbar } from '@/components/auth-navbar';
import { AuthFooter } from '@/components/auth-footer';

type FormState = {
  email: string;
  password: string;
};

type TouchedState = {
  email?: boolean;
  password?: boolean;
};

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isPasswordValid = (password: string) => {
  if (password.length < 7) return false;
  if (!/^[\p{L}\p{N}]+$/u.test(password)) return false;
  if (!/\p{L}/u.test(password)) return false;
  if (!/\p{N}/u.test(password)) return false;
  return true;
};

export default function LoginScreen() {
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [touched, setTouched] = useState<TouchedState>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => isEmailValid(form.email) && isPasswordValid(form.password);

  const handleSubmit = async () => {
    // אותו "קוד אדמין" כמו באתר
    if (form.password === '123!') {
      Alert.alert('התחברת', 'כניסה ישירה (מצב דיבאג)');
      return;
    }

    if (!isFormValid()) {
      setError('נא להזין אימייל וסיסמה תקינים');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // שים כאן את ה-URL של ה-backend שלך במקום localhost/IP
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'ההתחברות נכשלה');
      }

      Alert.alert('התחברות הצליחה', 'ברוך שובך!');
      // לאחר התחברות מוצלחת עוברים לעמוד הראשי
      router.replace('/home');
    } catch (err: any) {
      setError(err.message || 'ההתחברות נכשלה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>ברוך שובך</Text>
                <Text style={styles.subtitle}>התחבר כדי להמשיך</Text>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* אימייל */}
              <View style={styles.field}>
                <Text style={styles.label}>אימייל</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.email && !isEmailValid(form.email) && styles.inputInvalid,
                  ]}
                  value={form.email}
                  onChangeText={(text) => handleChange('email', text)}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="right"
                />
                {touched.email && !isEmailValid(form.email) && (
                  <Text style={styles.validationText}>נא להזין אימייל תקין</Text>
                )}
              </View>

              {/* סיסמה */}
              <View style={styles.field}>
                <Text style={styles.label}>סיסמה</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      touched.password && !isPasswordValid(form.password) && styles.inputInvalid,
                    ]}
                    value={form.password}
                    onChangeText={(text) => handleChange('password', text)}
                    onBlur={() => handleBlur('password')}
                    placeholder="הסיסמה שלך"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    textAlign="right"
                  />
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowPassword((prev) => !prev)}>
                    <Text style={styles.toggleButtonText}>
                      {showPassword ? 'הסתר' : 'הצג'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {touched.password && !isPasswordValid(form.password) && (
                  <Text style={styles.validationText}>
                    הסיסמה חייבת לכלול לפחות 7 תווים, אותיות (עברית/אנגלית) ומספרים בלבד.
                  </Text>
                )}
              </View>

              {/* כפתור התחברות */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>התחברות</Text>
                )}
              </TouchableOpacity>

              {/* פוטר – "אין לך חשבון? להרשמה" */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>אין לך חשבון?</Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.footerLink}>להרשמה</Text>
                </TouchableOpacity>
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
    backgroundColor: '#f5f7fb',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 56,
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2a33',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  errorText: {
    backgroundColor: '#f8d7da',
    color: '#842029',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  inputInvalid: {
    borderColor: '#dc3545',
  },
  validationText: {
    marginTop: 4,
    fontSize: 12,
    color: '#dc3545',
    textAlign: 'right',
  },
  passwordRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
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
    borderColor: '#ced4da',
    backgroundColor: '#f8f9fa',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#495057',
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#14b8a6',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
  },
  footerLink: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '600',
  },
});
