// FILE: src/components/CustomHeader.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Importuojame "kabliuką" (hook), kuris suteiks saugios zonos dydžius
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../utils/styles'; 

export default function CustomHeader(props) {
  // Gauname saugios zonos dydžius. `insets.top` bus atstumas nuo ekrano viršaus.
  const insets = useSafeAreaInsets();
  const title = props.options.title || props.route.name;

  return (
    // Nebenaudojame SafeAreaView komponento, o pritaikome padding'ą dinamiškai
    <View style={[styles.container, { paddingTop: insets.top + spacing.small, paddingBottom: spacing.medium }]}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});