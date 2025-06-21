// FILE: src/components/AnimatedWarningIcon.js
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export default function AnimatedWarningIcon() {
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.3,
                    duration: 600,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, [scaleValue]);

    const animatedStyle = {
        transform: [{ scale: scaleValue }],
    };

    return (
        <Animated.Text style={[styles.icon, animatedStyle]}>
            ⚠️
        </Animated.Text>
    );
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 16,
        marginLeft: 8,
    },
});