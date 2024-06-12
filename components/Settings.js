import { View, Text, StyleSheet, Switch, SafeAreaView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const Settings = () => {
    const [Enabled, setEnabled] = useState(true);
    const [customregion, setCustomRegion] = useState('midden');


    const toggleSwitch = async () => {
        setEnabled((Enabled === true ? false : true)); 
        await AsyncStorage.setItem('uselocation', JSON.stringify(Enabled)).then(() => {console.log('Fysieke locatie: ' + Enabled)});
    }

    const selectregion = async (region) => {
        setCustomRegion(region);
        await AsyncStorage.setItem('customregion', JSON.stringify(region)).then(() => {console.log('Set new region: ' + region)});
    }
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.setting}>
                <View style={styles.flex}>
                        <Text style={{ marginTop:'auto', marginBottom:'auto' }}>Gebruik fysieke locatie</Text>
                        <Switch onValueChange={toggleSwitch} value={Enabled} thumbColor={(Enabled === true ? 'lime' : 'red')} trackColor={(Enabled === true ? 'lime' : 'red')} />
                </View>
            </View>
            <View style={[styles.setting, {display: (Enabled === true ? 'none' : '')}]}>
                <View>
                    <Text style={{ marginTop:'auto', marginBottom:'auto' }}>Aangepaste regio:</Text>
                    <View style={styles.flex}>
                        <Button title="Noord" onPress={() => selectregion('noord')} color={(customregion === 'noord' ? 'lime' : '')} />
                        <Button title="Midden" onPress={() => selectregion('midden')} color={(customregion === 'midden' ? 'lime' : '')} />
                        <Button title="Zuid" onPress={() => selectregion('zuid')} color={(customregion === 'zuid' ? 'lime' : '')} />
                    </View>
                </View>
            </View>
            <View style={styles.setting} >
                    <View>
                        <Text>Gebruik fysieke locatie: {JSON.stringify(Enabled)}</Text>
                        <Text>Aangepaste regio: {customregion}</Text>
                    </View>
                </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    setting: {
        width: 350,
        borderWidth: 2,
        borderColor: 'gray',
        backgroundColor: '#fff',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 5
    },
    flex: {
        flexDirection: 'row'
    },
  });
  
export default Settings;