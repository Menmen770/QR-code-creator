import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';

export function AuthNavbar() {
  const pathname = usePathname();
  const isLogin = pathname === '/(tabs)' || pathname === '/';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {/* כפתורי התחברות/הרשמה כמו באתר */}
          <View style={styles.actionsRow}>
            {isLogin ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.outlineButton]}
                  disabled
                  activeOpacity={0.8}>
                  <Text style={[styles.buttonText, styles.outlineButtonText]}>
                    התחברות
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.filledButton]}
                  onPress={() => router.push('/register')}
                  activeOpacity={0.8}>
                  <Text style={[styles.buttonText, styles.filledButtonText]}>
                    הרשמה
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.outlineButton]}
                  onPress={() => router.back()}
                  activeOpacity={0.8}>
                  <Text style={[styles.buttonText, styles.outlineButtonText]}>
                    התחברות
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.filledButton]}
                  disabled
                  activeOpacity={0.8}>
                  <Text style={[styles.buttonText, styles.filledButtonText]}>
                    הרשמה
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* לוגו המקורי */}
          <TouchableOpacity
            style={styles.brandContainer}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}>
            <Image
              source={require('@/assets/images/logo-full.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  wrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  outlineButton: {
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  filledButton: {
    borderColor: '#14b8a6',
    backgroundColor: '#14b8a6',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#4b5563',
  },
  filledButtonText: {
    color: '#ffffff',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    height: 32,
    width: 140,
  },
});

