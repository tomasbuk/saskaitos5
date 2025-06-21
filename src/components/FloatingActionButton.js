// FILE: src/components/FloatingActionButton.js
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../utils/styles';

export default function FloatingActionButton({ onAddReceived, onAddDraft }) {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            friction: 6,
            useNativeDriver: true,
        }).start();
        setIsOpen(!isOpen);
    };

    const rotation = {
        transform: [{
            rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "45deg"]
            })
        }]
    };

    const getTransformStyle = (value) => ({
        transform: [{
            scale: animation
        }, {
            translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -value]
            })
        }]
    });

    const handleSecondaryPress = (action) => {
        toggleMenu();
        setTimeout(() => {
            action();
        }, 100);
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.secondaryButtonWrapper, getTransformStyle(140)]}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => handleSecondaryPress(onAddDraft)}>
                    <Text style={styles.secondaryButtonText}>Išrašyti</Text>
                </TouchableOpacity>
            </Animated.View>

             <Animated.View style={[styles.secondaryButtonWrapper, getTransformStyle(70)]}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => handleSecondaryPress(onAddReceived)}>
                    <Text style={styles.secondaryButtonText}>Gauta</Text>
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Animated.View style={rotation}>
                    <Text style={styles.menuButtonText}>+</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: spacing.large,
        right: spacing.large,
        alignItems: 'center',
    },
    menuButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    menuButtonText: {
        color: 'white',
        fontSize: 32,
        lineHeight: 34,
    },
    secondaryButtonWrapper: {
        position: 'absolute',
    },
    secondaryButton: {
        minWidth: 90,
        height: 48,
        borderRadius: borderRadius.medium,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        paddingHorizontal: spacing.medium,
    },
    secondaryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});