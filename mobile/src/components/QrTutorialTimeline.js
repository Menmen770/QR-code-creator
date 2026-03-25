import React, { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAccessibility } from "../context/AccessibilityContext";

const steps = [
  {
    num: 1,
    title: "בחרו את סוג קוד ה-QR",
    desc: "בחרו מתוך מגוון סוגים: אתר, PDF, אימייל, איש קשר, וואטסאפ ועוד.",
    img: require("../../assets/images/tutorial/step1.png"),
  },
  {
    num: 2,
    title: "הזינו את הפרטים",
    desc: "הקלידו את המידע שתרצו להטמיע בקוד – כתובת, טקסט, מספר טלפון וכדומה.",
    img: require("../../assets/images/tutorial/step2.png"),
  },
  {
    num: 3,
    title: "עיצוב והורדה",
    desc: "התאימו צבעים, צורות ולוגו, ואז הורידו את קוד ה-QR בפורמט PNG או SVG.",
    img: require("../../assets/images/tutorial/step3.png"),
  },
];

export default function QrTutorialTimeline() {
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>איך יוצרים קוד QR?</Text>
      <Text style={styles.subtitle}>
        שלושה שלבים פשוטים ליצירת קוד QR מקצועי
      </Text>

      <View style={styles.timeline}>
        {steps.map((step) => (
          <View key={step.num} style={styles.stepCard}>
            <View style={styles.textWrap}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
            <View style={styles.imgWrap}>
              <Image
                source={step.img}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    section: {
      paddingVertical: 20,
      marginVertical: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 20,
      marginTop: 20,
    },
    subtitle: {
      fontSize: 17,
      color: colors.subText,
      textAlign: "center",
      marginBottom: 60,
    },
    timeline: {
      gap: 20,
    },
    stepCard: {
      flexDirection: "column",
    },
    textWrap: {
      width: "100%",
      marginBottom: 0,
      paddingBottom: 0,
    },
    img: {
      width: 300,
      height: 300,
    },
    imgWrap: {
      alignItems: "center",
      marginTop: -12,
    },
    stepTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
      textAlign: "center",
    },
    stepDesc: {
      fontSize: 15,
      color: colors.subText,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: 0,
    },
  });
