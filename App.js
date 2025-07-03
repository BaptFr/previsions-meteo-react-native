import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground } from 'react-native';
import { WEATHER_API_KEY } from './config.js';
import * as Location from 'expo-location';

import CurrentWeather from './components/currentWeather.js';
import NextPrevisionsWeather from './components/nextPrevisionsWeather.js';

export default function App() {
  //Gestion des états
  const [meteo, setMeteo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const image = { uri:  'https://images.unsplash.com/photo-1603437873662-dc1f44901825?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'};



  useEffect(() => {
    //Docs EXPO
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted') {
          throw new Error('Permission refusée');
        }
        return Location.getCurrentPositionAsync({});
      })
      .then((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;
        return fetch(API_URL);
      })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur API : ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const ville = json.city.name;
        const prevTriees = {};
        //Boucle données
        json.list.forEach((item) => {
          //Formatde la date
          const [date, heureFull] = item.dt_txt.split(' ');
          const heure = heureFull.slice(0, 5);

          if (!prevTriees[date]) {
            prevTriees[date] = [];
          }
          
          prevTriees[date].push({
            heure,
            temperature: item.main.temp,
            description: item.weather[0].description,
            iconeUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          });
        });

        const previsions = Object.keys(prevTriees).map((date) => ({
          //Format date français
          date: new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }),
          previsions: prevTriees[date],
        }));

        //Séparation prevs jour / prevs jours suivants
        const previsionsJour = previsions[0];
        const previsionsSuivants = previsions.slice(1);

        setMeteo({ ville, previsionsJour, previsionsSuivants });
      })
      .catch((err) => {
        setErrorMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


   //Gestion erreurs / Chargement
  if (loading) return <ActivityIndicator size='large' style={styles.center} />;
  if (errorMsg) return <Text style={styles.center}>{errorMsg}</Text>;
  if (!meteo) return <Text style={styles.center}>Aucune donnée</Text>;
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.imageback}>
        <Text style={styles.title}>En ce moment à {meteo.ville}</Text>
        <CurrentWeather   
          currentDay= {meteo.previsionsJour}
        />
        <Text style={styles.title}>Ces prochains jours à {meteo.ville}:</Text>
        <NextPrevisionsWeather
          nextDays= {meteo.previsionsSuivants}
        />
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {    
    paddingTop: 75,
    paddingHorizontal: 40,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FA5000',
    textShadowColor: "#242323",
    textShadowOffset: {width: 2, height: 2},
    shadowRadius: 5,
  },

});
