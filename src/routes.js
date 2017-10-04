import React from 'react';
import { Route, IndexRoute } from 'react-router';
import LoginForm from './components/Login/LoginForm';
import Orders from './components/Orders/Orders';
import DisplayOrder from './components/Orders/DisplayOrder';
import NewOrder from './components/Orders/NewOrder';
import Messages from './components/Messages/messages';
import HomeContainer from './components/common/HomeContainer';
import PrivacyPolicy from './components/PrivacyPolicy';

export default (
  <Route path='/'>
    <IndexRoute component={LoginForm} />
    <Route path='/home' component={HomeContainer}>
      <IndexRoute component={Orders} />
      <Route path='/order' component={DisplayOrder} />
    </Route>
    <Route path='/privacy_policy' component={PrivacyPolicy} />
  </Route>
);
