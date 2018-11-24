import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const firebase = admin.initializeApp(functions.config().firebase);
const app = express();
const main = express();

main.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
main.use('/store/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

export const orderAPI = functions.https.onRequest(main);

// View all orders
app.get('/order', (req, res) => {
    return firebase.database().ref('/orders').once('value').then(function (snap) {
        res.status(200).json({ orders: snap.val() });
    });
})

// View a order
app.get('/order/:orderId', (req, res) => {
    return firebase.database().ref('/orders').child(req.params.orderId).
        once('value').then(function (snap) {
            res.status(200).json({ order: snap.val() });
        });
})

// Add new order
app.post('/order', (req, res) => {
    return firebase.database().ref('/orders').
        push(req.body).then(success => {
            res.send('Create a new order');
        })
})

// Update new order
app.patch('/order/:orderId', (req, res) => {
    return firebase.database().ref('/orders/').child(req.params.orderId).
        update(req.body).then(success => {
            res.send('Update a new order');
        })
})

// Delete a order 
app.delete('/order/:orderId', (req, res) => {
    return firebase.database().ref('/orders').child(req.params.orderId).
        remove().then(success => {
            res.send('order is deleted');
        });
})
