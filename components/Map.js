import { View, Text, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const Map = () => {
    const [lat, setlat] = useState(0.0);
    const [lon, setlon] = useState(0.0);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const getGeolocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setlat(location.coords.latitude);
            setlon(location.coords.longitude);
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&limit=5&appid=f25e31f2eaa6e1b215ca709bf964d2db`);
            setCity(response.data[0].name);    
            setState(response.data[0].state);
            console.log(response.data);
    }

    const getRegion = () => {
        if (state === 'Drenthe' || 'Flevoland' || 'Friesland' || 'Groningen' || 'Noord-Holland' || 'Overijssel' && city !== 'Zeewolde') {
            alert('Regio = Noord');
        } else if (state === 'Zuid-Holland' || city === 'Zeewolde') {
            alert('Regio = Midden');
        } else if (state === 'Limburg' || 'Zeeland') {
            alert('Regio = Zuid');
        }
    }
    // getGeolocation();
    return (
        <View style={styles.container}>
            <View style={styles.flex}>
                <Button onPress={getGeolocation} title="Getgeolocation" />
                <Button onPress={getRegion} title="Get Region" />
            </View>
            
            <Text style={styles.title}>Kaart</Text>
            <Text>Latitude: {lat}</Text>
            <Text>Longitude: {lon}</Text>
            <Text>City: {city}</Text>
            <Text>State: {state}</Text>
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 25
    },
    flex: {
        flexDirection: 'row',
    }
  });

export default Map;