import firebase from 'firebase';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import {
  OUTGOING_CREATE,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  NAME_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  LOGIN_USER
} from './types';

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const confirmPasswordChanged = (text) => {
  return {
    type: CONFIRM_PASSWORD_CHANGED,
    payload: text
  };
};

export const nameChanged = (text) => {
  return {
    type: NAME_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        loginUserSuccess(dispatch, user);
        browserHistory.push('/orders');
      })
      .catch((error) => {
        console.log(error);
        loginUserFail(dispatch);
      });
  };
};

export const signupUser = ({ email, password, name, admin }) => {
  return (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => updateUser(dispatch, user, name, admin))
      .catch(() => loginUserFail(dispatch));
  };
};

const updateUser = (dispatch, user, name, admin) => {
  return (
    firebase.database().ref(`/users/${user.uid}`)
      .set({
        isAdmin: admin, name
      })
      .then(() => {
        user.updateProfile({ displayName: name });
        dispatch({ type: OUTGOING_CREATE });
      })
  );
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

export const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

const signupUserSuccess = (dispatch, user) => {
  dispatch({
    type: SIGNUP_USER_SUCCESS,
    payload: user
  });
};

export const signOutUser = () => {
  return () => {
    firebase.auth().signOut()
      .then(() => {
        browserHistory.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getUser = () => {

}
