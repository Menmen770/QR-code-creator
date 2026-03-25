import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAccessibility } from "../context/AccessibilityContext";

export default function AuthFooter() {
  const navigation = useNavigation();
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.qrSection}>
          <Text style={styles.title}>מחולל QR</Text>
          <Text style={styles.text}>
            מחולל QR מקצועי ליצירת קודים חכמים לאתרים, קבצים, אנשי קשר, וואטסאפ
            ורשתות חברתיות.
          </Text>
          <Text style={[styles.text, styles.textLast]}>
            מהיר, מאובטח ונוח לשימוש — עם התאמה אישית מלאה והורדה מיידית.
          </Text>
        </View>

        <View style={styles.twoColsRow}>
          <View style={styles.col}>
            <Text style={styles.title}>ניווט מהיר</Text>
            <TouchableOpacity onPress={() => navigation.navigate("QrGenerator")}>
              <Text style={styles.link}>מחולל QR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("LearnQr")}>
              <Text style={styles.link}>מה זה QR?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>התחברות</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>הרשמה</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <Text style={styles.title}>מידע ותמיכה</Text>
            <Text style={styles.muted}>שירות יציב וזמין</Text>
            <Text style={styles.muted}>שמירת QR אחרונים</Text>
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

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      marginTop: 32,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    container: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    qrSection: {
      marginBottom: 16,
    },
    twoColsRow: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      gap: 24,
    },
    col: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 6,
      textAlign: "right",
      color: colors.text,
    },
    text: {
      fontSize: 12,
      color: colors.subText,
      textAlign: "right",
    },
    textLast: {
      marginTop: 2,
    },
    link: {
      fontSize: 12,
      color: colors.primary,
      textAlign: "right",
      marginBottom: 2,
    },
    muted: {
      fontSize: 12,
      color: colors.subText,
      textAlign: "right",
      marginBottom: 2,
    },
    bottom: {
      marginTop: 16,
      paddingTop: 8,
      fontSize: 11,
      textAlign: "center",
      color: colors.subText,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
  });
