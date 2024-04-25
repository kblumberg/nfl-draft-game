import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, Image } from 'react-native'
import { createUserWithEmailAndPassword, getAuth, useAuthState, onAuthStateChanged, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import Firebase from '../config/Firebase'
import { styles } from '../src/styles/styles.js'
import { app } from '../config/Firebase';
import { persistentLocalCache } from 'firebase/firestore';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errTxt: ''
        }
        // this.handleSignIn = props.handleSignIn;
    }

    handleSignIn = async (email, password) => {
      try {
        const auth = getAuth(app);
        // await setPersistence(auth, browserSessionPersistence);
        const val = await signInWithEmailAndPassword(auth, email, password)
        return('');
      } catch (error) {
        return(error.message);
      }
    }

    // handleLogin = () => {
    //     const { email, displayName, password, errTxt } = this.state

    //     Firebase.auth()
    //         .signInWithEmailAndPassword(email, password)
    //         .catch(error => this.setState({errTxt: 'Incorrect email or password'}))
    // }

    render() {
        return (
            <View style={styles.container}>
              <View style={{margin: 20}}>
                <Image
                    style={styles.tinyLogo}
                    source={require('../assets/nfl_draft_prediction_contest_white.png')}
                    tintColor={'#0082c0'}
                    />
              </View>
                <TextInput
                    style={styles.inputBox}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    style={[styles.primaryButton, styles.button]}
                    onPress={async() => {
                        const txt = await this.handleSignIn(this.state.email, this.state.password)
                        this.setState({errTxt: txt});
                    }}
                    >
                    <Text style={[styles.buttonText, styles.primaryButtonText]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.secondaryButton, styles.button]}
                    title="Don't have an account yet? Sign up"
                    onPress={() => this.props.navigation.navigate('Signup')}
                    >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
                </TouchableOpacity>
                <Text style={{color:'red'}} >{this.state.errTxt}</Text>
            </View>
        )
    }
}

export default Login;
