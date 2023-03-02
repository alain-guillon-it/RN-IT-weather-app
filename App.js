import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';

import * as Location from 'expo-location';

const WEATHER_API_KEY = "14dad12fb3354f36fc6d16526be3cd45";


export default function App() {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const [latitude, setLatitude] = useState( "" );
  const [longitude, setLongitude] = useState( "" );
  const [tempMin, setTempMin] = useState("");
  const [temp, setTemp] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [weatherDescription, setWeatherDescription] = useState("")
  const [city, setCity] = useState("");
  const [icon, setIcon] = useState("");
  const [humidity, setHumidity] = useState( 0);

  const getURI = async (lat, long) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}&lang=fr&units=metric`)
    const data = await response.json()

    setCity( data.name );
    setTempMin( data.main.temp_min );
    setTemp( data.main.temp );
    setTempMax( data.main.temp_max );
    setWeatherDescription( data.weather[0].description );
    setIcon( data.weather[0].icon )
    setHumidity( data.main.humidity )

    console.log( data );
    console.log( {
      city,
      temp,
      tempMax,
      tempMin,
      weatherDescription,
      icon,
      humidity
    } )

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
    })();
  }, []);

/*  let text = 'Chargement...';

  if (errorMsg) {
    text = errorMsg;
    console.log ( text );
  }*/

  return (
    <View style={styles.container}>

      {
        location ? (
            <ActivityIndicator
              size="large"
              color="darred"
            />
        ) : (
            <View>
              <Text>{ city }</Text>
              <Text>{ temp }</Text>
              <Text>{ tempMax }</Text>
              <Text>{ tempMin }</Text>
              <Text>{ weatherDescription }</Text>
              <Text>{ icon }</Text>
              <Text>{ humidity }</Text>
              <Text> dlfjslkfjslfjs </Text>

            </View>
        )
      }



      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
