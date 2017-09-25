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
    apiKey: "AIzaSyCIlLAH8ggLIQ0_nYgwymbQ8sBWVU3_gW0",
      authDomain: "cinderboard-8b6b6.firebaseapp.com",
      databaseURL: "https://cinderboard-8b6b6.firebaseio.com",
      projectId: "cinderboard-8b6b6",
      storageBucket: "cinderboard-8b6b6.appspot.com",
      messagingSenderId: "807753427618"
};

firebase.initializeApp(config);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
  , document.querySelector('.mainContainer'));
