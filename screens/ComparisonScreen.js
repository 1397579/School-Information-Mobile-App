import React, { useEffect, useState, useRef } from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { useSchool } from '../js/SchoolContext';
import { useCompare } from '../js/CompareContext';
import { useLanguage } from '../js/LanguageContext';
import { useTheme } from '../js/ThemeContext';
const w = Dimensions.get("window").width;
const h = Dimensions.get("window").height;

export default function MainScreen({ navigation }) {
  const { schools, setSchools, filtered, setFiltered } = useSchool();
  const { compare1, setCompare1, compare2, setCompare2 } = useCompare();
  const { lang, setLang } = useLanguage();
  const { darkMode, toggleDarkMode } = useTheme();
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
  if (!(compare1 == 'notSelect' || compare2 == 'notSelect')) {
    const data = [
      {
        "SCHOOL NO.": 'SCHOOL NO.',
        "ENGLISH CATEGORY": "CATEGORY",
        "中文類別": "類別",
        "ENGLISH NAME": "NAME",
        "中文名稱": "名稱",
        "ENGLISH ADDRESS": "ADDRESS",
        "中文地址": "中文地址",
        "LONGITUDE": 'LONGITUDE',
        "經度": '經度',
        "LATITUDE": 'LATITUDE',
        "緯度": "緯度",
        "EASTING": "EASTING",
        "坐標東": "坐標東",
        "NORTHING": "NORTHING",
        "坐標北": "坐標北",
        "STUDENTS GENDER": "STUDENTS GENDER",
        "就讀學生性別": "就讀學生性別",
        "SESSION": "SESSION",
        "學校授課時間": "授課時間",
        "DISTRICT": "DISTRICT",
        "分區": "分區",
        "FINANCE TYPE": "FINANCE TYPE",
        "資助種類": "資助種類",
        "SCHOOL LEVEL": "SCHOOL LEVEL",
        "學校類型": "學校類型",
        "TELEPHONE": "TELEPHONE",
        "聯絡電話": "電話",
        "FAX NUMBER": "FAX NUMBER",
        "傳真號碼": "傳真號碼",
        "WEBSITE": "WEBSITE",
        "網頁": "網頁",
        "RELIGION": "RELIGION",
        "宗教": "宗教"
      },
      ...schools.filter((s) => {
        const schoolNo = s['SCHOOL NO.']?.toString() || '';
        return schoolNo.includes(compare1) || schoolNo.includes(compare2);
      })
    ];
    let keysToShow = [];
    if (lang == 'EN') {
      keysToShow = ['ENGLISH NAME', 'ENGLISH CATEGORY', 'ENGLISH ADDRESS', 'TELEPHONE', 'FAX NUMBER', 'WEBSITE', 'FINANCE TYPE', 'RELIGION', 'STUDENTS GENDER', 'SESSION', 'DISTRICT', 'LONGITUDE'];
    } else {
      keysToShow = ['中文名稱', '中文類別', '中文地址', '聯絡電話', '傳真號碼', '網頁', '資助種類', '宗教', '就讀學生性別', '學校授課時間', '分區', '經度'];
    }
    console.log(data);
    return (
      <ScrollView style={{ backgroundColor: themeColors.background }}>
        <View style={{ height: Platform.OS == 'android' ? h * 0.05 : 0 }}></View>
        {keysToShow.map((keyName) => (
          <View
            key={keyName}
            style={[{ flexDirection: "row", minWidth: "100%", height: "auto", justifyContent: "space-around" }, styles.shadow01]}
          >
            {(keyName != 'LONGITUDE' && keyName != '經度') && data.map((item, index) => (
              <View key={index} style={{ margin: w * 0.008, padding: w * 0.008, borderRadius: w * 0.02, backgroundColor: "#0902", width: index == 0 ? w / 4.3 : w / 2.8 }}>
                {(!item[keyName].includes('http')) && (<Text style={{ color: themeColors.subText }}>{item[keyName]}</Text>)}
                {(item[keyName].includes('http')) && (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const supported = await Linking.canOpenURL(item[keyName]);
                        if (supported) {
                          await Linking.openURL(item[keyName]);
                        } else {
                          console.log("不支援的網址類型: " + item[keyName]);
                        }
                      } catch (e) { console.log(e) }
                    }}
                    activeOpacity={0.6} // 點擊時的透明度（0-1 之間）
                  >
                    <Text style={{ color: themeColors.link }}>
                      🌐 {item[keyName]}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {(keyName == 'LONGITUDE' || keyName == '經度') && data.map((item, index) => (
              <View key={index} style={[{ margin: w * 0.01, padding: index != 0 ? 0 : w * 0.005, borderRadius: w * 0.02, backgroundColor: "#0902", width: index == 0 ? w / 4.5 : w / 2.8 }]}>
                {index == 0 && (

                  <Text style={{ color: themeColors.subText }}>{lang == 'EN' ? 'Maps' : '地圖'}</Text>

                )}
                {index != 0 && <MapView
                  key={`${item['LATITUDE']}-${item['LONGITUDE']}`}
                  style={styles.map}
                  initialRegion={{
                    latitude: item['LATITUDE'],
                    longitude: item['LONGITUDE'],
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: item['LATITUDE'],
                      longitude: item['LONGITUDE'],
                    }}
                    title={lang == 'EN' ? item['ENGLISH NAME'] : item['中文名稱']}
                    description={lang == 'EN' ? item['ENGLISH ADDRESS'] : item['中文地址']}
                  />
                </MapView>
                }
              </View>
            ))}

          </View>
        ))}
      </ScrollView>
    );
  }
  return (
    <View style={{ backgroundColor: themeColors.background, flex: 1 }}>
      <View style={{ height: Platform.OS == 'android' ? h * 0.05 : 0 }}></View>

      <View style={styles.alertWrapper}>
        <Text style={styles.alertLabel}>
          {lang === 'EN'
            ? 'Please go to Home Page and choose two schools for comparison'
            : '請前往主頁選擇兩所學校進行比較'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => { navigation.navigate('Home'); }} style={{ width: "100%", height: '100%', alignItems: "center", justifyContent: "center", paddingBottom: "30%" }}>
        <FontAwesomeIcon
          name="balance-scale"
          size={Dimensions.get("window").width * 0.2}
          color={'rgba(90, 140, 200,0.5)'}
        />
        <View style={{ padding: "5%", backgroundColor: 'rgb(90, 140, 200)', borderRadius: "10%", marginTop: "8%" }}>
          <Text style={{ color: "white" }}>{lang == 'EN' ? 'Add More School' : '添加更多學校'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold' },
  input: { marginHorizontal: 20, marginBottom: 10, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10 },
  card: { marginHorizontal: 15, marginVertical: 5, elevation: 2 },
  map: { width: '100%', height: h * 0.2 },
  detailContainer: { flex: 1, paddingTop: 40 },
  favoriteButton: { marginHorizontal: 15, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10, flexDirection: "row" },
  backButton: { margin: 5, padding: 5, borderRadius: 10, alignItems: 'center' },
  backButtonText: { fontWeight: 'bold', fontSize: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  shadow01: {
    shadowColor: 'rgb(0, 22, 132)',
    shadowOffset: { width: Dimensions.get("window").height * 0.003, height: Dimensions.get("window").height * 0.003 },
    shadowOpacity: 0.3,
    shadowRadius: Dimensions.get("window").width * 0.0015,
  },
  alertWrapper: {
    backgroundColor: '#E3F2FD', // 更改為淺藍色調，避免與您現有的樣式混淆
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3', // 左側加重色條，增加提示感
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertLabel: {
    fontSize: 15,
    color: '#1565C0',
    fontWeight: '600',
    textAlign: 'center',
  },
});
