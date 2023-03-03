import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, StatusBar, ActivityIndicator, Image, ImageBackground, ScrollView, FlatList } from 'react-native';

import * as Location from 'expo-location';

const WEATHER_API_KEY = "14dad12fb3354f36fc6d16526be3cd45";

export default function App() {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const [tempMin, setTempMin] = useState("");
  const [temp, setTemp] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [weatherDescription, setWeatherDescription] = useState("")
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [humidity, setHumidity] = useState( 0);
  const [prevision, setPrevision] = useState( [] )

  let iconImg = `http://openweathermap.org/img/wn/${icon}@4x.png`;

  const getURI = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&lang=fr&units=metric`)
    const data = await response.json()
    setCity( data.name );
    setTempMin( Math.floor( data.main.temp_min) );
    setTemp( Math.floor( data.main.temp ) );
    setTempMax( Math.floor( data.main.temp_max ) );
    setWeatherDescription( data.weather[0].description );
    setIcon( data.weather[0].icon )
    setHumidity( data.main.humidity )
  }

  const getNextFiveDaysURI = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&lang=fr&units=metric`)
    const data = await response.json();
    setPrevision( data.list );
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation( location );
      getURI( location.coords.latitude, location.coords.longitude);
      getNextFiveDaysURI( location.coords.latitude, location.coords.longitude);

    })();
  }, []);


  return (

      <ImageBackground
        source={{
          uri: "https://cdn.wallpapersafari.com/60/75/CoRxUK.jpg"
        }}
        resizeMode="cover"
        style={[styles.image, { backgroundColor: temp < 12 ? "black" : "darkred" }]}
      >
        <ScrollView>
          <View style={styles.container}>
            {
              location ? (
                  <>
                    <View>
                      <Text style={{ fontSize: 18, fontStyle: "italic", color: "white" }}>Atuellement à</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 32, marginVertical: 16, color: "white", paddingHorizontal: 16, paddingVertical: 8, fontWeight: "bold"}}>{ city }</Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 69, color: temp < 8 ? "white" : temp >= 8 ? "skyblue" : temp >= 15 ? "orange" : "red" }}>{ temp } <Text>°C</Text></Text>
                    </View>

                    <View style={{ alignItems: "center", justifyContent : "center" } }>
                      <Image source={{ uri: iconImg }} style={{ height: 200, width: 200 }}></Image>
                      <Text style={{ fontSize: 28, color: "#222222", textTransform: "uppercase", fontWeight: "bold" }}>{ weatherDescription }</Text>
                      <Text style={{ paddingTop: 16, paddingBottom: 32, fontSize: 18, color: "#222222" }}>{ humidity }% d'humidité dans l'air</Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingHorizontal: 16 }}>
                      { /* MIN */ }
                      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "aqua", padding: 16, opacity: 0.5, borderRadius: 10 }}>
                        <Text style={{ fontWeight: "bold" }}>Température Minimale</Text>
                        <Text style={{ fontSize: 32, fontWeight: "bold" }}>{ tempMin } <Text>°C</Text></Text>
                      </View>

                      { /* MAX */ }
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "red", padding: 16, opacity: 0.5, borderRadius: 10 }}>
                          <Text style={{ fontWeight: "bold" }}>Température Maximale</Text>
                          <Text style={{ fontSize: 32, fontWeight: "bold" }}>{ tempMax } <Text>°C</Text></Text>
                        </View>
                      </View>
                    </View>

                    { /* MATIN */ }
                    <Text style={{ fontWeight: "bold", marginTop: 50  }}>Prévisions du jour</Text>
                    <View style={{ width: "100%" }}>
                      <View style={{ flexDirection: "row", marginVertical: 8, height: 200 }}>
                        { /* jours */ }
                        <View style={{ width: "100%", padding: 8, opacity: 0.7 }}>
                          <FlatList
                            data={ prevision }
                            horizontal={ true }
                            keyExtractor={(item) => item.dt.toString() }
                            renderItem={ ({ item }) => (
                              <View style={{ height: 200, marginHorizontal: 4, paddingHorizontal: 24, paddingVertical: 12, flexDirection: "column", backgroundColor: "lightgrey", alignItems: "center" }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: 'capitalize' }}>{ new Date(item.dt_txt).toLocaleDateString('fr-FR', {weekday : "short", day: "numeric", month: 'short', hour: "numeric"}) }</Text>
                                <Image source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`  }} style={{ height: 100, width: 100 }}></Image>
                                <Text style={{ fontSize: 24, color: "#222222", fontWeight: "bold" }}>{ Math.floor(item.main.temp) } <Text>°C</Text></Text>
                              </View>
                            )}
                          >
                          </FlatList>
                        </View>
                      </View>
                    </View>

                    { /* MIDI */ }
                    <Text style={{ fontWeight: "bold", marginTop: 25  }}>Prévisions pour demain</Text>
                    <View style={{ width: "100%" }}>
                      <View style={{ flexDirection: "row", marginVertical: 8, height: 200 }}>
                        { /* jours */ }
                        <View style={{ width: "100%", padding: 8, opacity: 0.7 }}>
                          <FlatList
                              data={ prevision }
                              horizontal={ true }
                              keyExtractor={(item) => item.dt.toString() }
                              renderItem={ ({ item }) => (
                                  <View style={{ height: 200, marginHorizontal: 4, paddingHorizontal: 24, paddingVertical: 12, flexDirection: "column", backgroundColor: "lightgrey", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: 'capitalize' }}>{ new Date(item.dt_txt).toLocaleDateString('fr-FR', {weekday : "short", day: "numeric", month: 'short', hour: "numeric"}) }</Text>
                                    <Image source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`  }} style={{ height: 100, width: 100 }}></Image>
                                    <Text style={{ fontSize: 24, color: "#222222", fontWeight: "bold" }}>{ Math.floor(item.main.temp) } <Text>°C</Text></Text>
                                  </View>
                              )}
                          >
                          </FlatList>
                        </View>
                      </View>
                    </View>

                    { /* APRES-MIDI */ }
                    <Text style={{ fontWeight: "bold", marginTop: 25  }}>Prévisions pour après demain</Text>
                    <View style={{ width: "100%" }}>
                      <View style={{ flexDirection: "row", marginVertical: 8, height: 200 }}>
                        { /* jours */ }
                        <View style={{ width: "100%", padding: 8, opacity: 0.7 }}>
                          <FlatList
                              data={ prevision }
                              horizontal={ true }
                              keyExtractor={(item) => item.dt.toString() }
                              renderItem={ ({ item }) => (
                                  <View style={{ height: 200, marginHorizontal: 4, paddingHorizontal: 24, paddingVertical: 12, flexDirection: "column", backgroundColor: "lightgrey", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: 'capitalize' }}>{ new Date(item.dt_txt).toLocaleDateString('fr-FR', {weekday : "short", day: "numeric", month: 'short', hour: "numeric"}) }</Text>
                                    <Image source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`  }} style={{ height: 100, width: 100 }}></Image>
                                    <Text style={{ fontSize: 24, color: "#222222", fontWeight: "bold" }}>{ Math.floor(item.main.temp) } <Text>°C</Text></Text>
                                  </View>
                              )}
                          >
                          </FlatList>
                        </View>
                      </View>
                    </View>

                    { /* SOIR */ }
                    <Text style={{ fontWeight: "bold", marginTop: 25  }}>Prévisions dans 4 jours</Text>
                    <View style={{ width: "100%" }}>
                      <View style={{ flexDirection: "row", marginVertical: 8, height: 200 }}>
                        { /* jours */ }
                        <View style={{ width: "100%", padding: 8, opacity: 0.7 }}>
                          <FlatList
                              data={ prevision }
                              horizontal={ true }
                              keyExtractor={(item) => item.dt.toString() }
                              renderItem={ ({ item }) => (
                                  <View style={{ height: 200, marginHorizontal: 4, paddingHorizontal: 24, paddingVertical: 12, flexDirection: "column", backgroundColor: "lightgrey", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: 'capitalize' }}>{ new Date(item.dt_txt).toLocaleDateString('fr-FR', {weekday : "short", day: "numeric", month: 'short', hour: "numeric"}) }</Text>
                                    <Image source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`  }} style={{ height: 100, width: 100 }}></Image>
                                    <Text style={{ fontSize: 24, color: "#222222", fontWeight: "bold" }}>{ Math.floor(item.main.temp) } <Text>°C</Text></Text>
                                  </View>
                              )}
                          >
                          </FlatList>
                        </View>
                      </View>
                    </View>

                    { /* NUIT */ }
                    <Text style={{ fontWeight: "bold", marginTop: 25  }}>Prévisions dans 5 jours</Text>
                    <View style={{ width: "100%" }}>
                      <View style={{ flexDirection: "row", marginVertical: 8, height: 200 }}>
                        { /* jours */ }
                        <View style={{ width: "100%", padding: 8, opacity: 0.7 }}>
                          <FlatList
                              data={ prevision }
                              horizontal={ true }
                              keyExtractor={(item) => item.dt.toString() }
                              renderItem={ ({ item }) => (
                                  <View style={{ height: 200, marginHorizontal: 4, paddingHorizontal: 24, paddingVertical: 12, flexDirection: "column", backgroundColor: "lightgrey", alignItems: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: 'capitalize' }}>{ new Date(item.dt_txt).toLocaleDateString('fr-FR', {weekday : "short", day: "numeric", month: 'short', hour: "numeric"}) }</Text>
                                    <Image source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`  }} style={{ height: 100, width: 100 }}></Image>
                                    <Text style={{ fontSize: 24, color: "#222222", fontWeight: "bold" }}>{ Math.floor(item.main.temp) } <Text>°C</Text></Text>
                                  </View>
                              )}
                          >
                          </FlatList>
                        </View>
                      </View>
                    </View>

                  </>

              ) : (
              <ActivityIndicator
                size="large"
                color="darred"
              />
              )
            }

          <StatusBar style="auto" />
        </View>
        </ScrollView>
      </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 100
  },
  image: {
    flex: 1,
    justifyContent: "center",
    opacity: 0.8,
  }
});
