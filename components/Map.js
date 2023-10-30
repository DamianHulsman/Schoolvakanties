import { View, Text, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const Map = () => {
    const [lat, setlat] = useState(0.0);
    const [lon, setlon] = useState(0.0);

    const getGeolocation = async () => {
        try {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setlat(location.coords.latitude);
            setlon(location.coords.longitude);
        } catch (err) {
            console.log(err);
        }
    }
    getGeolocation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kaart</Text>
            <Text>Latitude: {lat}</Text>
            <Text>Longitude: {lon}</Text>
            <MapView
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            loadingEnabled={true}
            toolbarEnabled={false}
            pitchEnabled={false}
            style={{ width: 300, height: 200 }}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                region={{
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                }}>
                <Marker coordinate={{ latitude: lat, longitude: lon }} />
            </MapView>
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
    title: {
      fontSize: 25
    }
  });

export default Map;