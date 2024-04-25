
import React from 'react'
import { getAuth } from 'firebase/auth';
import app from '../config/Firebase.js';
import { styles } from '../src/styles/styles.js'
import { View, Text, TouchableOpacity } from 'react-native'
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            displayName: '',
        }
    }

    componentDidMount() {
        const auth = getAuth();
        const user = auth.currentUser;

        var uid = user.uid;
        var displayName = user.displayName;
        var email = user.email;
        
        this.setState({displayName: displayName, email: email})
        if (uid) {
            const db = getFirestore(app);
            const q_users = query(collection(db, 'users'), where('id', '==', uid));
            const unsub_users = onSnapshot(q_users, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.setState({displayName: data.displayName})
              });
            });
        }
    }

    signOut() {
        const auth = getAuth();
        auth.signOut();
    }
    render() {
        return (
            <View style={[styles.container, styles.test]}>
            <Text style={{textAlign: 'center', fontSize:24, marginBottom:10, color: 'white'}} >Profile</Text>
            <Text style={{textAlign: 'center', fontSize:24, marginBottom:10, color: 'white'}} >Username: {this.state.displayName}</Text>
            <Text style={{textAlign: 'center', fontSize:24, marginBottom:10, color: 'white'}} >Email: {this.state.email}</Text>
                <TouchableOpacity
                    style={[styles.pickButton, {width: '80%', padding: 10, margin: 10, borderWidth: 0, backgroundColor:'white', opacity: 1}]}
                    onPress={()=>this.signOut()}
                    >
                    <Text style={{fontSize: 16}}>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Profile;
