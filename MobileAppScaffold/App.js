import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import colors from './utils/colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Hide splash screen immediately as we don't have external assets to load currently
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  }
});
