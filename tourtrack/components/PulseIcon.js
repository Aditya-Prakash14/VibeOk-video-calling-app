import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PulseIcon = ({
  size = 100,
  icon = '🚨',
  pulseColor = '#FF6B6B',
  backgroundColor = 'rgba(255, 107, 107, 0.2)',
  text,
  textStyle,
  style,
  animated = true,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (animated) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      scaleAnimation.start();

      return () => {
        pulseAnimation.stop();
        scaleAnimation.stop();
      };
    }
  }, [animated]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  return (
    <View style={[styles.container, { width: size * 2, height: size * 2 }, style]}>
      {/* Pulse rings */}
      {animated && (
        <>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: pulseColor,
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.pulseRing,
              {
                width: size * 0.8,
                height: size * 0.8,
                borderRadius: (size * 0.8) / 2,
                backgroundColor: pulseColor,
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
        </>
      )}

      {/* Main icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: animated ? scaleAnim : 1 }],
          },
        ]}
      >
        <LinearGradient
          colors={[pulseColor, `${pulseColor}CC`]}
          style={[
            styles.iconGradient,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={[styles.icon, { fontSize: size * 0.4 }]}>{icon}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Text */}
      {text && (
        <Text style={[styles.text, textStyle]}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    textAlign: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default PulseIcon;