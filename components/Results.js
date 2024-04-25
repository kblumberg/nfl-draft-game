import React, { Component } from 'react';
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, Text, Button, Image, Dimensions, FlatList, CheckBox } from 'react-native'
import * as firebase from "firebase/app";
import { styles } from '../src/styles/styles.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { app } from '../config/Firebase.js';

// 117, 192, 87

function getNumberWithOrdinal(n) {
    var s = ['th','st','nd','rd'],
        v = n % 100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_sels: {},
            act_sels: {},
            players: {}
        }
    }

    componentDidMount() {
      const auth = getAuth();
      const user = auth.currentUser;

      const user_id = user.uid;
      if (user_id){
        const db = getFirestore(app);
        const q_draft_selections_user = query(collection(db, 'draft_selections_user'), where('user_id', '==', user_id));
        const unsub_draft_selections_user = onSnapshot(q_draft_selections_user, (querySnapshot) => {
          const user_sels = {}
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            user_sels[data['pk'].toString()] = { 'user_player_id': data['player_id'], 'pts':data['pts'] }
          });
          this.setState({user_sels: user_sels})
        });

        const q_draft_selections = query(collection(db, 'draft_selections'));
        const unsub_draft_selections = onSnapshot(q_draft_selections, (querySnapshot) => {
          const act_sels = {}
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            act_sels[data['pk'].toString()] = { 'act_player_id': data['player_id'], 'team': data['team'] }
          });
          this.setState({act_sels: act_sels})
        });

        const q_players = query(collection(db, 'players'));
        const unsub_players = onSnapshot(q_players, (querySnapshot) => {
          const players = {}
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if(data['player_id']){
              players[data['player_id'].toString()] = data['player_name']
            }
          });
          this.setState({players: players})
        });
      }
    }

    renderRow({item}) {
      var pts = item.actual==item.predicted ? item.pts : 0;
      var backgroundColor = item.actual && item.actual==item.predicted ? '#5cb85c' : item.actual && item.predicted && item.actual!=item.predicted ? '#d9534f' : item.backgroundColor;
      var icon = item.actual && item.actual==item.predicted ? 'check' : item.actual && item.predicted && item.actual!=item.predicted ? 'times' : '';
        return(
          <View style={{flexDirection: 'row', backgroundColor: item.backgroundColor}}>
            <View style={{flex: 2, borderWidth: 0.8, borderColor: '#c7c7c7', alignItems: 'center', padding: 5, justifyContent: 'center'}}>
              <Text style={{fontSize:10}}>{item.pk}</Text>
            </View>
            <View style={{flex: 5, borderWidth: 0.8, borderColor: '#c7c7c7', alignItems: 'center', padding: 5, justifyContent: 'center'}}>
              <Text style={{fontSize:10}}>{item.team}</Text>
            </View>
            <View style={{flex: 7, borderWidth: 0.8, borderColor: '#c7c7c7', alignItems: 'center', padding: 5, justifyContent: 'center'}}>
              <Text style={{fontSize:10}}>{item.predicted_player}</Text>
            </View>
            <View style={{flex: 2, borderWidth: 0.8, borderColor: '#c7c7c7', alignItems: 'center', padding: 5, justifyContent: 'center', backgroundColor: backgroundColor}}>
              <Icon name={icon} size={20} color="#fff" />
            </View>
            <View style={{flex: 3, borderWidth: 0.8, borderColor: '#c7c7c7', alignItems: 'center', padding: 5, justifyContent: 'center'}}>
              <Text style={{fontSize:10}}>{pts}</Text>
            </View>
          </View>
        );
    }

    render() {
      var d = this.state.act_sels;
      var ks = {...this.state.act_sels, ...this.state.user_sels}
      for(var k in ks) {
        if(!this.state.act_sels[k]){
          d[k] = this.state.user_sels[k]
        } else if (!this.state.user_sels[k]) {
          d[k] = this.state.act_sels[k]
        } else {
          d[k] = Object.assign(this.state.act_sels[k], this.state.user_sels[k])
        }
      }
      var data = Object.keys(d).map(i => ({
        pk: parseInt(i),
        pk_label: getNumberWithOrdinal( parseInt(i) ),
        team: d[i]['team'],
        actual: d[i]['act_player_id'],
        predicted: d[i]['user_player_id'],
        actual_player: d[i]['act_player_id'] ? this.state.players[ d[i]['act_player_id'].toString()] : '',
        predicted: d[i]['user_player_id'],
        predicted_player: d[i]['user_player_id'] ? this.state.players[d[i]['user_player_id'].toString()] : '',
        pts: d[i]['pts']
      }));
      data.sort((a, b) => (a.pk > b.pk) ? 1 : -1);
      for (var i = 0; i < data.length; i++) {
        data[i]['backgroundColor'] =  i % 2 ? '#f0f0f0' : '#fff';
      }

        return (
          <ScrollView style={[styles.scrollContainer, styles.test]}>
          <Text style={{textAlign: 'center', fontSize:24, marginBottom:10, color: 'white'}} >Results</Text>
          <View style={{flexDirection: 'row', backgroundColor: '#003465'}}>
            <View style={{flex: 2, padding: 10, alignItems: 'center'}}>
              <Text style={{color:'white', fontSize:10}}>Pick</Text>
            </View>
            <View style={{flex: 5, padding: 10, alignItems: 'center'}}>
              <Text style={{color:'white', fontSize:10}}>Team</Text>
            </View>
            <View style={{flex: 7, padding: 10, alignItems: 'center'}}>
              <Text style={{color:'white', fontSize:10}}>Prediction</Text>
            </View>
            <View style={{flex: 2, padding: 10, alignItems: 'center'}}>
              <Text style={{color:'white', fontSize:10}}>Result</Text>
            </View>
            <View style={{flex: 3, padding: 10, alignItems: 'center'}}>
              <Text style={{color:'white', fontSize:10}}>Points</Text>
            </View>
          </View>
          <FlatList
                data = {data}
                renderItem = {this.renderRow}
            />
            <View style={{margin:25}}>
            </View>
          </ScrollView>
        )
    }
}

export default Results;
