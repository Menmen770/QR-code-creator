import React from "react";
import { StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import AccessibilityButton from "./AccessibilityButton";

export default function ScreenWithAccessibility({ children, style }) {
  const route = useRoute();
  const hideAccessibility = route?.name === "QrScanner";

  return (
    <View style={[styles.container, style]}>
      {children}
      {!hideAccessibility && <AccessibilityButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
