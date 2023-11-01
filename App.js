import { StyleSheet, View } from 'react-native';
import Map from './components/Map';
import Settings from './components/Settings';
export default function App() {
  // url voor schoolvakanties: https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/2023-2024?output=json
  return (
    <View style={styles.container}>
      {/* <Map /> */}
      <Settings />
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
});
