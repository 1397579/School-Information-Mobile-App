import React, { useEffect, useState, useRef } from 'react';
/* 
npx expo prebuild
cd android
./gradlew assembleRelease
adb install android/app/build/outputs/apk/release/app-release.apk
*/

import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Animated,
  ScrollView,
  Linking,
  Dimensions,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Card, Title, Paragraph } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { useTheme } from '../js/ThemeContext';
import { useLanguage } from '../js/LanguageContext';
import { useFavorites } from '../js/FavoritesContext';
import { useSchool } from '../js/SchoolContext';
import { useCompare } from '../js/CompareContext';

export default function MainScreen() {
  const { schools, setSchools, filtered, setFiltered } = useSchool();
  const { compare1, setCompare1, compare2, setCompare2 } = useCompare();

  const [search, setSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lang, setLang } = useLanguage();
  const { darkMode, toggleDarkMode } = useTheme();


  const { favorites, setFavorites } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);

  // ===== Load school data =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.json'
        );
        const data = await res.json();
        setSchools(data);
        setFiltered(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ===== Load Favorites from AsyncStorage on mount =====
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('@favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const loadLang = async () => {
      try {
        const l = await AsyncStorage.getItem('Language');
        if (l)
          setLang(l);
      } catch (err) {
      }
    };
    loadLang();
  }, []);

  useEffect(() => {
    const saveL = async () => {
      try {
        await AsyncStorage.setItem('Language', lang);
        console.log(lang);
      } catch (err) {
        console.log(err);
      }
    };
    saveL();
  }, [lang]);


  // ===== Save Favorites to AsyncStorage whenever changes =====
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
      } catch (err) {
        console.error('Error saving favorites:', err);
      }
    };
    saveFavorites();
  }, [favorites]);

  // ===== Search filter =====
  useEffect(() => {
    const results = schools.filter((s) => {
      return s['ENGLISH NAME']?.toLowerCase().includes(search.toLowerCase())||s['中文名稱']?.includes(search);
    });
    setFiltered(results);
  }, [search, lang, schools]);

  // ===== Theme Colors =====
  const toggleTheme = () => toggleDarkMode();

  const themeColors = {
    background: darkMode ? '#121212' : '#f5f5f5',
    card: darkMode ? '#1e1e1e' : '#ffffff',
    text: darkMode ? '#e4e4e4' : '#333333',
    subText: darkMode ? '#bdbdbd' : '#555555',
    primary: '#0066cc',
    inputBg: darkMode ? '#2a2a2a' : '#ffffff',
    heart: 'rgb(251, 33, 211)',
    link: darkMode ? '#81d4fa' : '#0066cc'
  };

  const scaleValue = useRef(new Animated.Value(1)).current;

  // ===== Favorites Logic =====
  const toggleFavorite = (school) => {
    if (favorites.find((f) => f['SCHOOL NO.'] === school['SCHOOL NO.'])) {
      setFavorites(favorites.filter((f) => f['SCHOOL NO.'] !== school['SCHOOL NO.']));
    } else {
      setFavorites([...favorites, school]);
    }
  };

  const isFavorite = (school) =>
    favorites.some((f) => f['SCHOOL NO.'] === school['SCHOOL NO.']);

  // ===== Loading Indicator =====
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={{ color: themeColors.text }}>{lang === 'EN' && 'Loading school data...'}{lang != 'EN' && '正在載入學校數據…'}</Text>
      </View>
    );
  }

  // ===== Detail Page =====
  if (selectedSchool) {
    const name = lang === 'EN' ? selectedSchool['ENGLISH NAME'] : selectedSchool['中文名稱'];
    const address = lang === 'EN' ? selectedSchool['ENGLISH ADDRESS'] : selectedSchool['中文地址'];
    const category = lang === 'EN' ? selectedSchool['ENGLISH CATEGORY'] : selectedSchool['中文類別'];
    const finance = lang === 'EN' ? selectedSchool['FINANCE TYPE'] : selectedSchool['資助種類'];
    const religion = lang === 'EN' ? selectedSchool['RELIGION'] : selectedSchool['宗教'];
    const gender = lang === 'EN' ? selectedSchool['STUDENTS GENDER'] : selectedSchool['就讀學生性別'];
    const session = lang === 'EN' ? selectedSchool['SESSION'] : selectedSchool['學校授課時間'];
    const website = selectedSchool['WEBSITE'];
    const tel = selectedSchool['TELEPHONE'];
    const fax = selectedSchool['FAX NUMBER'];

    return (
      <PaperProvider>
        <SafeAreaView style={[styles.detailContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.topBar}>
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[styles.backButton]}
                onPress={() => setSelectedSchool(null)}
              >
                <Text style={[styles.backButtonText, { color: themeColors.text }]}>{'←'}</Text>
              </TouchableOpacity>
              <View style={styles.langSwitchContainer}>



                <TouchableOpacity
                  onPress={() => setLang('EN')}
                  style={[
                    styles.langButton,
                    { backgroundColor: lang === 'EN' ? themeColors.primary : themeColors.card },
                  ]}
                >
                  <Text style={{ color: lang === 'EN' ? '#fff' : themeColors.text, fontSize: 12 }}>
                    EN
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLang('ZH')}
                  style={[
                    styles.langButton,
                    { backgroundColor: lang === 'ZH' ? themeColors.primary : themeColors.card },
                  ]}
                >
                  <Text style={{ color: lang === 'ZH' ? '#fff' : themeColors.text, fontSize: 12 }}>
                    中文
                  </Text>
                </TouchableOpacity>

                <View style={{ marginLeft: 10, justifyContent: "center", alignItems: "center" }}>
                  <View>
                    <Switch value={darkMode} onValueChange={toggleTheme}
                      thumbColor={darkMode ? 'rgb(131, 251, 255)' : '#f4f3f4'}
                      trackColor={{
                        false: 'rgb(255, 255, 255)',
                        true: 'rgba(77, 255, 0, 0.6)'
                      }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 8, color: themeColors.text }}>{lang == 'EN' ? 'Dark Mode' : '深色模式'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <ScrollView>
            <Card style={[styles.card, { backgroundColor: themeColors.card }]}>
              <Card.Content>
                <Title style={{ color: themeColors.text }}>{name}</Title>
                <Paragraph style={{ color: themeColors.text }}>
                  {lang === 'EN' ? 'Category' : '學校類別'}: {category}
                </Paragraph>
                <Paragraph style={{ color: themeColors.text }}>📍 {address}</Paragraph>
                <Paragraph style={{ color: themeColors.text }}>
                  {lang === 'EN' ? 'Telephone' : '電話'}: {tel}
                </Paragraph>
                <Paragraph style={{ color: themeColors.text }}>
                  {lang === 'EN' ? 'Fax' : '傳真號碼'}: {fax}
                </Paragraph>
                <Paragraph style={{ color: themeColors.text }}>
                  {lang === 'EN' ? 'Finance Type' : '資助種類'}: {finance}
                </Paragraph>
                <Paragraph style={{ color: themeColors.text }}>
                  {lang === 'EN' ? 'Religion' : '宗教'}: {religion}
                </Paragraph>
                <Paragraph style={{ color: themeColors.text }}>
                  {lang === 'EN' ? 'Gender' : '就讀學生性別'}: {gender}
                </Paragraph>
                <Paragraph style={{ color: themeColors.text }}>
                  {lang === 'EN' ? 'Session' : '授課時間'}: {session}
                </Paragraph>
                {website !== 'N.A.' && (
                  <Paragraph style={{ color: darkMode ? "lightblue" : themeColors.primary }}>
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          const supported = await Linking.canOpenURL(website);
                          if (supported) {
                            await Linking.openURL(website);
                          } else {
                            console.log("不支援的網址類型: " + website);
                          }
                        } catch (e) { console.log(e) }
                      }}
                      activeOpacity={0.6} // 點擊時的透明度（0-1 之間）
                    >
                      <Text style={{ color: themeColors.link }}>
                        🌐 {website}
                      </Text>
                    </TouchableOpacity>
                  </Paragraph>
                )}

              </Card.Content>
            </Card>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: isFavorite(selectedSchool)
                  ? '#cc3300'
                  : themeColors.primary,
              },
            ]}
            onPress={() => {

              if (!selectedSchool._heartAnim) {
                selectedSchool._heartAnim = new Animated.Value(1);
              }

              // 2. 定義並執行「放大再縮小」的動畫
              selectedSchool._heartAnim.setValue(1); // 每次點擊先重設為 1
              Animated.sequence([
                Animated.timing(selectedSchool._heartAnim, {
                  toValue: isFavorite(selectedSchool) ? 1.3 : 2.0,       // 放大到 2 倍（效果最明顯）
                  duration: 150,
                  useNativeDriver: true,
                }),
                Animated.spring(selectedSchool._heartAnim, {
                  toValue: 1.0,       // 彈回 1 倍
                  friction: 3,        // 增加彈跳感
                  useNativeDriver: true,
                }),
              ]).start();


              toggleFavorite(selectedSchool);
            }}
          >
            <Animated.Text style={{ color: isFavorite(selectedSchool) ? 'rgb(255,192,203)' : 'white', transform: [{ scale: selectedSchool._heartAnim || 1 }] }}>
              {isFavorite(selectedSchool)
                ? lang === 'EN'
                  ? '♥'
                  : '♥'
                : lang === 'EN'
                  ? '♡'
                  : '♡'}
            </Animated.Text>
            <Text style={{ color: 'white' }}>
              {isFavorite(selectedSchool)
                ? lang === 'EN'
                  ? ' Remove from Favorites'
                  : ' 從收藏移除'
                : lang === 'EN'
                  ? ' Add to Favorites'
                  : ' 加入收藏'}
            </Text>
          </TouchableOpacity>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedSchool['LATITUDE'],
              longitude: selectedSchool['LONGITUDE'],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedSchool['LATITUDE'],
                longitude: selectedSchool['LONGITUDE'],
              }}
              title={name}
              description={address}
            />
          </MapView>
        </SafeAreaView>
      </PaperProvider>
    );
  }

  // ===== Main List Page =====
  return (
    <PaperProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.topBar}>
          <Text style={[styles.header, styles.shadow01, {
            color: themeColors.text, fontSize: Dimensions.get("window").width * (lang === 'EN' ? 0.032 : 0.05)
          }]}>
            🎓 {lang === 'EN' ? 'Hong Kong School Info' : '香港學校資訊'}
          </Text>
          <View style={styles.switchContainer}>
            <View style={styles.langSwitchContainer}>
              <TouchableOpacity
                onPress={() => setLang('EN')}
                style={[
                  styles.langButton,
                  { backgroundColor: lang === 'EN' ? themeColors.primary : themeColors.card },
                ]}
              >
                <Text style={{ color: lang === 'EN' ? '#fff' : themeColors.text, fontSize: 12 }}>
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLang('ZH')}
                style={[
                  styles.langButton,
                  { backgroundColor: lang === 'ZH' ? themeColors.primary : themeColors.card },
                ]}
              >
                <Text style={{ color: lang === 'ZH' ? '#fff' : themeColors.text, fontSize: 12 }}>
                  中文
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 0, justifyContent: "center", alignItems: "center" }}>
              <View>
                <Switch value={darkMode} onValueChange={toggleTheme} />
              </View>
              <View>
                <Text style={{ fontSize: 8, color: themeColors.text }}>{lang == 'EN' ? 'Dark Mode' : '深色模式'}</Text>
              </View>
            </View>
          </View>
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.text }]}
          placeholderTextColor={themeColors.subText}
          placeholder={
            lang === 'EN'
              ? 'Search by name (e.g. New Territories)...'
              : '搜尋學校名稱（例如 慈幼學校）...'
          }
          value={search}
          onChangeText={setSearch}
        />

        {/* Favorites Section */}
        <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
            <Text style={{ color: themeColors.link, fontWeight: 'bold' }}>
              <Text style={{ color: themeColors.heart }}>♥</Text>{lang === 'EN' ? ' Favorites' : '我的收藏'} ({favorites.length})
              {showFavorites ? ' ▼' : ' ▶'}
            </Text>
          </TouchableOpacity>

          {showFavorites && favorites.length > 0 && (
            <View style={{ marginTop: 8 }}>
              {favorites.map((item) => {
                const name = lang === 'EN' ? item['ENGLISH NAME'] : item['中文名稱'];
                const district = lang === 'EN' ? item['DISTRICT'] : item['分區'];
                const category = lang === 'EN' ? item['ENGLISH CATEGORY'] : item['中文類別'];
                return (
                  <View key={item['SCHOOL NO.']} style={styles.favoriteCard}>
                    <TouchableOpacity onPress={() => setSelectedSchool(item)}>
                      <Text style={{ color: themeColors.text, fontWeight: '600' }}>{name}</Text>
                      <Text style={{ color: themeColors.subText }}>🏷️ {category}</Text>
                      <Text style={{ color: themeColors.subText }}>📍 {district}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          {showFavorites && favorites.length === 0 && (
            <Text style={{ color: themeColors.subText, marginTop: 5 }}>
              {lang === 'EN' ? 'No favorites yet.' : '尚未有收藏。'}
            </Text>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item['SCHOOL NO.'].toString()}
          renderItem={({ item }) => {
            const name = lang === 'EN' ? item['ENGLISH NAME'] : item['中文名稱'];
            const district = lang === 'EN' ? item['DISTRICT'] : item['分區'];
            const category = lang === 'EN' ? item['ENGLISH CATEGORY'] : item['中文類別'];

            if (!item._animatedScale) {
              item._animatedScale = new Animated.Value(1);
            }

            const runHeartAnimation = () => {
              // 確保從 1 開始，避免連點時卡住
              item._animatedScale.setValue(1);

              Animated.sequence([
                Animated.timing(item._animatedScale, {
                  toValue: isFavorite(item) ? 1.3 : 2.0,       // 放大到 2 倍
                  duration: 150,
                  useNativeDriver: true,
                }),
                Animated.spring(item._animatedScale, {
                  toValue: 1.0,       // 縮回到 1 倍
                  friction: 3,        // 越小越彈
                  tension: 40,
                  useNativeDriver: true,
                }),
              ]).start();
            };

            return (
              <TouchableOpacity onPress={() => setSelectedSchool(item)}>
                <Card style={[styles.card, { backgroundColor: themeColors.card }]}>
                  <Card.Content>
                    <Title style={{ color: themeColors.text }}>{name}</Title>
                    <Paragraph style={{ color: themeColors.subText }}>🏷️ {category}</Paragraph>
                    <Paragraph style={{ color: themeColors.subText }}>📍 {district}</Paragraph>
                    <View style={{ justifyContent: "center", flexDirection: "row", width: "100%" }}>
                      <View style={{ justifyContent: "flex-start", width: "50%" }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
                          runHeartAnimation();
                          toggleFavorite(item);
                        }}>
                          <Animated.Text style={{
                            color: isFavorite(item) ? themeColors.heart : 'grey',
                            fontSize: 24,
                            transform: [{ scale: item._animatedScale }],
                            marginRight: 10
                          }}>
                            {isFavorite(item) ? '♥' : '♡'}
                          </Animated.Text>

                          <Text style={{ color: themeColors.link }}>
                            {isFavorite(item)
                              ? lang === 'EN'
                                ? 'Remove Favorite'
                                : '移除收藏'
                              : lang === 'EN'
                                ? 'Add to Favorite'
                                : '加入收藏'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ alignItems: "flex-end", width: "50%", justifyContent: "center" }}>
                        <TouchableOpacity
                          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                          onPress={() => {
                            if (compare1 == 'notSelect' && compare2 != item['SCHOOL NO.']) {
                              setCompare1(item['SCHOOL NO.'])
                            } else if (compare2 == 'notSelect' && compare1 != item['SCHOOL NO.']) {
                              setCompare2(item['SCHOOL NO.'])
                            }
                            else if (compare1 == item['SCHOOL NO.']) {
                              setCompare1('notSelect')
                            } else if (compare2 == item['SCHOOL NO.']) {
                              setCompare2('notSelect')
                            }
                            else {
                              Alert.alert(
                                lang === 'EN' ? "Comparison Limit" : "比較名額已滿",
                                lang === 'EN'
                                  ? "You can only compare 2 schools. Which one would you like to replace for comparison?"
                                  : "您只能同時比較兩所學校。請問要替換哪一所進行比較？",
                                [
                                  {
                                    text: `${schools.find(s => s['SCHOOL NO.'] === compare1)?.[lang == 'EN' ? 'ENGLISH NAME' : '中文名稱'] || ''}`,
                                    onPress: () => setCompare1(item['SCHOOL NO.']),
                                  },
                                  {
                                    text: `${schools.find(s => s['SCHOOL NO.'] === compare2)?.[lang == 'EN' ? 'ENGLISH NAME' : '中文名稱'] || ''}`,
                                    onPress: () => setCompare2(item['SCHOOL NO.']),
                                  },
                                  {
                                    text: lang === 'EN' ? "Cancel" : "取消",
                                    style: "cancel",
                                  },
                                ],
                                { cancelable: true }
                              );
                            }
                          }}>
                          <View>
                            <Text style={{ color: themeColors.link }}>
                              {lang === 'EN'
                                ? 'Compare'
                                : '對比'
                              }
                            </Text>
                          </View>
                          <View style={{ marginLeft: 5 }}>
                            <FontAwesomeIcon
                              name="balance-scale"
                              size={Dimensions.get("window").width * 0.06}
                              color={compare1 == item['SCHOOL NO.'] || compare2 == item['SCHOOL NO.'] ? "plum" : "lightblue"}
                            />
                          </View>

                        </TouchableOpacity>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </PaperProvider >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold' },
  input: { marginHorizontal: 20, marginBottom: 10, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10 },
  card: { marginHorizontal: 15, marginVertical: 5, elevation: 2 },
  map: { width: '100%', height: 250, marginTop: 15 },
  detailContainer: { flex: 1, paddingTop: 40 },
  favoriteButton: { marginHorizontal: 15, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10, flexDirection: "row" },
  backButton: { margin: 5, padding: 5, borderRadius: 10, alignItems: 'center' },
  backButtonText: { fontWeight: 'bold', fontSize: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  langSwitchContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  langButton: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginHorizontal: 2, borderWidth: 1, borderColor: '#ccc' },
  favoriteCard: {
    backgroundColor: '#3333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow01: {
    shadowColor: 'rgb(20, 20, 100)',
    shadowOffset: { width: Dimensions.get("window").height * 0.005, height: Dimensions.get("window").height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: Dimensions.get("window").width * 0.002,
  },
  shadow02: {
    shadowColor: 'rgb(20, 20, 100)',
    shadowOffset: { width: Dimensions.get("window").height * 0.005, height: Dimensions.get("window").height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: Dimensions.get("window").width * 0.002,
  },
});
