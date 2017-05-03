const express = require('express');

const router = express.Router();
const admin = require('./firebase-admin');

const firebaseMiddleware = require('express-firebase-middleware');

router.use((req, res, next) => {
    next();
});

router.use('/api', firebaseMiddleware.auth);

router.get('/', (req, res) => {
  console.log('reaching api');
    res.json({
        message: 'hey bro dawg'
    });
});

router.get('/api/hello', (req, res) => {
    res.json({
        message: `You're logged in as ${res.locals.user.email} with Firebase UID: ${res.locals.user.uid}`
    });
});

router.post('/newUser', (req, res) => {
  console.log(req.body);
  admin.auth().createUser({
    email: req.body.email,
    emailVerified: false,
    password: req.body.password,
    displayName: req.body.name,
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false
  })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    });

    res.json({
        message: 'hey bro!!'
    });
});


module.exports = router;
