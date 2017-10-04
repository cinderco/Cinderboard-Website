const Expo = require('exponent-server-sdk');

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
      res.json({
          uid: userRecord.uid
      });
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    });
});

router.post('/updateUser', (req, res) => {
  admin.auth().updateUser(req.body.uid, {
    email: req.body.email,
    emailVerified: false,
    password: req.body.password,
    displayName: req.body.name,
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false
  })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully update user:', userRecord.uid);
      res.json({
          uid: userRecord.uid
      });
    })
    .catch((error) => {
      console.log('Error updating user:', error);
    });
});

router.post('/pushNotification', (req, res) => {

  // To check if something is a push token
    const isPushToken = Expo.isExponentPushToken(req.body.token);
    console.log(isPushToken);

  // Create a new Expo SDK client
    const expo = new Expo();

  // To send push notifications -- note that there is a limit on the number of
  // notifications you can send at once, use expo.chunkPushNotifications()
    expo.sendPushNotificationsAsync([{
        // The push token for the app user to whom you want to send the notification
        to: req.body.token,
        sound: 'default',
        body: req.body.message,
        data: { text: req.body.message, route: req.body.route, content: req.body.uid }
      }]);

    res.json({
      message: 'nice notifcation bro!'
    });
});

router.post('/deleteUser', (req, res) => {
    admin.auth().deleteUser(req.body.uid)
  	.then(() => {
    	  console.log("Successfully deleted user");
	  res.json({
		message: 'hello'
	  });
        })
        .catch((error) => {
    	  console.log("Error deleting user:", error);
        });
});

module.exports = router;
