import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { AccessibilityProvider, useAccessibility } from "./src/context/AccessibilityContext";
import AppHeader from "./src/components/AppHeader";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import QrGeneratorScreen from "./src/screens/QrGeneratorScreen";
import QrScannerScreen from "./src/screens/QrScannerScreen";
import LearnQrScreen from "./src/screens/LearnQrScreen";

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

const initialNavState = {
  routes: [{ name: "Welcome" }],
  index: 0,
};

function AppContent() {
  const { colors, darkMode } = useAccessibility();
  return (
    <>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader />
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="QrScanner" component={QrScannerScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="QrGenerator" component={QrGeneratorScreen} />
          <Stack.Screen name="LearnQr" component={LearnQrScreen} />
        </Stack.Navigator>
      </View>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AccessibilityProvider>
          <NavigationContainer
            ref={navigationRef}
            initialState={initialNavState}
          >
            <AppContent />
          </NavigationContainer>
        </AccessibilityProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
