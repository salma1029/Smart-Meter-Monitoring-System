import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import colors from './utils/colors';

import { auth } from './utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState(null);

  function onAuthStateChangedHandler(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthStateChangedHandler);
    
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();

    return subscriber;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNavigator user={user} />
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
