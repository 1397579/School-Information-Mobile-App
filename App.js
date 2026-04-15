import React, { useEffect, useState, useRef } from 'react';
/* 
npm install
npm start
npx expo prebuild
cd android
./gradlew assembleRelease
adb install android/app/build/outputs/apk/release/app-release.apk
*/

import { } from 'react-native';

import { ThemeProvider } from './js/ThemeContext';
import { LanguageProvider } from './js/LanguageContext';
import { FavoritesProvider } from './js/FavoritesContext';
import { SchoolProvider } from './js/SchoolContext';
import { CompareProvider } from './js/CompareContext';

import NavigationScreen from './screens/NavigationScreen';
export default function App() {

  return (
    <CompareProvider>
    <SchoolProvider>
      <FavoritesProvider>
        <LanguageProvider>
          <ThemeProvider>
            <NavigationScreen />
          </ThemeProvider>
        </LanguageProvider>
      </FavoritesProvider>
    </SchoolProvider>
    </CompareProvider>
  )
}

