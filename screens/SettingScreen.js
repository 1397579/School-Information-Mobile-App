import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../js/ThemeContext';
import { useLanguage } from '../js/LanguageContext';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const w = Dimensions.get("window").width;

export default function SettingsScreen() {
  const { lang, setLang } = useLanguage();
  const { darkMode, toggleDarkMode } = useTheme();

  const toggleLanguage = () => {
    setLang(lang === 'EN' ? 'ZH' : 'EN');
  };

  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const backgroundColor = darkMode ? '#121212' : '#F5F5F5';
  const rowColor = darkMode ? '#1E1E1E' : '#FFFFFF';
  const accentColor = darkMode ? '#FFD700' : '#8E8E93';

  return (
    <View style={[styles.container, { backgroundColor }]}>

      {/* Theme Toggle Row */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.row, { backgroundColor: rowColor }]}
        onPress={toggleDarkMode}
      >
        <View style={styles.iconlabel}>
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={w * 0.1}
            color={textColor}
            style={{ marginRight: w * 0.01 }}
          />
          <Text style={[styles.label, { color: textColor }]}>{lang == 'EN' ? 'Theme' : '主題'}</Text>
        </View>
        <Text style={[styles.valueText, { color: accentColor }]}>
          {darkMode ?
            lang == 'EN' ? 'Dark Mode' : '深色模式' :
            lang == 'EN' ? 'Light Mode' : '淺色模式'}
        </Text>
      </TouchableOpacity>

      {/* Language Toggle Row */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.row, { backgroundColor: rowColor }]}
        onPress={toggleLanguage}
      >
        <View style={styles.iconlabel}>
          <MaterialIcons
            name="language"
            size={w * 0.1}
            color={textColor}
            style={{ marginRight: w * 0.01 }}
          />
          <Text style={[styles.label, { color: textColor }]}>{lang == 'EN' ? 'Language' : '語言'}</Text>
        </View>
        <Text style={[styles.valueText, { color: '#8E8E93' }]}>{lang == 'EN' ? 'English' : '中文'}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40, // Increased for better spacing from the top
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,   // Better touch area
    paddingHorizontal: 20, // Standard side alignment
    marginBottom: 1,       // Visual separation
    // Added subtle shadow for Light Mode
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 2,
  },
  label: {
    fontSize: w * 0.06,          // Standard iOS/Android setting size
    fontWeight: '500',     // Medium weight for readability
    letterSpacing: -0.3,   // Modern typography touch
  },
  valueText: {
    fontSize: 15,
    fontWeight: '400',
  },
  iconlabel: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});