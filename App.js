import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, FlatList } from 'react-native';
import { WEATHER_API_KEY } from './config.js';
import * as Location from 'expo-location';

export default function App() {
  //Gestion des états
  const [meteo, setMeteo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Docs EXPO
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted') {
          throw new Error("Permission refusée");
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

        setMeteo({ ville, previsions });
      })
      .catch((err) => {
        setErrorMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : meteo ? (
        <View>
          <Text style={styles.title}>En ce moment à </Text>
          <Text  style={styles.title}> {meteo.ville}</Text>

          {/* Météo actuelle adapté Location */}
          <View style={styles.currentWeather}>
            <Image
              source={{ uri: meteo.previsions[0].previsions[0].iconeUrl }}
              style={styles.logoMeteo}
            />
            <Text style={styles.temperature}>
              {meteo.previsions[0].previsions[0].temperature} °C
            </Text>
            <Text>{meteo.previsions[0].previsions[0].description}</Text>
          </View>

          {/* Flat list des prevs/jours */}
          <FlatList
            data={meteo.previsions}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={styles.containerPrevs}>
                <Text style={styles.date}>{item.date}</Text>
                <FlatList
                  horizontal
                  data={item.previsions}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item: p }) => (
                    <View style={{ alignItems: 'center', marginRight: 15 }}>
                      <Text>{p.heure}</Text>
                      <Image source={{ uri: p.iconeUrl }} style={{ width: 50, height: 50 }} />
                      <Text>{p.temperature}°C</Text>
                    </View>
                  )}
                
                />
              </View>
            )}
          />
        </View>
      ) : (
        <Text>Aucune donnée </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  currentWeather: {
    alignItems: 'center',
    marginBottom: 25,
  },
  containerPrevs:{
    marginBottom : 50,
  },
  temperature: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoMeteo: {
    width: 100,
    height: 100,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
