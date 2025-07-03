import { StyleSheet, View, Text, FlatList, Image } from 'react-native';

export default function CurrentWeather({ currentDay }) {
    const currentMoment = currentDay.previsions[0];
    const currentRestOfDay = currentDay.previsions.slice(1);

    return (
        <View style={styles.dayContainer}>
            <View style={styles.current}>
                <Image source={{ uri: currentMoment.iconeUrl }} style={styles.icon} />
                <Text style={styles.temp}>{currentMoment.temperature}°C</Text>
                <Text style={styles.desc}>{currentMoment.description}</Text>
            </View>
            <View style={styles.currentList}>
                <FlatList
                    horizontal
                    data={currentRestOfDay}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.hourly}>
                            <Text>{item.heure}</Text>
                            <Image source={{ uri: item.iconeUrl }} style={{ width: 50, height: 50 }} />
                            <Text>{item.temperature}°C</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    dayContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',

    },
    current: {
        alignItems: 'center',
        marginBottom: 5,
    },
    currentList: {
        alignItems: 'center',
    },
    icon: {
        width: 80,
        height: 80,
    },
    temp: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    desc: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    hourly: {
        alignItems: 'center',
        marginRight: 15,
    },
});