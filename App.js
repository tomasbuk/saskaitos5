// FILE: App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { InvoicesProvider } from './src/contexts/InvoicesContext';
import { CashProvider } from './src/contexts/CashContext'; // Importuojame
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';

// ... (LocaleConfig kodas lieka nepakitęs)

LogBox.ignoreLogs(['ViewPropTypes will be removed']);

export default function App() {
  return (
    <SettingsProvider>
      <InvoicesProvider>
        {/* PATAISYMAS: Pridedame CashProvider */}
        <CashProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CashProvider>
      </InvoicesProvider>
    </SettingsProvider>
  );
}