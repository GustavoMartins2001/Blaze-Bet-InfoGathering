const axios = require('axios');
const firebase = require("firebase");
require("firebase/firestore");

const port = process.env.PORT || 4000;

const fireBaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDLB27nWPHbrSNTwBNfaLit1N8Fn-me7j4",
    authDomain: "open-banking-open-source.firebaseapp.com",
    projectId: "open-banking-open-source",
    storageBucket: "open-banking-open-source.appspot.com",
    messagingSenderId: "691278522719",
    appId: "1:691278522719:web:5e32f234fb907d76dbaeea",
    measurementId: "G-47842PXB6F"
});

const db = firebase.firestore();

async function getData() {
    axios.get('https://blaze.com/api/roulette_games/recent/history?page=1')
        .then(res => {
            var response = res.data.records.reverse().forEach(element => {
                db.collection("double-results").doc(element.created_at).set({
                    cor: element.color,
                    numero: element.roll,
                    seed: element.server_seed,
                    created_at: element.created_at
                });
            });
        }).catch(err => console.error(err))
    console.log("atualizou!")
}

var semGale = { acertos: 0, erros: 0, diferenca: 0 };
var somenteAteGale1 = { acertos: 0, acertosG1: 0, erros: 0, diferenca: 0 };
var somenteAteGale2 = { acertos: 0, acertosG1: 0, acertosG2: 0, erros: 0, diferenca: 0 };
var somenteAteGale3 = { acertos: 0, acertosG1: 0, acertosG2: 0, acertosG3: 0, erros: 0, diferenca: 0 };

function repeat() {
    getData();
    // updateDocs();
    totalRecords();
    setTimeout(repeat, 270000);
}

async function totalRecords() {
    let records = await docsArr(db, "double-results", 300);
    records = records.reverse();
    const assertArrays = [[1, 2, 2, 1, 1, 2], [1, 2, 1, 2, 1, 2], [2, 1, 1, 2, 2, 1], [2, 1, 2, 1, 2, 1]];
    while (records.length >= 10) {
        assert(records, assertArrays);
        assertG1(records, assertArrays);
        assertG2(records, assertArrays);
        assertG3(records, assertArrays);
        records = records.splice(1, records.length);
    }
    updateObjects();
    console.log(records);
}

function updateObjects() {
    semGale.diferenca = semGale.acertos - semGale.erros;
    somenteAteGale1.diferenca = somenteAteGale1.acertos + somenteAteGale1.acertosG1 - semGale.erros;
    somenteAteGale2.diferenca = somenteAteGale2.acertos + somenteAteGale2.acertosG1 + somenteAteGale2.acertosG2 - semGale.erros;
    somenteAteGale3.diferenca = somenteAteGale3.acertos + somenteAteGale3.acertosG1 + somenteAteGale3.acertosG2 + somenteAteGale3.acertosG3 - semGale.erros;
}

function docsArr(db, collection, limit) {
    return db
        .collection(collection)
        .orderBy("created_at", "desc").limit(limit)
        .get()
        .then(snapshot => snapshot.docs.map(x => x.data()))
}

async function updateDocs() {
    var docs = await docsArr(db, "Dados", 1);
    return db
        .collection("Dados")
        .get()
        .then(snapshot => snapshot.forEach(doc => {
            let obj = doc.data();
            db.collection("Dados").doc(doc.id).set({
                cor: obj.cor,
                numero: obj.numero,
                seed: obj.seed,
                created_at: doc.id
            })
        }
        ))
}

function assertG3(array, assertArrays) {
    assertArrays.forEach(assertArray => {
        let correct = 0;
        for (let i = 0; i < assertArray.length; i++) {
            const element = assertArray[i];
            const el = array[i];

            if (element === el.cor) {
                correct++;
            }
            else if (i === assertArray.length - 1) {
                if (array[i + 1].cor === element) {
                    somenteAteGale3.acertosG1++;
                }
                else if (array[i + 2].cor === element) {
                    somenteAteGale3.acertosG2++;
                }
                else if (array[i + 3].cor === element) {
                    somenteAteGale3.acertosG3++;
                }
                else {
                    somenteAteGale3.erros = somenteAteGale3.erros + 15;
                }
                break;
            }
            else {
                break;
            }
        }
        somenteAteGale3.acertos = assertArray.length === correct ? somenteAteGale3.acertos + 1 : somenteAteGale3.acertos;
    })
}
function assertG2(array, assertArrays) {
    assertArrays.forEach(assertArray => {
        let correct = 0;
        for (let i = 0; i < assertArray.length; i++) {
            const element = assertArray[i];
            const el = array[i];

            if (element === el.cor) {
                correct++;
            }
            else if (i === assertArray.length - 1) {
                if (array[i + 1].cor === element) {
                    somenteAteGale2.acertosG1++;
                }
                else if (array[i + 2].cor === element) {
                    somenteAteGale2.acertosG2++;
                }
                else {
                    somenteAteGale2.erros = somenteAteGale2.erros + 7;
                }
                break;
            }
            else {
                break;
            }
        }
        somenteAteGale2.acertos = assertArray.length === correct ? somenteAteGale2.acertos + 1 : somenteAteGale2.acertos;
    })
}
function assertG1(array, assertArrays) {
    assertArrays.forEach(assertArray => {
        let correct = 0;
        for (let i = 0; i < assertArray.length; i++) {
            const element = assertArray[i];
            const el = array[i];

            if (element === el.cor) {
                correct++;
            }
            else if (i === assertArray.length - 1) {
                if (array[i + 1].cor === element) {
                    somenteAteGale1.acertosG1++;
                }
                else {
                    somenteAteGale1.erros = somenteAteGale1.erros + 3;
                }
                break;
            }
            else {
                break;
            }
        }
        somenteAteGale1.acertos = assertArray.length === correct ? somenteAteGale1.acertos + 1 : somenteAteGale1.acertos;
    })
}
function assert(array, assertArrays) {
    assertArrays.forEach(assertArray => {
        let correct = 0;
        for (let i = 0; i < assertArray.length; i++) {
            const element = assertArray[i];
            const el = array[i];

            if (element === el.cor) {
                correct++;
            }
            else if (i === assertArray.length - 1) {
                semGale.erros++;
                break;
            }
            else {
                break;
            }
        }
        semGale.acertos = assertArray.length === correct ? semGale.acertos + 1 : semGale.acertos;
    })
}
//START

repeat();