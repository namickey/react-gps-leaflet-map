import React, { useState } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Separator = () => (
  <View style={styles.separator} />
);
const App: () => React$Node = () => {
  const [location, setLocation] = useState([]);
  const postGpsData = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    Geolocation.getCurrentPosition((position) => {
        setLocation(position);
        try {
          let response = fetch('https://xxxxxxx/xxxxxxxx',{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(location['coords'])
          });
        } catch (error) {
          console.error(error);
        }
      }, (error) => {
        console.log(error.code, error.message);
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
  return (
  <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>latitude: {location?.coords?.latitude}</Text>
      <Text style={styles.title}>longitude: {location?.coords?.longitude}</Text>
      <Text style={styles.title}>altitude: {location?.coords?.altitude}</Text>
      <Button
        title="Press me"
        onPress={() => postGpsData()}
      />
    </View>
  </SafeAreaView>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
