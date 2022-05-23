const axios = require('axios');
const firebase = require("firebase");
require("firebase/firestore");

const port = process.env.PORT || 4000;

const fireBaseApp = firebase.initializeApp({
        apiKey: "AIzaSyDfJ8uG47xHuM_qh_emQvXgY9lwkgkKaxQ",
        authDomain: "blaze-bet-testingdata.firebaseapp.com",
        databaseURL: "https://blaze-bet-testingdata-default-rtdb.firebaseio.com",
        projectId: "blaze-bet-testingdata",
        storageBucket: "blaze-bet-testingdata.appspot.com",
        messagingSenderId: "1098271755039",
        appId: "1:1098271755039:web:22f299f59c1b97efacbe2a"
});

const db = firebase.firestore();

async function getData() {
    axios.get('https://blaze.com/api/roulette_games/recent/history?page=1')
    .then(res => {
        var response = res.data.records.reverse().forEach(element => {
            db.collection("Dados").doc(element.created_at).set({
                cor: element.color,
                numero: element.roll,
                seed: element.server_seed,
            });
        });
    }).catch(err => console.error(err))
    console.log("atualizou!") 
}

function repeat() {

    getData()

    setTimeout(repeat, 270000);
}

//START

repeat();


