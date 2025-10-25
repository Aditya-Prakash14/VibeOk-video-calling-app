import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

const FloatingElements = ({ children, style }) => {
  const floating1 = React.useRef(new Animated.Value(0)).current;
  const floating2 = React.useRef(new Animated.Value(0)).current;
  const floating3 = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const createFloatingAnimation = (animatedValue, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000 + delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000 + delay,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createFloatingAnimation(floating1, 0);
    const anim2 = createFloatingAnimation(floating2, 1000);
    const anim3 = createFloatingAnimation(floating3, 2000);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const translateY1 = floating1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const translateY2 = floating2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const translateY3 = floating3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Floating elements */}
      <Animated.View
        style={[
          styles.floatingElement,
          styles.element1,
          { transform: [{ translateY: translateY1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingElement,
          styles.element2,
          { transform: [{ translateY: translateY2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingElement,
          styles.element3,
          { transform: [{ translateY: translateY3 }] },
        ]}
      />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  element1: {
    width: 100,
    height: 100,
    backgroundColor: '#007AFF',
    top: '10%',
    right: '10%',
  },
  element2: {
    width: 60,
    height: 60,
    backgroundColor: '#FF6B6B',
    top: '60%',
    left: '5%',
  },
  element3: {
    width: 80,
    height: 80,
    backgroundColor: '#4ECDC4',
    top: '30%',
    left: '70%',
  },
});

export default FloatingElements;