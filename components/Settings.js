import { View, Text, StyleSheet, Switch, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const Settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = async () => {
        setIsEnabled(previousState => !previousState); 
        console.log('State changed: ' + isEnabled)
        await AsyncStorage.setItem('uselocation', JSON.stringify(isEnabled));
    }
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Settings Page</Text>
            <View style={styles.setting}>
                <View style={styles.flex}>
                        <Text style={{ marginTop:'auto', marginBottom:'auto' }}>Gebruik fysieke locatie</Text>
                        <Switch onValueChange={toggleSwitch} value={isEnabled} />
                </View>
            </View>
            <Text>{isEnabled}</Text>
        </SafeAreaView>
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
    },
    setting: {
        width: 350,
        borderWidth: 2,
        borderColor: 'gray',
        alignItems: 'center',
        borderRadius: 10,
    },
    flex: {
        flexDirection: 'row'
    }
  });


export default Settings;