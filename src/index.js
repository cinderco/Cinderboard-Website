import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import routes from './routes';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

const config = {
  apiKey: 'AIzaSyABvY294twYrhWIsCuvAjjff-FkOgimug0',
  authDomain: 'manager-e7618.firebaseapp.com',
  databaseURL: 'https://manager-e7618.firebaseio.com',
  storageBucket: 'manager-e7618.appspot.com',
  messagingSenderId: '1048419770397'
};

firebase.initializeApp(config);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
  , document.querySelector('.container'));
