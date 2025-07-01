import { useState, useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {WEATHER_API_KEY} from './config.js';
import * as Location from 'expo-location';


//doc: api call
const API_URL=`api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}`;


export default function App() {
  //Gestion UseStates
  const [location, setLocation] = useState(null);
  const[meteo, setMeteo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  
  useEffect(() => {
    async function getCurrentLocation() {
      //demande permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      //récupération position
      const position = await Location.getCurrentPositionAsync({});
      setLocation(position);
    }

    //Fetch API
    async function getData () {
      try{
        const response = await fetch(API_URL);
        if(!response.ok) {
          throw new error (`Response status: ${response.satus}`);
        }
        const json = await response.json();
        console.log(json);
      }catch(error){
        console.error(error.message);
      }
    }

    //Appels fnctns
    getCurrentLocation();
  }, []);



  //Gestion retour
  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  var latitude = null;
  var longitude = null;
  if (location && location.coords) {
  latitude = location.coords.latitude;
  longitude = location.coords.longitude;  
}

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <Text>Latitude : {latitude}</Text>
      <Text>Longitude : {longitude}</Text>
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
});
