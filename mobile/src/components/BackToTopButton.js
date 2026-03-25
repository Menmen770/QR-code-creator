import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export const SCROLL_THRESHOLD = 50;

const ANIM_DURATION = 300;

export default function BackToTopButton({ visible, scrollRef }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 16,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, translateY]);

  const scrollToTop = () => {
    scrollRef?.current?.scrollTo?.({ y: 0, animated: true });
  };

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.wrapper,
        { bottom: Math.max(18, insets.bottom) },
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={scrollToTop}
        activeOpacity={0.85}
        accessibilityLabel="בחזרה ללמעלה"
      >
        <Svg width={14} height={18} viewBox="0 0 384 512" style={styles.icon}>
          <Path
            fill="#fff"
            d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
          />
        </Svg>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 18,
    zIndex: 1100,
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
    elevation: 8,
  },
  icon: {},
});
