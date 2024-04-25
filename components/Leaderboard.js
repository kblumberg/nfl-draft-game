import React, { Component } from 'react';
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, Text, Button, Image, Dimensions, FlatList } from 'react-native'
import { styles } from '../src/styles/styles.js'
import app from '../config/Firebase.js';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';


class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaderboard: {},
            user_names: {},
            cur_pos: {}
        }
    }

    componentDidMount() {
      const db = getFirestore(app);
      const query_users = query(collection(db, 'users'));
      const unsubscribe_users = onSnapshot(query_users, (querySnapshot) => {
        const user_names = {}
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          user_names[ data['id'] ] = data['displayName'];
        });
        this.setState({ user_names: user_names })
      });

      const q = query(collection(db, 'leaderboard'), where('rk', '<=', 100));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const leaderboard = {}
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          leaderboard[ data['user_id'] ] = {'pts':data['pts'], 'rk':data['rk'], 'rk_label':data['rk_label'] };
        });
        this.setState({leaderboard: leaderboard})
      });
    }

    renderRow({item}) {
        return(
          <View style={{flexDirection: 'row', backgroundColor: item.backgroundColor }}>
            <View style={{flex: 1, borderWidth: 0.8, borderColor: '#c7c7c7', alignItems: 'center', padding: 10}}>
              <Text style={{fontSize:16}}>{item.rk_label}</Text>
            </View>
            <View style={{flex: 4, borderWidth: 0.8, borderColor: '#c7c7c7', padding: 10}}>
              <Text style={{fontSize:16}}>{item.displayName}</Text>
            </View>
            <View style={{flex: 1, borderWidth: 0.8, borderColor: '#c7c7c7', alignItems: 'center', padding: 10}}>
              <Text style={{fontSize:16}}>{item.pts.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
            </View>
          </View>
        );
    }

    render() {
      var results = Object.keys(this.state.leaderboard).map(i => ({
        id: i,
        displayName: this.state.user_names.hasOwnProperty(i) ? this.state.user_names[i] : '',
        pts: this.state.leaderboard.hasOwnProperty(i) ? this.state.leaderboard[i]['pts'] : 0,
        rk: this.state.leaderboard.hasOwnProperty(i) ? this.state.leaderboard[i]['rk'] : null,
        rk_label: this.state.leaderboard.hasOwnProperty(i) ? this.state.leaderboard[i]['rk_label'] : 0
      }));
      results = results.filter( function(x) {
        return(x.rk<=100)
      })
      results.sort((a, b) => (a.pts > b.pts) ? -1 : (a.pts == b.pts) && (a.displayName < b.displayName) ?  -1 : 1)

      for (var i = 0; i < results.length; i++) {
        results[i]['backgroundColor'] =  i % 2 ? '#f0f0f0' : '#fff';
      }
      var cur_pos = this.state.cur_pos['rk_label'] ? <Text style={{textAlign: 'center', fontSize:18, marginBottom:10, color: 'white'}}>{'You are currently '+this.state.cur_pos['rk_label']+': '+this.state.cur_pos['pts'].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+' points'}</Text> : <></> ;

      return (
        <ScrollView style={[styles.scrollContainer, styles.test]}>
          <Text style={{textAlign: 'center', fontSize:24, marginBottom:10, color: 'white'}} >Leaderboard</Text>
          {cur_pos}
          <View style={{flexDirection: 'row', backgroundColor: '#003465'}}>
            <View style={{flex: 1, padding: 10}}>
              <Text style={{color:'white', fontSize:16}}>Rank</Text>
            </View>
            <View style={{flex: 4, padding: 10}}>
              <Text style={{color:'white', fontSize:16}}>Name</Text>
            </View>
            <View style={{flex: 1, padding: 10}}>
              <Text style={{color:'white', fontSize:16}}>Points</Text>
            </View>
          </View>
          <FlatList
                data = {results}
                renderItem = {this.renderRow}
            />
          <View style={{marginBottom: 50}}></View>
        </ScrollView>
      )
    }
}

export default Leaderboard;
