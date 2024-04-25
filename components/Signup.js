import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { createUserWithEmailAndPassword, getAuth, useAuthState, onAuthStateChanged, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
// import Firebase from '../config/Firebase'
// import * as firebase from "firebase/app";
import { styles } from '../src/styles/styles.js'
import app from '../config/Firebase.js';
import { doc, getFirestore, persistentLocalCache, setDoc } from 'firebase/firestore';


class Signup extends React.Component {
  constructor(props) {
    super(props);
    // this.handleSignUp = props.handleSignUp;
}
    state = {
        email: '',
        displayName: '',
        password: '',
        errTxt: ''
    }
    handleSignUp = async (email, password, displayName) => {
      try {
        const auth = getAuth(app);
        // await setPersistence(auth, browserSessionPersistence);

        const val = await createUserWithEmailAndPassword(auth, email, password)
        const item ={
          id: val.user.uid
          , displayName: this.state.displayName
        }
        const db = getFirestore(app);
        const newDoc = await setDoc(doc(db, 'users', `${val.user.uid}`), item);
        return('');
      } catch (error) {
        return(error.message);
      }
    }

    // handleSignUp = () => {
    //     const { email, displayName, password } = this.state
    //     Firebase.auth()
    //       .createUserWithEmailAndPassword(email, password)
    //       .then((userCredentials)=>{
    //           if(userCredentials.user){
    //             var firestore = firebase.firestore();
    //             const users = firestore.collection('users');
    //             users.doc(userCredentials.user.uid).set({id: userCredentials.user.uid, displayName: displayName})
    //               userCredentials.user.updateProfile({
    //                   displayName: displayName
    //               }).then((s)=> {
    //               }).catch(function(error) {
    //               });
    //           }
    //       })
    //       .catch(error => this.setState({errTxt: error.message}))
    // }

    render() {
      const errTxt = this.state.errTxt=='' ? <></> : <Text style={{color:'red'}}>{this.state.errTxt}</Text>
        return (
          <View style={styles.container}>
            {errTxt}
            <TextInput
              style={styles.inputBox}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              placeholder='Email'
              autoCapitalize='none'
            />
            <TextInput
              style={styles.inputBox}
              value={this.state.displayName}
              onChangeText={displayName => this.setState({ displayName })}
              placeholder='Display Name'
              autoCapitalize='none'
            />
            <TextInput
              style={styles.inputBox}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              placeholder='Password'
              secureTextEntry={true}
            />
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={async () => {
                const txt = await this.handleSignUp(this.state.email, this.state.password, this.state.displayName)
                this.setState({errTxt: txt})
              }}>
                <Text style={[styles.buttonText, styles.primaryButtonText]}>Signup</Text>
            </TouchableOpacity>
          </View>
        )
    }
}


export default Signup;
