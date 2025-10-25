import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const GlassCard = ({
  children,
  style,
  onPress,
  gradient = ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)'],
  borderColor = 'rgba(255,255,255,0.3)',
  shadowColor = 'rgba(0,0,0,0.1)',
  haptic = false,
  ...props
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <CardComponent
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        onPress={onPress}
        activeOpacity={0.9}
        {...props}
      >
        <LinearGradient
          colors={gradient}
          style={[
            styles.card,
            {
              borderColor,
              shadowColor,
            },
            style,
          ]}
        >
          {children}
        </LinearGradient>
      </CardComponent>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    backdropFilter: 'blur(20px)',
    // For iOS backdrop-filter effect
    backgroundColor: 'transparent',
  },
});

export default GlassCard;