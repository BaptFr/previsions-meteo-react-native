import { useState, useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import {WEATHER_API_KEY} from './config.js';
import * as Location from 'expo-location';


export default function App() {
  //Gestion états
  const [location, setLocation] = useState(null);
  const [meteo, setMeteo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function getCurrentLocationMeteo() {
      //Loader
      setLoading(true);
      //demande permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      //récupération position
      const position = await Location.getCurrentPositionAsync({});
      const lat = position.coords.latitude;
      const lon = position.coords.longitude; 
      setLocation(position);

      //doc: api call - Modifs: unit + lang
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;

      try{
      const response = await fetch(API_URL);
      if(!response.ok) {
        throw new error (`Response status: ${response.satus}`);
      }
      const json = await response.json();
      console.log("Retour JSON :", json);

      const ville  = json.city.name;
      const temperature = json.list[0].main.temp;
      const description =  json.list[0].weather[0].description;
      const icone = json.list[0].weather[0].icon;
      const iconeUrl = `https://openweathermap.org/img/wn/${icone}@2x.png`;  
 
      setMeteo({
        ville,
        icone, 
        iconeUrl
      });
    }catch(error){
      console.error(error.message);
    }
    //Fin du loader
     setLoading(false);
  }

    //Appels fnctns
    getCurrentLocationMeteo();
  }, []);
  

  return (
    <View style={styles.container}>
    {loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : errorMsg ? (
      <Text>{errorMsg}</Text>
    ) : meteo ? (
      <View>
        <Text>Météo du jour à {meteo.ville} </Text>
        <Text>Température : {meteo.temperature} °C</Text>
        <Text>Ressenti : {meteo.description}</Text>
        <Image  
          source= {{uri: meteo.iconeUrl}}
          style= { styles.logoMeteo}
        />
      </View>
    ) : (
      <Text>Aucune données météo disponible</Text>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  logoMeteo: {
    width: 100,
    height: 100,
  },
});
