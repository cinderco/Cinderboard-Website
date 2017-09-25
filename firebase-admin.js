const admin = require('firebase-admin');

const serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cinderboard-8b6b6.firebaseio.com"
});

console.log('Firebase Admin Initialized');

module.exports = admin;
