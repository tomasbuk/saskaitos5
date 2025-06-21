// FILE: App.js

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { InvoicesProvider } from './src/contexts/InvoicesContext';
import { CashProvider } from './src/contexts/CashContext';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';

// PATAISYMAS: Importuojame kalendoriaus konfigūraciją
import { LocaleConfig } from 'react-native-calendars';

// --- LIETUVIŠKO KALENDORIAUS KONFIGŪRACIJA ---
LocaleConfig.locales['lt'] = {
  monthNames: [
    'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
    'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
  ],
  monthNamesShort: [
    'Saus.', 'Vas.', 'Kov.', 'Bal.', 'Geg.', 'Birž.',
    'Liep.', 'Rugp.', 'Rugs.', 'Spal.', 'Lapk.', 'Gruod.'
  ],
  dayNames: [
    'Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 
    'Ketvirtadienis', 'Penktadienis', 'Šeštadienis'
  ],
  dayNamesShort: ['S', 'P', 'A', 'T', 'K', 'P', 'Š'],
  today: "Šiandien"
};
LocaleConfig.defaultLocale = 'lt';
// --- KONFIGŪRACIJOS PABAIGA ---


LogBox.ignoreLogs(['ViewPropTypes will be removed']);

export default function App() {
  return (
    <SettingsProvider>
      <InvoicesProvider>
        <CashProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CashProvider>
      </InvoicesProvider>
    </SettingsProvider>
  );
}