import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { AsyncStorage } from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: 'AIzaSyBGKfyAuCH6abcm49GtGdQC1Bihw-pbMrg',
  authDomain: 'exchange-e99e5.firebaseapp.com',
  databaseURL: 'https://exchange-e99e5.firebaseio.com',
  projectId: 'exchange-e99e5',
  storageBucket: 'exchange-e99e5.appspot.com',
}

var app, auth;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      // persistence: getReactNativePersistence(AsyncStorage),
      persistence: browserLocalPersistence,
    });
  } catch (error) {
    // console.log('Error initializing app: ' + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

// const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)})
// const auth = getAuth(app);


// Optionally, you can export the initialized Firebase instance for use throughout your app
export default {app, db};
// export default {app, db, auth};

// import firebase from 'firebase/app';
// import 'firebase/firestore'; // Import other Firebase services if needed

// const firebaseConfig = {
//   apiKey: 'AIzaSyBGKfyAuCH6abcm49GtGdQC1Bihw-pbMrg',
//   authDomain: 'exchange-e99e5.firebaseapp.com',
//   databaseURL: 'https://exchange-e99e5.firebaseio.com',
//   projectId: 'exchange-e99e5',
//   storageBucket: 'exchange-e99e5.appspot.com',
// };

// // Initialize Firebase if it hasn't been initialized already
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// // Optionally, you can export the initialized Firebase instance for use throughout your app
// export default firebase;