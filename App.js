
import 'react-native-gesture-handler';

import { onAuthStateChanged } from 'firebase/auth';

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './app/screens/authentification/Login';
import SignUp from './app/screens/authentification/SignUp';
import ForgotPassword from './app/screens/authentification/ForgotPassword';
import AdminInterface from './app/screens/AdminInterface';
import Footer from './app/screens/Footer';
import Task from './app/screens/Task';


enableScreens();

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();


const defaultInsideOptions = { headerShown: true };

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Task' component={Task} options={{ headerShown: false }} />
      <InsideStack.Screen name='Footer' component={Footer} options={{ headerShown: false }} />
      <InsideStack.Screen name='Admin Panel' component={AdminInterface} options={{ headerShown: false }} />
      <InsideStack.Screen name='ForgotPassword' component={ForgotPassword} options={defaultInsideOptions} />
      <InsideStack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <InsideStack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      if (authUser) {
        console.log('User: ', authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          {user ? (
            <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} />
              <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
