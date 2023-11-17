import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Map from './components/Map';
import Settings from './components/Settings';
import Vacations from './components/Vacations';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen name="Vakanties" component={Vacations}
        options={{
          tabBarLabel: 'Vakanties',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="calendar" size={size} color={color} />
          ),
        }}
        />
        <Tab.Screen name="Kaart" component={Map}
        options={{
          tabBarLabel: 'Kaart',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map" size={size} color={color} />
          ),
        }}
        />
        <Tab.Screen name="Instellingen" component={Settings}
        options={{
          tabBarLabel: 'Instellingen',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cog" size={size} color={color} />
          ),
        }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
