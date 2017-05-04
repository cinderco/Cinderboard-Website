import React from 'react';
import { Route, IndexRoute } from 'react-router';
import LoginForm from './components/Login/LoginForm';
import Orders from './components/Orders/Orders';
import NewOrder from './components/Orders/NewOrder';
import Messages from './components/Messages/messages';
import HomeContainer from './components/common/HomeContainer';


export default (
  <Route path='/'>
    <IndexRoute component={LoginForm} />
    <Route path='/home' component={HomeContainer}>
      <IndexRoute path='/orders' component={Orders} />
      <Route path='/new_order' component={NewOrder} />
      <Route path='/messages' component={Messages} />
    </Route>
  </Route>
);
