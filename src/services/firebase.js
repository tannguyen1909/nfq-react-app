import firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDkmZus-LNMjxedSnzNNv8qrgzYK8xhgTw",
    authDomain: "nfq-react-app.firebaseapp.com",
    databaseURL: "https://nfq-react-app.firebaseio.com",
    projectId: "nfq-react-app",
    storageBucket: "gs://nfq-react-app.appspot.com",
    messagingSenderId: "660923437141"
};

const $firebase     = firebase.initializeApp(config);
const $firestore    = $firebase.firestore();

$firestore.settings({timestampsInSnapshots: true});

const $db           = $firestore.collection('posts');
const $storage      = $firebase.storage();

export {
    $firebase,
    $db,
    $storage
};