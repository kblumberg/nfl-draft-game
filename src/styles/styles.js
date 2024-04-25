import { StyleSheet } from 'react-native'

// 0,130,192: #0082c0
// 0,52,101: #003465
// 218,0,23: #da0017
const lbColor = '#0082c0';
const bColor = '#003465';
const rColor = '#da0017';

export const styles = StyleSheet.create({
	pickButton: {
		padding: 0,
        margin: 5,
        // marginBottom: 20,
        // paddingVertical: 5,
        alignItems: 'center',
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: 'white'
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'flex-start',
		// justifyContent: 'center',
		padding: 16,
		paddingTop: 30
	},
	scrollContainer: {
		flex: 1,
		backgroundColor: '#fff',
		// alignItems: 'center',
		// justifyContent: 'flex-start',
		// justifyContent: 'center',
		padding: 16,
		paddingTop: 30,
	},
	button: {
		flex: 1,
		justifyContent: 'flex-start',
		padding: 10,
	},
	emailItem: {
		borderBottomWidth: 0.5,
		borderColor: 'rgba(0,0,0,0.3)',
		padding: 10
	},
	emailSubject: {
		color: 'rgba(0,0,0,0.5)'
	},
	searchInput: {
		padding: 10,
		borderColor: '#CCC',
		borderWidth: 1
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: 36,
		marginBottom: 16
	},
	androidButtonText: {
		color: 'blue',
		fontSize: 20
	},
	TextInputStyle: {
		textAlign: 'center',
		height: 40,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#009688',
		marginBottom: 10
	},
	textInput: {
		height: 40,
		width: '90%',
		borderColor: 'gray',
		borderWidth: 1,
		marginTop: 8
	},
	blueColor: {
		color: '#0082c0'
	},
	lblueColor: {
		color: '#003465'
	},
	redColor: {
		color: '#da0017'
	},
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        width: 300
    },
    primaryButton: {
        backgroundColor: lbColor,
        borderColor: lbColor,
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderColor: lbColor
    },
    buttonText: {
        fontSize: 20,
    },
    primaryButtonText: {
        fontWeight: 'bold',
        color: 'white'
    },
    secondaryButtonText: {
        color: lbColor
    },
    buttonSignup: {
        fontSize: 12
    },
    tinyLogo: {
				resizeMode: 'stretch',
				width: 357,
				height: 88
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: bColor
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        // backgroundColor: bColor,
        width: '100%',
    },
    test: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: lbColor,
        width: '100%',
    },

  // container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});
