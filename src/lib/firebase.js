import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyBiofOVwHzADPW4Bw6jN8SuBFOgnIWbB2I',
  authDomain: 'pangya-calculator.firebaseapp.com',
  databaseURL: 'https://pangya-calculator.firebaseio.com',
  projectId: 'pangya-calculator',
  storageBucket: 'pangya-calculator.appspot.com',
  messagingSenderId: '455584094777'
}

firebase.initializeApp(config)

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const database = firebase.database()
export default firebase
