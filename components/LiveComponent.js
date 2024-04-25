import React from 'react'
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, Text, Button, Image, Dimensions } from 'react-native'
import * as firebase from "firebase/app";
import { styles } from '../src/styles/styles.js'
import { PROSPECTS } from '../shared/prospects'
import { getAuth } from 'firebase/auth';
import { collection, doc, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import app from '../config/Firebase.js';

function getNumberWithOrdinal(n) {
    var s = ['th','st','nd','rd'],
        v = n % 100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}

class Live extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prospects: PROSPECTS,
      curPick: 0,
      selectedPlayers: [],
      selectedPlayer: null,
      selections: {},
      pts: 0,
      isLocked: true,
      playerIsLocked: true
    }
  }

  setDraftState = ( curPick, isLocked ) => {
    this.setState({curPick: curPick, isLocked: isLocked})
  }

  componentDidMount() {

    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore(app);

    if (user.uid){
      const q_draft_selections_user = query(collection(db, 'draft_selections_user'), where('user_id', '==', user.uid));
      const unsub_draft_selections_user = onSnapshot(q_draft_selections_user, (querySnapshot) => {
        const selections = {}
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          selections[ data['pk'].toString() ] = data['player_id']
          // if (data['pk'].toString() == this.state.curPick.toString()) {
          //   const selectedPlayer = {'player_id': data['player_id'], 'pts' }

            
          // }
        });
        this.setState({selections: selections});
        if (this.state.curPick.toString() in selections){
          this.setState({playerIsLocked:true, selectedPlayer: selections[this.state.curPick.toString()]})
        }
        else{
          this.setState({playerIsLocked:false})
        }
      }).bind(this);

      const q_draft_selections = query(collection(db, 'draft_selections'));
      const unsub_draft_selections = onSnapshot(q_draft_selections, (querySnapshot) => {
        const selections = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          selections.push(data['player_id']);
        });
        this.setState({selectedPlayers: selections});
      }).bind(this);

      const q_draft_status = query(collection(db, 'draft_status'));
      const unsub_draft_status = onSnapshot(q_draft_status, (querySnapshot) => {
        var s = {}
        querySnapshot.forEach(function(doc) {
          var data = doc.data();
          s = { curPick: data['cur_pk'], isLocked: data['is_locked'] }
        })

        if( (s['curPick']!=this.state.curPick) & (this.state.curPick != 0) ){
          // console.log(`settting selectedPlayer to null`)
          this.setState({selectedPlayer: null});
        }
        // if( (s['curPick']!=this.state.curPick) ){
        //   this.setState({playerIsLocked:false});
        // }
        if (s['curPick'].toString() in this.state.selections){
          this.setState({selectedPlayer: this.state.selections[s['curPick'].toString()]})
        }
        this.setDraftState(s['curPick'], s['isLocked'] );
        if (s['curPick'].toString() in this.state.selections){
          console.log('90')
          this.setState({playerIsLocked:true})
        }
        else{
          this.setState({playerIsLocked:false})
        }
      }).bind(this);

      // var ss = firestore.collection('draft_selections');
      // ss.onSnapshot(querySnapshot => {
      //   var selections = [];
      //   querySnapshot.forEach(function(doc) {
      //     var data = doc.data();
      //     selections.push(data['player_id'])
      //   });
      //   this.setState({selectedPlayers: selections});
      // }).bind(this)


      // const status = firestore.collection('draft_status');
      // status.onSnapshot(querySnapshot => {
      //   var s = {}
      //   querySnapshot.forEach(function(doc) {
      //     var data = doc.data();
      //     s = { curPick: data['cur_pk'], isLocked: data['is_locked'] }
      //   })

      //   if( s['curPick']!=this.state.curPick ){
      //     this.setState({selectedPlayer: null});
      //   }
      //   this.setDraftState(s['curPick'], s['isLocked'] );
      //   if (this.state.curPick.toString() in this.state.selections){
      //     this.setState({playerIsLocked:true})
      //   }
      //   else{
      //     this.setState({playerIsLocked:false})
      //   }
      // }).bind(this)
    }
  }

  submitPick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore(app);
    const item = {
      pk: this.state.curPick,
      user_id: user.uid,
      pts: this.state.pts,
      player_id: this.state.selectedPlayer
    }
    // firestore.collection('draft_selections_user').add(item)
    await setDoc(doc(db, 'draft_selections_user', `${this.state.curPick}.${user.uid}`), item);
  }

  onPress = (playerId, pts) => {
      this.setState({selectedPlayer:playerId, pts:pts})
  };

  render() {

      const state = this.state;
      const curPick = state.curPick;

      const prospects = state.prospects.filter(p => (p[0]==curPick) & ! this.state.selectedPlayers.includes( p[1] ) ).sort((a,b) => b[5] - a[5] );
      const tot_prob = prospects.reduce(function(a, b){
          return a + b[5];
      }, 0);

      if (this.state.selectedPlayer == null && this.state.curPick.toString() in this.state.selections){
          console.log('160')
          this.setState({selectedPlayer: this.state.selections[this.state.curPick.toString()], playerIsLocked:true})
      }
      var curOpacity = (this.state.isLocked | this.state.playerIsLocked) ? 0.5 : 1.0;
      var isDisabled = (this.state.isLocked | this.state.playerIsLocked) ? true : false;
      var items = prospects.slice(0, 40).map((i, index) => {
        var pts = Math.max(10, Math.min(Math.min(150, (index*15)+20), Math.round(tot_prob / i[5])*5))
        var selected = this.state.selectedPlayer==i[1];
        var borderWidth = selected ? 0 : 0;
        var backgroundColor = selected ? '#ffbf43' : 'white';
        return <TouchableOpacity
                  key={i[1]}
                  style={[styles.pickButton, {width:'100%', flex:5, borderWidth: borderWidth, backgroundColor:backgroundColor, opacity: curOpacity}]}
                  onPress={() => this.onPress(i[1], pts)}
                  disabled={isDisabled}
                  >
                  <View style={{flexDirection: 'row'}}>
                  <View style={{flex:4, padding: 10, justifyContent: 'center'}}>
                    <Text style={styles.playerName}>{i[2]}, {i[3]}, {i[4]}</Text>
                  </View>
                  <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#003465', padding: 10, borderTopRightRadius: 5, borderBottomRightRadius: 5}}>
                    <Text style={{color: 'white'}}>{pts}</Text>
                    <Text style={{color: 'white', fontSize:8}}>Points</Text>
                  </View>
                  </View>
                </TouchableOpacity>
      });

      const pk = getNumberWithOrdinal(this.state.curPick);
      var selectedPlayer = this.state.prospects.filter( p => p[1]==this.state.selectedPlayer );
      var selectedPlayerName = selectedPlayer.length==0 ? '' : selectedPlayer[0][2];
      var backgroundColor = this.state.selectedPlayer==null ? 'gray' : '#ffbf43';
      var label = this.state.playerIsLocked ? 'Pick Submitted!' : 'Submit Pick';
      var disabled = this.state.playerIsLocked | this.state.isLocked  | this.state.selectedPlayer==null ? true : false;
      var statusLabel = <><Text style={[{color:'white',fontSize:16, padding:10, textAlign:'center'}]}>{label}</Text></>;

      return (
        <ScrollView style={[styles.scrollContainer, styles.test]}>
          <Text style={{textAlign: 'center', fontSize:24, marginBottom:10, color: 'white'}} >Who will be the {pk} pick?</Text>
          <Text style={{textAlign: 'center', fontSize:12, marginBottom:10, color: 'white'}} >{selectedPlayerName}</Text>
          <TouchableOpacity
            style={[styles.clock, { borderRadius: 5, backgroundColor: backgroundColor, margin: 5 }]}
            onPress={() => this.submitPick()}
            disabled={disabled}
            >
            {statusLabel}
          </TouchableOpacity>
          <View style = { styles.allButtons }>
            {items}
          </View>
          <View style={{padding:15}}>
          </View>
        </ScrollView>
      )
  }
}

export default Live;
