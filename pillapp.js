const express = require('express');
const session = require('express-session');
const admin = require('firebase-admin');
const bodyparser = require('body-parser');

let serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://first-22348.firebaseio.com"
});

let db = admin.firestore();

// let docref = db.collection('users').doc('myfatemi04');
// let setmichael = docref.set({
//     first: 'Michael',
//     last: 'Fatemi',
//     born: 2004
// });

const sess = {
    secret: 'pillapp-secret',
    cookie: {secure: false},
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
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.set('view engine', 'hbs');

// MAIN PAGE
app.get('/', (req, res) => res.sendFile('/views/index.html', {root: __dirname}));

// PATIENT PAGES
app.get('/patient', (req, res) => {
    if (req.session.patient_username) {
        res.sendFile('/views/patient_main.html', {root: __dirname});
    } else {
        res.redirect('/patient_login');
    }
});
app.get('/patient_login', (req, res) => {
    if (req.session.patient_username) {
        res.redirect('/patient');
    } else {
        res.render("patient_login");
    }
});
app.post('/patient_login', (req, res) => {
    if (!(req.body.patient_email && req.body.patient_password)) {
        res.render("patient_login", {message: "Please fill in all fields"});
    } else {
        let docref = db.collection('patients').doc(req.body.patient_email);
        docref.get().then(
            doc => {
                if (!doc.exists) {
                    res.render("patient_login", {message: "Username or password is incorrect"});
                } else {
                    if (doc.get("password") == req.body.patient_password) {
                        req.session.patient_username = req.body.patient_email;
                        req.session.save();
                        res.redirect('/patient');
                    } else {
                        res.render("patient_login", {message: "Username or password is incorrect"});
                    }
                }
            }
        ).catch(
            err => {
                console.error("Error with reading from the database!")
            }
        );
    }
});
app.get("/patient_register", (req, res) => {
    if (req.session.patient_username) {
        res.redirect('/patient');
    } else {
        res.render("patient_register");
    }
});
app.post("/patient_register", (req, res) => {
    if (!(req.body.patient_email && req.body.patient_firstname && req.body.patient_lastname && req.body.patient_password)) {
        res.render("patient_register", {message: "Please fill in all fields"});
    } else {
        let docref = db.collection('patients').doc(req.body.patient_email);
        docref.get().then(
            doc => {
                if (doc.exists) {
                    res.render("patient_login", {message: "Someone else already uses that email"});
                } else {
                    docref.set(
                        {
                            patient_username: req.body.patient_email,
                            firstname: req.body.patient_firstname,
                            lastname: req.body.patient_lastname,
                            password: req.body.patient_password
                        }
                    );
                    req.session.patient_username = req.body.patient_email;
                    req.session.save();
                    res.redirect('/patient');
                }
            }
        ).catch(
            err => {
                console.error("Error with reading from the database! ", err)
            }
        );
    }
});

// PHARMACY PAGES
app.get('/pharmacy', (req, res) => {
    if (req.session.pharmacy_username) {
        res.sendFile('/views/pharmacy_main.html', {root: __dirname});
    } else {
        res.redirect("/pharmacy_login");
    }
});
app.get('/pharmacy_login', (req, res) => {
    if (req.session.pharmacy_username) {
        res.redirect('/pharmacy');
    } else {
        res.render("pharmacy_login");
    }
});

app.post("/pharmacy_login", (req, res) => {
    if (!(req.body.pharmacy_username && req.body.pharmacy_password)) {
        res.render("pharmacy_login", {message: "Username or password is incorrect"});
    } else {
        let docref = db.collection("pharmacies").doc(req.body.pharmacy_username);
        docref.get().then(
            doc => {
                if (!doc.exists) {
                    res.render("pharmacy_login", {message: "Username or password is incorrect"});
                } else {
                    if (doc.get("password") == req.body.pharmacy_password) {
                        req.session.pharmacy_username = req.body.pharmacy_username;
                        req.session.save();
                        res.redirect("/pharmacy");
                    } else {
                        res.render("pharmacy_login", {message: "Username or password is incorrect"});
                    }
                }
            }
        )
    }
});

// LOGOUT
app.get("/logout", (req, res) => {
    delete req.session['pharmacy_username'];
    delete req.session['patient_username'];
    res.redirect("/");
});

// API PAGES
app.get("/api/orders/tracker", (req, res) => {
    if (!req.session.patient_username) {
        res.end("You aren't logged in");
    } else {
        let ordersRef = db.collection("orders");
        let queryRef = ordersRef.where('patient', '==', req.session.patient_username);
        queryRef.get().then(
            snapshot => {
                if (snapshot.empty) {
                    res.end("[]");
                } else {
                    let json_list = [];
                    snapshot.forEach(doc => {
                        let data = doc.data();
                        json_list.push({order_id: doc.id, message: data.message, address: data.address, status: data.status});
                    });
                    res.json(json_list);
                }
            }
        ).catch(
            err => {
                console.error("Error during order tracker:", err);
                res.end("[]");
            }
        );
    }
});

app.post("/api/orders/request", (req, res) => {
    if (!req.session.patient_username) {
        res.end("You aren't logged in");
    } else {
        let message = req.body.message;
        let address = req.body.address;
        let pharmacy = req.body.pharmacy;
    
        if (!message || !address) {
            res.end("Please fill in all fields");
        } else {
            let docadd = db.collection("orders").add({
                message: message,
                address: address,
                pharmacy: pharmacy,
                patient: req.session.patient_username,
                status: "pending"
            }).then(
                (doc) => { res.end("Successfully sent the request!"); }
            );
        }
    }
});

app.get("/api/orders/list", (req, res) => {
    if (!req.session.pharmacy_username) {
        res.end("You aren't logged in");
    } else {
        let ordersRef = db.collection("orders");
        let queryRef = ordersRef.where('pharmacy', '==', req.session.pharmacy_username);
        queryRef.get().then(
            snapshot => {
                if (snapshot.empty) {
                    res.end("[]");
                } else {
                    let json_list = [];
                    snapshot.forEach(doc => {
                        let data = doc.data();
                        json_list.push({order_id: doc.id, patient: data.patient, message: data.message, address: data.address, status: data.status});
                    });
                    res.json(json_list);
                }
            }
        ).catch(
            err => {
                console.error("Error during order tracker:", err);
                res.end("[]");
            }
        );
    }
});

app.post("/api/orders/set_status", (req, res) => {
    if (!req.session.pharmacy_username) {
        res.end("You aren't logged in");
    } else {
        let order_id = req.body.order_id;
        let new_status = req.body.status;

        let docref = db.collection("orders").doc(order_id);
        docref.update(
            {
                status: new_status
            }
        ).then(
            () => res.end("Updated the status successfully")
        ).catch(
            err => {
                console.error("Error when updating order status!", err);
                res.end("Error when updating status");
            }
        );
    }
});

// start the server
app.listen(port, () => console.log(`Server started at ${hostname}:${port}!`));