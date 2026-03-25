import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 18;
const THUMB_MARGIN = 5;

export default function ThemeToggle({ value, onValueChange }) {
  const slideAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: value ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [value, slideAnim]);

  const thumbX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_MARGIN, TRACK_WIDTH - THUMB_MARGIN - THUMB_SIZE],
  });

  const trackColor = value ? "#2a2a2a" : "#00a6ff";

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onValueChange(!value)}
      style={styles.container}
    >
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        {/* Stars - visible in dark mode */}
        {value && (
          <View style={styles.stars}>
            <View style={[styles.star, { left: 28, top: 5 }]} />
            <View style={[styles.star, { left: 24, top: 12 }]} />
            <View style={[styles.star, { left: 32, top: 9 }]} />
          </View>
        )}

        {/* Cloud - visible in light mode (simplified cloud shape) */}
        {!value && (
          <Svg width={24} height={16} style={styles.cloud} viewBox="0 0 36 24">
            <Path
              fill="#fff"
              d="M28 14c0-2.2-1.8-4-4-4-1.2 0-2.2.5-2.9 1.3-1.5-.8-3.3-.3-4.1 1.2-1.8.2-3.2 1.7-3.2 3.5 0 2 1.6 3.6 3.6 3.6h16.8c2 0 3.6-1.6 3.6-3.6 0-1.8-1.4-3.3-3.2-3.5-.8-1.5-2.6-2-4.1-1.2-.7-.8-1.7-1.3-2.9-1.3-2.2 0-4 1.8-4 4z"
            />
          </Svg>
        )}

        {/* Sliding thumb */}
        <Animated.View
          style={[
            styles.thumbWrapper,
            {
              transform: [{ translateX: thumbX }],
            },
          ]}
        >
          <View
            style={[
              styles.thumb,
              value ? styles.thumbMoon : styles.thumbSun,
            ]}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  thumbWrapper: {
    position: "absolute",
    left: 0,
    bottom: THUMB_MARGIN,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 9,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 9,
  },
  thumbMoon: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  thumbSun: {
    backgroundColor: "#ffcf48",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  stars: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  cloud: {
    position: "absolute",
    bottom: -6,
    left: -4,
    opacity: 0.9,
  },
});
