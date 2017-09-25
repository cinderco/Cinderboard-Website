const admin = require('./firebase-admin');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const port = 5000;
const host = 'localhost' || '127.0.0.1';

const router = require('./routes');

app.use('/', router);
app.listen(port, host);

console.log(`Server listening at ${host}:${port}`);
