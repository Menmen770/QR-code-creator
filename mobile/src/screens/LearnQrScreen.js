import React, { useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAccessibility } from "../context/AccessibilityContext";
import AuthFooter from "../components/AuthFooter";
import BackToTopButton, { SCROLL_THRESHOLD } from "../components/BackToTopButton";
import QrTutorialTimeline from "../components/QrTutorialTimeline";
import ScreenWithAccessibility from "../components/ScreenWithAccessibility";

export default function LearnQrScreen() {
  const navigation = useNavigation();
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const y = e?.nativeEvent?.contentOffset?.y ?? 0;
    setShowBackToTop(y > SCROLL_THRESHOLD);
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
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.mainTitle}>מה זה QR?</Text>
          <Text style={styles.lead}>
            QR (קיצור של Quick Response) הוא ברקוד דו-ממדי שמאפשר לשמור ולסרוק
            מידע במהירות גבוהה. במקום להקליד כתובת ידנית, המשתמש סורק את הקוד
            במצלמה ומקבל גישה מיידית לתוכן.
          </Text>

          <QrTutorialTimeline />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>רקע קצר</Text>
            <Text style={styles.para}>
              הטכנולוגיה פותחה ביפן בשנת 1994 על ידי Denso Wave, בתחילה לצורכי
              מעקב תעשייתי. עם השנים, ובעיקר בזכות הסמארטפונים, קודי QR הפכו לכלי
              מרכזי בעולם העסקי, השיווקי והשירותי.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>איך זה עובד?</Text>
            <Text style={styles.para}>
              הקוד מורכב ממטריצה של ריבועים שחורים ולבנים. הקורא מזהה את תבניות
              הניווט (הריבועים בפינות), מפענח את המידע ומתרגם אותו לטקסט, קישור,
              איש קשר, נתוני Wi-Fi ועוד.
            </Text>
            <Text style={styles.para}>
              לקוד QR יש גם מנגנון תיקון שגיאות, כך שגם אם חלק קטן ממנו נפגע
              בהדפסה או בלכלוך — ברוב המקרים עדיין אפשר לסרוק אותו בהצלחה.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>שימושים נפוצים</Text>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>הפניה לאתר, לעמוד נחיתה או לטופס יצירת קשר</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>שיתוף קובצי PDF, מצגות וקטלוגים דיגיטליים</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>שמירת איש קשר (vCard) בלחיצה אחת</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>פתיחת שיחת WhatsApp עם הודעה מוכנה מראש</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>חיבור מהיר לרשת Wi-Fi ללא הקלדת סיסמה</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>שילוט חכם באירועים, מסעדות, חנויות ונקודות שירות</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>סטטי מול דינמי</Text>
            <Text style={styles.para}>
              קוד סטטי שומר את התוכן בתוך הקוד עצמו, ולכן אי אפשר לשנות אותו אחרי
              יצירה. קוד דינמי מפנה לכתובת ביניים, ובדרך כלל מאפשר לעדכן את היעד,
              לעקוב אחרי שימושים ולקבל סטטיסטיקות.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>עקרונות לעיצוב מקצועי</Text>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>שמרו על ניגודיות גבוהה בין הקוד לרקע</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>הימנעו מהקטנת הקוד מתחת לגודל קריא</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>אל תעמיסו אלמנטים גרפיים שמסתירים אזורי זיהוי</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>בדקו סריקה בכמה מכשירים ותנאי תאורה</Text>
            </View>
            <View style={styles.list}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItem}>
                הוסיפו קריאה לפעולה ברורה ליד הקוד (למשל: "סרקו לקבלת פרטים")
              </Text>
            </View>
          </View>

          <View style={[styles.section, styles.sectionLast]}>
            <Text style={styles.sectionTitle}>לסיכום</Text>
            <Text style={styles.para}>
              QR הוא כלי פשוט ליישום אך חזק מאוד בתוצאה: הוא מקצר תהליכים, משפר
              חוויית משתמש ומייצר מעבר מהיר בין עולם פיזי לדיגיטלי.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate("QrGenerator")}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaButtonText}>יצירת QR עכשיו</Text>
            </TouchableOpacity>
          </View>

          <AuthFooter />
        </ScrollView>
        <BackToTopButton visible={showBackToTop} scrollRef={scrollRef} />
      </View>
    </ScreenWithAccessibility>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    pageInner: {
      flex: 1,
      overflow: "visible",
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      paddingBottom: 48,
    },
    mainTitle: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      textAlign: "right",
      marginBottom: 12,
    },
    lead: {
      fontSize: 16,
      lineHeight: 26,
      color: colors.subText,
      textAlign: "right",
      marginBottom: 8,
    },
    section: {
      paddingVertical: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    sectionLast: {
      borderBottomWidth: 0,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      textAlign: "right",
      marginBottom: 10,
    },
    para: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.subText,
      textAlign: "right",
      marginBottom: 10,
    },
    list: {
      flexDirection: "row-reverse",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    bullet: {
      fontSize: 15,
      color: colors.subText,
      marginLeft: 12,
    },
    listItem: {
      flex: 1,
      fontSize: 15,
      lineHeight: 24,
      color: colors.subText,
      textAlign: "right",
    },
    ctaButton: {
      marginTop: 20,
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 999,
      alignItems: "center",
    },
    ctaButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.white,
    },
  });
