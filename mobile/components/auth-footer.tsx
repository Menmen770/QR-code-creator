import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AuthFooter() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.title}>מחולל QR</Text>
            <Text style={styles.text}>
              מחולל QR מקצועי ליצירת קודים חכמים לאתרים, קבצים, אנשי קשר,
              וואטסאפ ורשתות חברתיות.
            </Text>
            <Text style={[styles.text, styles.textLast]}>
              מהיר, מאובטח ונוח לשימוש — עם התאמה אישית מלאה והורדה מיידית.
            </Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.title}>ניווט מהיר</Text>
            <Text style={styles.link}>מחולל QR</Text>
            <Text style={styles.link}>מה זה QR?</Text>
            <Text style={styles.link}>התחברות</Text>
            <Text style={styles.link}>הרשמה</Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.title}>מידע ותמיכה</Text>
            <Text style={styles.muted}>שירות יציב וזמין</Text>
            <Text style={styles.muted}>שמירת QR אחרונים לחשבון שלך</Text>
            <Text style={styles.link}>צור קשר</Text>
            <Text style={styles.link}>מדיניות פרטיות ותנאי שימוש</Text>
          </View>
        </View>

        <Text style={styles.bottom}>
          All rights reserved · 2026 · menmen770 ©
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 16,
  },
  col: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'right',
    color: '#111827',
  },
  text: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
  },
  textLast: {
    marginTop: 2,
  },
  link: {
    fontSize: 12,
    color: '#14b8a6',
    textAlign: 'right',
    marginBottom: 2,
  },
  muted: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 2,
  },
  bottom: {
    marginTop: 16,
    paddingTop: 8,
    fontSize: 11,
    textAlign: 'center',
    color: '#6b7280',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
});

