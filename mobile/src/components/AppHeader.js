import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { apiFetchWithTimeout, getApiBaseUrl, parseJsonResponse } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_QR_KEY = "qrMasterRecentHistory";

const getGreetingByHour = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "בוקר טוב";
  if (hour >= 12 && hour < 17) return "צהריים טובים";
  if (hour >= 17 && hour < 21) return "ערב טוב";
  return "לילה טוב";
};

const formatTime = (value) => {
  try {
    return new Date(value).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export default function AppHeader() {
  const navigation = useNavigation();
  const { user, setUser, logout, getFirstName, checkingAuth } = useAuth();
  const { colors } = useAccessibility();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const currentRoute =
    navigation.getState()?.routes?.[navigation.getState()?.index]?.name;
  const isLogin = currentRoute === "Login";
  const isRegister = currentRoute === "Register";
  const isWelcome = currentRoute === "Welcome";
  const isQrScanner = currentRoute === "QrScanner";

  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [recentQrs, setRecentQrs] = useState([]);
  const [profileForm, setProfileForm] = useState({ firstName: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: getFirstName(user?.fullName),
      });
    }
  }, [user, getFirstName]);

  useEffect(() => {
    if (menuVisible) {
      loadRecentQrs();
    }
  }, [menuVisible]);

  const loadRecentQrs = async () => {
    try {
      const raw = await AsyncStorage.getItem(RECENT_QR_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setRecentQrs(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
    } catch {
      setRecentQrs([]);
    }
  };

  const togglePanel = (panel) => {
    setProfileMessage("");
    setExpandedPanel((p) => (p === panel ? null : panel));
  };

  const handleProfileSave = async () => {
    setProfileMessage("");
    setProfileSaving(true);
    try {
      const response = await apiFetchWithTimeout(
        `${getApiBaseUrl()}/api/auth/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: profileForm.firstName,
          }),
        },
        20000,
      );
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(data?.error || "שמירה נכשלה");
      }
      setUser(data.user);
      setProfileForm({
        firstName: getFirstName(data.user.fullName),
      });
      setProfileMessage("הפרטים נשמרו בהצלחה");
    } catch (err) {
      setProfileMessage(err.message || "שמירה נכשלה");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const firstName = getFirstName(user?.fullName) || "User";
  const userInitial = firstName ? firstName.trim().charAt(0).toUpperCase() : "U";
  const greeting = getGreetingByHour();

  if (checkingAuth) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.actionsRow}>
          {isQrScanner ? (
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={() => navigation.navigate("Welcome")}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, styles.outlineButtonText]}>
                חזרה
              </Text>
            </TouchableOpacity>
          ) : isLogin ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                disabled
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.outlineButtonText]}>
                  התחברות
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.filledButton]}
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.filledButtonText]}>
                  הרשמה
                </Text>
              </TouchableOpacity>
            </>
          ) : isRegister ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.outlineButtonText]}>
                  התחברות
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.filledButton]}
                disabled
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.filledButtonText]}>
                  הרשמה
                </Text>
              </TouchableOpacity>
            </>
          ) : isAuthenticated ? (
            <TouchableOpacity
              style={styles.userTrigger}
              onPress={() => setMenuVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userInitial}</Text>
              </View>
              <View style={styles.userText}>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.userName} numberOfLines={1}>
                  {firstName}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.outlineButtonText]}>
                  התחברות
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.filledButton]}
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.filledButtonText]}>
                  הרשמה
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.brandContainer}
          onPress={() => navigation.navigate("Welcome")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/images/logo-full.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.menuCard}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView style={styles.menuScroll}>
              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={styles.expandBtn}
                  onPress={() => togglePanel("profile")}
                >
                  <Text style={styles.expandBtnText}>עדכון פרטים</Text>
                  <Text style={styles.chevron}>
                    {expandedPanel === "profile" ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
                {expandedPanel === "profile" && (
                  <View style={styles.panelContent}>
                    <Text style={styles.panelLabel}>שם פרטי</Text>
                    <TextInput
                      style={styles.panelInput}
                      value={profileForm.firstName}
                      onChangeText={(t) =>
                        setProfileForm((p) => ({ ...p, firstName: t }))
                      }
                      placeholder="השם שלך"
                      textAlign="right"
                    />
                    <Text style={styles.panelLabel}>אימייל</Text>
                    <TextInput
                      style={[styles.panelInput, styles.panelInputDisabled]}
                      value={user?.email || ""}
                      editable={false}
                      textAlign="right"
                    />
                    <TouchableOpacity
                      style={[styles.saveBtn, profileSaving && styles.saveBtnDisabled]}
                      onPress={handleProfileSave}
                      disabled={profileSaving}
                    >
                      <Text style={styles.saveBtnText}>
                        {profileSaving ? "שומר..." : "שמירת פרטים"}
                      </Text>
                    </TouchableOpacity>
                    {profileMessage ? (
                      <Text
                        style={[
                          styles.profileMsg,
                          profileMessage.includes("נשמרו")
                            ? styles.profileMsgSuccess
                            : styles.profileMsgError,
                        ]}
                      >
                        {profileMessage}
                      </Text>
                    ) : null}
                  </View>
                )}
              </View>

              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={styles.expandBtn}
                  onPress={() => togglePanel("recent")}
                >
                  <Text style={styles.expandBtnText}>QR שמורים</Text>
                  <Text style={styles.chevron}>
                    {expandedPanel === "recent" ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
                {expandedPanel === "recent" && (
                  <View style={styles.panelContent}>
                    {recentQrs.length ? (
                      recentQrs.map((item) => (
                        <View key={item.id} style={styles.recentItem}>
                          <Text style={styles.recentType}>{item.type}</Text>
                          <Text
                            style={styles.recentValue}
                            numberOfLines={1}
                          >
                            {item.value}
                          </Text>
                          <Text style={styles.recentTime}>
                            {formatTime(item.createdAt)}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.emptyText}>עדיין אין QR שמורים</Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutBtnText}>התנתקות</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safeArea: {
    backgroundColor: colors.card,
  },
  container: {
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionsRow: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  outlineButton: {
    borderColor: "#d1d5db",
    backgroundColor: colors.white,
  },
  filledButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  outlineButtonText: {
    color: colors.subText,
  },
  filledButtonText: {
    color: colors.white,
  },
  userTrigger: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: colors.card,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0a9396",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  userText: {
    alignItems: "flex-end",
  },
  greeting: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    maxWidth: 100,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandLogo: {
    height: 32,
    width: 140,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    width: 280,
    maxHeight: 400,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuScroll: {
    maxHeight: 380,
  },
  menuSection: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f5",
  },
  expandBtn: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5ecef",
    backgroundColor: colors.card,
  },
  expandBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  chevron: {
    fontSize: 12,
    color: colors.subText,
  },
  panelContent: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#edf2f5",
    backgroundColor: colors.card,
  },
  panelLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  panelInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  panelInputDisabled: {
    backgroundColor: colors.toggleBg,
    color: colors.subText,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  profileMsg: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  profileMsgSuccess: {
    color: colors.primary,
    fontWeight: "600",
  },
  profileMsgError: {
    color: colors.error,
  },
  recentItem: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#edf2f5",
    backgroundColor: colors.card,
    marginBottom: 6,
  },
  recentType: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    textAlign: "right",
  },
  recentValue: {
    fontSize: 12,
    color: colors.text,
    textAlign: "right",
    marginTop: 2,
  },
  recentTime: {
    fontSize: 11,
    color: colors.subText,
    textAlign: "right",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: colors.subText,
    textAlign: "center",
  },
  logoutBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.error,
  },
});
