import React, { useEffect, useState, useRef } from 'react';
/* 
npx expo prebuild
cd android
./gradlew assembleRelease
adb install android/app/build/outputs/apk/release/app-release.apk
*/

import MainScreen from './MainScreen';
import SettingScreen from './SettingScreen';
import ComparisonScreen from './ComparisonScreen';


import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, SafeAreaView } from 'react-native';
const Tab = createBottomTabNavigator();

import { useTheme } from '../js/ThemeContext'
import { useLanguage } from '../js/LanguageContext';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

const w = Dimensions.get("window").width;
const s = w > 500 ? w * 0.5 : w * 0.035;
export default function App() {
    const { darkMode, toggleDarkMode } = useTheme();
    const { lang, setLang } = useLanguage();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? "black" : 'white' }}>
            <NavigationContainer>
                <Tab.Navigator screenOptions={{
                    tabBarLabelPosition: "below-icon",
                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarActiveTintColor: darkMode ? '#FFFFFF' : '#000000',
                    tabBarInactiveTintColor: darkMode ? '#8E8E93' : '#A1A1A1',
                    tabBarStyle: {
                        backgroundColor: darkMode ? '#121212' : '#FFFFFF',
                    },
                }}>
                    <Tab.Screen name="Home" component={MainScreen}
                        options={{
                            tabBarLabel: lang == 'EN' ? 'Home' : '主頁',
                            tabBarLabelStyle: {
                                fontSize: s * (w > 1000 ? 0.04 : 1),
                            },
                            tabBarIcon: ({ color }) => (
                                <FontAwesomeIcon
                                    name="home"
                                    size={w * (w > 1100 ? 0.025 : 0.08)}
                                    color={color}
                                />
                            ),
                        }}
                    />
                    <Tab.Screen name="Compare" component={ComparisonScreen}
                        options={{
                            tabBarLabel: lang == 'EN' ? 'Comparison' : '對比',
                            tabBarLabelStyle: {
                                fontSize: s * (w > 1000 ? 0.04 : 1),
                            },
                            tabBarIcon: ({ color }) => (
                                <FontAwesomeIcon
                                    name="balance-scale"
                                    size={w * (w > 1100 ? 0.02 : 0.06)}
                                    color={color}
                                />
                            ),
                        }}
                    />
                    <Tab.Screen name="Setting" component={SettingScreen}
                        options={{
                            tabBarLabel: lang == 'EN' ? 'Setting' : '設定',
                            tabBarLabelStyle: {
                                fontSize: s * (w > 1000 ? 0.04 : 1),
                            },
                            tabBarIcon: ({ color }) => (
                                <AntDesign
                                    name="setting"
                                    size={w * (w > 1100 ? 0.02 : 0.07)}
                                    color={color}
                                />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}


