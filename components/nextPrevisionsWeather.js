import { StyleSheet, FlatList, View, ScrollView, Text, Image } from "react-native";

export default function NextPrevisionsWeather({ nextDays }) {
    return (
        <ScrollView style={styles.prevsContainer}>
            <FlatList
                data={nextDays}
                keyExtractor={(_, i) => i.toString}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.date}>{item.date}</Text>
                        <FlatList
                            horizontal
                            style={{ padding: 30 }}
                            data={item.previsions}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item: day }) => (
                                <View style={styles.range}>
                                    <Text>{day.heure} </Text>
                                    <Image
                                        source={{ uri: day.iconeUrl }}
                                        style={{ width: 50, height: 50 }}
                                    />
                                    <Text>{day.description}</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    prevsContainer: {
        display:'flex',
        flexDirection:'colum',
    },
    FlatList:{
        margin: 5,
    },
    date:{
        marginLeft: 20,
        marginTop: 30,
        fontSize: 20,
        fontStyle: 'bold',
     
    },
    range: {
        marginRight: 40,
    },

})