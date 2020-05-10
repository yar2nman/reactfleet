import * as firebase from 'firebase';
import * as env from '../envVariables.json'

const config = env.firebaseconfig;

  firebase.initializeApp(config);
  export const auth = firebase.auth;
  export const db = firebase.database()

  export function signup(email: string, password: string) {
    return auth().createUserWithEmailAndPassword(email, password);
  }
  
  export function signin(email: string, password: string) {
    return auth().signInWithEmailAndPassword(email, password);
  }