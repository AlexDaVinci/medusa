import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import FormScreen from '../screens/FormScreen';
import { AuthProvider } from '../context/AuthContext';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{headerShown: false,}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Form" component={FormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
