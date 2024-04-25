// Loading.js
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { styles } from '../src/styles/styles.js';


export default class Loading extends React.Component {
	render() {
		return (
			<View style={[styles.container, styles.test, {justifyContent:'center'}]}>
				<View style={{margin: 20}}>
					<Text style={{color: 'white', fontSize: 24}}>Loading</Text>
				</View>
				<View>
					<ActivityIndicator size='large' color='#fff' />
				</View>
				<View style={{padding: 60}}>
				</View>
			</View>
		)
	}
}
