import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TabNavigator from './TabNavigator';
import colors from '../utils/colors';

const Stack = createStackNavigator();

/**
 * Root Navigator
 * 
 * Features implemented:
 * 1. Stack Navigation
 * 2. Default Screen (initialRouteName="Login")
 * 3. Nested Navigator (Main App nested within Auth Stack)
 * 4. Advanced Screen Options (Header customization, transitions)
 * 5. Stack.Group (Categorized screen logic)
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Premium feel slide transition
        }}
      >
        {/* Auth Group: Uses shared options for authentication screens */}
        <Stack.Group>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{
              title: 'Sign In',
              gestureEnabled: false, // Prevent swiping back from login
            }}
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{
              title: 'Create Account',
            }}
          />
        </Stack.Group>
        
        {/* App Group: Nested navigator for the main application area */}
        <Stack.Group screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}>
          <Stack.Screen 
            name="Main" 
            component={TabNavigator} 
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
