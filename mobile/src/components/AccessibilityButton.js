import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AccessibilityMenu from "./AccessibilityMenu";

export default function AccessibilityButton() {
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={[
          styles.wrapper,
          { bottom: Math.max(18, insets.bottom) },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.85}
          accessibilityLabel="פתח תפריט נגישות"
        >
          <Image
            source={require("../../assets/images/accessibility.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <AccessibilityMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 18,
    zIndex: 9999,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0a9396",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0a9396",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 12,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
  },
});
