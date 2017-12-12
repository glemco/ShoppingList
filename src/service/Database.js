import firebase from 'firebase';

let config = {
    apiKey: "AIzaSyAnnGG9nZlwaScyADQCFyaM8w0xgJGpUVI",
    authDomain: "alfred-e66d6.firebaseapp.com",
    databaseURL: "https://alfred-e66d6.firebaseio.com",
    projectId: "alfred-e66d6",
    storageBucket: "alfred-e66d6.appspot.com",
    messagingSenderId: "398222058017"
};

firebase.initializeApp(config);

export default firebase;