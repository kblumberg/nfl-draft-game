import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, getAuth, useAuthState, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';

import firebase from 'firebase/app';
import 'firebase/auth';
import { useEffect, useState } from 'react';
import Signup from './components/Signup';
import { app } from './config/Firebase';
import Login from './components/Login';
// import auth from './config/Firebase';
// import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Leaderboard from './components/Leaderboard';
import Results from './components/Results';
import Loading from './components/LoadingComponent';
import Profile from './components/Profile'
import Live from './components/LiveComponent'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  state = {
      email: '',
      displayName: '',
      password: '',
      errTxt: '',
      isSignedIn: false
  }
  const [initializing, setInitializing] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  // const [user, setUser] = useState();
  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  useEffect(() => {
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber; // unsubscribe on unmount
  }, []);

  const auth = getAuth();
  const user = auth.currentUser;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsSignedIn(true);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      setIsSignedIn(false);
      // ...
    }
  });

  if (!isSignedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              title: 'Login',
              headerStyle: { backgroundColor: '#0082c0' },
              headerTintColor: 'white',
              headerShown: false
            }}
          />
          <Stack.Screen
            name='Signup'
            component={Signup}
            options={{
              title: 'Signup',
              headerStyle: { backgroundColor: '#0082c0' },
              headerTintColor: 'white'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  // return(<View><Text>Logged in</Text></View>)

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            var iconName = 'home';

            if (route.name === 'Live') {
              iconName = 'home';
            } else if (route.name === 'Results') {
              iconName = 'check-circle';
            } else if (route.name === 'Leaderboard') {
              iconName = 'list';
            } else if (route.name === 'Profile') {
              iconName = 'edit';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name='Live' component={Live} />
        <Tab.Screen name='Leaderboard' component={Leaderboard} />
        <Tab.Screen name='Results' component={Results} />
        <Tab.Screen name='Profile' component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
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

// const App = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged((authenticatedUser) => {
//       if (authenticatedUser) {
//         setUser(authenticatedUser);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleLogin = async () => {
//     try {
//       await firebase.auth().signInWithEmailAndPassword(email, password);
//     } catch (error) {
//       console.log('Error signing in:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await firebase.auth().signOut();
//     } catch (error) {
//       console.log('Error signing out:', error);
//     }
//   };

//   if (user) {
//     return (
//       <View>
//         <Text>Welcome, {user.email}</Text>
//         <Button title="Logout" onPress={handleLogout} />
//       </View>
//     );
//   }

//   return (
//     <View>
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// };

// export default App;