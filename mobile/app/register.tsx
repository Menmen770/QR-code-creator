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

type RegisterFormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

type TouchedState = {
  fullName?: boolean;
  email?: boolean;
  phone?: boolean;
  password?: boolean;
};

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isPhoneValid = (phone: string) =>
  /^[0-9]{9,11}$/.test(phone.replace(/\D/g, ''));

const isPasswordValid = (password: string) => {
  if (password.length < 7) return false;
  if (!/^[\p{L}\p{N}]+$/u.test(password)) return false;
  if (!/\p{L}/u.test(password)) return false;
  if (!/\p{N}/u.test(password)) return false;
  return true;
};

export default function RegisterScreen() {
  const [form, setForm] = useState<RegisterFormState>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [touched, setTouched] = useState<TouchedState>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof RegisterFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleBlur = (field: keyof RegisterFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = () =>
    form.fullName.trim().length >= 2 &&
    isEmailValid(form.email) &&
    isPhoneValid(form.phone) &&
    isPasswordValid(form.password);

  const handleSubmit = async () => {
    // קוד דיבאג כמו באתר
    if (form.fullName === '123!') {
      router.back();
      return;
    }

    if (!isFormValid()) {
      setError('נא למלא את כל השדות בצורה תקינה');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'ההרשמה נכשלה');
      }

      Alert.alert('ההרשמה הצליחה', 'כעת ניתן להתחבר עם המשתמש שיצרת.', [
        {
          text: 'להתחברות',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'ההרשמה נכשלה');
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
                <Text style={styles.title}>יצירת חשבון</Text>
                <Text style={styles.subtitle}>השלם הרשמה תוך כמה שניות</Text>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* שם מלא */}
              <View style={styles.field}>
                <Text style={styles.label}>שם מלא</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.fullName &&
                      form.fullName.trim().length < 2 &&
                      styles.inputInvalid,
                  ]}
                  value={form.fullName}
                  onChangeText={(text) => handleChange('fullName', text)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="השם המלא שלך"
                  textAlign="right"
                />
                {touched.fullName && form.fullName.trim().length < 2 && (
                  <Text style={styles.validationText}>
                    יש להזין לפחות 2 תווים
                  </Text>
                )}
              </View>

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

              {/* טלפון */}
              <View style={styles.field}>
                <Text style={styles.label}>טלפון</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.phone && !isPhoneValid(form.phone) && styles.inputInvalid,
                  ]}
                  value={form.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="ספרות בלבד"
                  keyboardType="phone-pad"
                  textAlign="right"
                />
                {touched.phone && !isPhoneValid(form.phone) && (
                  <Text style={styles.validationText}>
                    נא להזין 9-11 ספרות בלבד
                  </Text>
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
                      touched.password &&
                        !isPasswordValid(form.password) &&
                        styles.inputInvalid,
                    ]}
                    value={form.password}
                    onChangeText={(text) => handleChange('password', text)}
                    onBlur={() => handleBlur('password')}
                    placeholder="לפחות 7 תווים"
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

              {/* כפתור הרשמה */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>הרשמה</Text>
                )}
              </TouchableOpacity>

              {/* פוטר – "כבר יש לך חשבון? להתחברות" */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>כבר יש לך חשבון?</Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.footerLink}>להתחברות</Text>
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
    paddingVertical: 32,
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 8,
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

