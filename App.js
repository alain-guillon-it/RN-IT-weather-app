import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
} from "react-native";

import * as Location from "expo-location";
import Prevision from "./components/Prevision";

const WEATHER_API_KEY = "14dad12fb3354f36fc6d16526be3cd45";

export default function App() {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const [tempMin, setTempMin] = useState("");
  const [temp, setTemp] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [weatherDescription, setWeatherDescription] = useState("");
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [humidity, setHumidity] = useState(0);
  const [prevision, setPrevision] = useState([]);

  let iconImg = `http://openweathermap.org/img/wn/${icon}@4x.png`;

  const getURI = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&lang=fr&units=metric`
    );
    const data = await response.json();
    setCity(data.name);
    setTempMin(Math.floor(data.main.temp_min));
    setTemp(Math.floor(data.main.temp));
    setTempMax(Math.floor(data.main.temp_max));
    setWeatherDescription(data.weather[0].description);
    setIcon(data.weather[0].icon);
    setHumidity(data.main.humidity);
  };

  const getNextFiveDaysURI = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&lang=fr&units=metric`
    );
    const data = await response.json();
    setPrevision(data.list);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      getURI(location.coords.latitude, location.coords.longitude);
      getNextFiveDaysURI(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://cdn.wallpapersafari.com/60/75/CoRxUK.jpg",
      }}
      resizeMode="cover"
      style={[
        styles.image,
        { backgroundColor: temp < 12 ? "black" : "darkred" },
      ]}
    >
      <ScrollView>
        <View style={styles.container}>
          {location ? (
            <>
              <View>
                <Text
                  style={[styles.text18, styles.textWhite, styles.textItalic]}
                >
                  Atuellement à
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.text32,
                    styles.my16,
                    styles.textWhite,
                    styles.px16,
                    styles.py8,
                    styles.textBold,
                  ]}
                >
                  {city}
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 69,
                    color:
                      temp < 8
                        ? "white"
                        : temp >= 8
                        ? "skyblue"
                        : temp >= 15
                        ? "orange"
                        : "red",
                  }}
                >
                  {temp} <Text>°C</Text>
                </Text>
              </View>

              <View
                style={[styles.alignItemsCenter, styles.justifyContentCenter]}
              >
                <Image
                  source={{ uri: iconImg }}
                  style={{ height: 200, width: 200 }}
                ></Image>
                <Text
                  style={[
                    styles.textDark2,
                    styles.textUpper,
                    styles.textBold,
                    styles.text28,
                  ]}
                >
                  {weatherDescription}
                </Text>
                <Text
                  style={[
                    styles.textDark2,
                    styles.text18,
                    {
                      paddingTop: 16,
                      paddingBottom: 32,
                    },
                  ]}
                >
                  {humidity}% d'humidité dans l'air
                </Text>
              </View>

              <View
                style={[
                  styles.flexDirectionRow,
                  styles.justifyContentCenter,
                  styles.vw100,
                  {
                    paddingHorizontal: 16,
                  },
                ]}
              >
                {/* MIN */}
                <View
                  style={[
                    styles.flexDirectionColumn,
                    styles.alignItemsCenter,
                    styles.justifyContentCenter,
                    styles.bgBlue,
                    {
                      padding: 16,
                      opacity: 0.5,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Text style={styles.textBold}>Température Minimale</Text>
                  <Text style={[styles.text32, styles.textBold]}>
                    {tempMin} <Text>°C</Text>
                  </Text>
                </View>

                {/* MAX */}
                <View style={styles.flexDirectionRow}>
                  <View
                    style={[
                      styles.flexDirectionColumn,
                      styles.alignItemsCenter,
                      styles.justifyContentCenter,
                      styles.bgRed,
                      { padding: 16, opacity: 0.5, borderRadius: 10 },
                    ]}
                  >
                    <Text style={[styles.textBold]}>Température Maximale</Text>
                    <Text style={[styles.text32, styles.textBold]}>
                      {tempMax} <Text>°C</Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* PREVISION */}
              <Text style={[styles.text18, styles.textBold, styles.my25]}>
                Prévisions à venir
              </Text>
              <View
                style={{
                  height: 200,
                }}
              >
                <View style={[styles.vw100, { padding: 8, opacity: 0.5 }]}>
                  <FlatList
                    data={prevision}
                    horizontal={true}
                    keyExtractor={(item) => item.dt.toString()}
                    renderItem={({ item }) => <Prevision myPrevision={item} />}
                  ></FlatList>
                </View>
              </View>
            </>
          ) : (
            <ActivityIndicator size="large" color="darred" />
          )}

          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 100,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    opacity: 0.8,
  },
  textBold: {
    fontWeight: "bold",
  },
  textItalic: {
    fontStyle: "italic",
  },
  textUpper: {
    textTransform: "uppercase",
  },
  textCapitalize: {
    textTransform: "capitalize",
  },
  text16: {
    fontSize: 16,
  },
  text18: {
    fontSize: 18,
  },
  text24: {
    fontSize: 24,
  },
  text28: {
    fontSize: 28,
  },
  text32: {
    fontSize: 32,
  },
  textWhite: {
    color: "white",
  },
  textDark2: {
    color: "#222222",
  },
  mx5: {
    marginHorizontal: 5,
  },
  my8: {
    marginVertical: 8,
  },
  my16: {
    marginVertical: 16,
  },
  my25: {
    marginVertical: 25,
  },
  mt25: {
    marginTop: 25,
  },
  px30: {
    paddingHorizontal: 30,
  },
  px16: {
    paddingHorizontal: 16,
  },
  py15: {
    paddingVertical: 15,
  },
  py8: {
    paddingVertical: 8,
  },
  flexDirectionColumn: {
    flexDirection: "column",
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  bgGrey: {
    backgroundColor: "lightgrey",
  },
  bgRed: {
    backgroundColor: "red",
  },
  bgBlue: {
    backgroundColor: "aqua",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  vw100: {
    width: "100%",
  },
});
