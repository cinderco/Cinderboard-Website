import firebase from 'firebase';
import {
  CLIENT_CREATE,
  CLIENT_UPDATE,
  CLIENTS_FETCH_SUCCESS,
  CLIENT_SAVE_SUCCESS,
  CLEAR_CLIENT_FORM
} from './types';


export const clearClientForm = () => {
  return { type: CLEAR_CLIENT_FORM };
};

export const clientUpdate = ({ prop, value }) => {
  return {
    type: CLIENT_UPDATE,
    payload: { prop, value }
  };
};

export const clientCreate = ({
  companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long
}) => {
  const date = new Date();
  const createDate = date.toString();

  return (dispatch) => {
    firebase.database().ref('/data/clients')
      .push({ companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, createDate, lat, long })
      .then(() => {
        dispatch({ type: CLIENT_CREATE });
      });
  };
};

export const clientsFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/data/clients')
      .on('value', snapshot => {
        dispatch({ type: CLIENTS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const clientSave = ({ note, newDate, uid }) => {
  const date = newDate.toString();

  return (dispatch) => {
    firebase.database().ref(`/data/clients/${uid}`)
      .set({ note, date })
      .then(() => {
        dispatch({ type: CLIENT_SAVE_SUCCESS });
      });
  };
};


export const clientDelete = ({ uid }) => {
  return () => {
    firebase.database().ref(`/data/clients/${uid}`)
      .remove()
      .then(() => {
      });
  };
};
