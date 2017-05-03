import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';
import { noteCreate } from './actions';
import LoginForm from './components/Login/LoginForm';
import Orders from './components/Orders/Orders';
import NewOrder from './components/Orders/NewOrder';


export default (
  <Route path='/'>
    <IndexRoute component={LoginForm} />
    <Route path='/orders' component={Orders} />
    <Route path='/new_order' component={NewOrder} />
  </Route>
);
