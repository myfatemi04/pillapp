const express = require('express');
const session = require('express-session');
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyD199kDwWHtzNnTIIyWziNknWfpszKnVWA",
    authDomain: "first-22348.firebaseapp.com",
    databaseURL: "https://first-22348.firebaseio.com",
    projectId: "first-22348",
    storageBucket: "first-22348.appspot.com",
    messagingSenderId: "1080397481593",
    appId: "1:1080397481593:web:f470ce6ccce47786b6b6a8",
    measurementId: "G-959T0D5NHV"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.database();
let docref = db.collection('users').doc('myfatemi04');
let setmichael = docref.set({
    first: 'Michael',
    last: 'Fatemi',
    born: 2004
});


const sess = {
    secret: 'pillapp-secret',
    cookie: {secure: true},
    resave: false,
    saveUninitialized: true,
};

const port = process.argv[2] || 3333;
const hostname = '0.0.0.0';

const app = express();

const static_cache = {

}

app.use(express.static('static'));
app.use(session(sess));

app.get('/', (req, res) => res.sendFile('/templates/index.html', {root: __dirname}));
app.get('/patient', (req, res) => {
    if (req.session.username) {
        res.sendFile('/templates/patient_main.html', {root: __dirname});
    } else {
        res.redirect('/patient_login');
    }
});
app.get('/patient_login', (req, res) => {
    if (req.session.username) {
        res.redirect('/patient');
    } else {
        db.query("sql", (err, result) => {
            
        });

        res.redirect('/patient');
    }
});
app.post('/patient_login', (req, res) => {

});
app.get('/pharmacy', (req, res) => {
    if (req.session.pharmacy_username) {
        res.sendFile('/templates/pharmacy_main.html', {root: __dirname});
    } else {
        res.redirect("/pharmacy_login");
    }
});
app.get('/firebase_test', (req, res) => {
    res.sendFile('/templates/firebase_test.html', {root: __dirname});
});
app.listen(port, () => console.log(`Server started at ${hostname}:${port}!`));