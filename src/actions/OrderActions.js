import firebase from 'firebase';
import {
  ORDER_UPDATE,
  OUTGOING_CREATE,
  OUTGOING_CREATE_ERROR,
  OUTGOING_ARCHIVE,
  INCOMING_CREATE,
  OUTGOING_FETCH_SUCCESS,
  ARCHIVED_FETCH_SUCCESS,
  INCOMING_FETCH_SUCCESS,
  OUTGOING_SAVE_SUCCESS,
  INCOMING_SAVE_SUCCESS,
  SHOW_MODAL_CHANGE,
  TOGGLE_SIDE_MENU,
  CLEAR_FORM
} from './types';

export const clearForm = (orderType) => {
  return {
    type: CLEAR_FORM,
    payload: { orderType }
   };
};

export const showModalChange = (showModal) => {
  return {
    type: SHOW_MODAL_CHANGE,
    payload: { showModal: !showModal }
  };
};

export const toggleSideMenu = (isOpen) => {
  if (isOpen !== undefined) {
    return {
      type: TOGGLE_SIDE_MENU,
      payload: { isOpen: !isOpen }
    };
  }
  return {
    type: TOGGLE_SIDE_MENU,
    payload: { isOpen: false }
  };
};

export const orderUpdate = ({ prop, value }) => {
  return {
    type: ORDER_UPDATE,
    payload: { prop, value }
  };
};

export const outgoingCreate = ({ companyName, type, newDate, other }) => {
  const date = newDate.toString();

    return (dispatch) => {
      firebase.database().ref('/data/outgoing_orders')
        .push({
          companyName, type, date, other, orderType: 'outgoing', status: 'processing'
        })
        .then(() => {
          dispatch({ type: OUTGOING_CREATE });
        });
    };
};

export const incomingCreate = ({ companyName, type, newDate }) => {
  const date = newDate.toString();

  return (dispatch) => {
    firebase.database().ref('/data/incoming_orders')
      .push({ companyName, type, date, orderType: 'incoming' })
      .then(() => {
        dispatch({ type: INCOMING_CREATE });
      });
  };
};

export const outgoingArchive = ({ companyName, type, date, other }) => {
  return (dispatch) => {
    firebase.database().ref('/data/archived_orders')
      .push({ companyName, type, date, other, orderType: 'outgoing' })
      .then(() => {
        dispatch({ type: OUTGOING_ARCHIVE });
      });
  };
};

export const outgoingFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/data/outgoing_orders')
      .on('value', snapshot => {
        dispatch({ type: OUTGOING_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const archivedFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/data/archived_orders')
      .on('value', snapshot => {
        dispatch({ type: ARCHIVED_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const incomingFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/data/incoming_orders')
      .on('value', snapshot => {
        dispatch({ type: INCOMING_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const outgoingSave = ({ companyName, type, newDate, other, ready, complete, uid }) => {
  const date = newDate.toString();

  return (dispatch) => {
    firebase.database().ref(`/data/outgoing_orders/${uid}`)
      .update({ companyName, type, date, other, orderType: 'outgoing', ready, complete })
      .then(() => {
        dispatch({ type: OUTGOING_SAVE_SUCCESS });
      });
  };
};

export const setOrderStatusReady = ({ ready, uid }) => {
  return () => {
    firebase.database().ref(`/data/outgoing_orders/${uid}/ready`)
      .set(ready);
  };
};

export const setOrderStatusComplete = ({ complete, uid }) => {
  return () => {
    firebase.database().ref(`/data/outgoing_orders/${uid}/complete`)
      .set(complete);
  };
};

export const incomingSave = ({ type, newDate, uid }) => {
  const date = newDate.toString();

  return (dispatch) => {
    firebase.database().ref(`/data/incoming_orders/${uid}`)
      .set({ type, date, orderType: 'incoming' })
      .then(() => {
        dispatch({ type: INCOMING_SAVE_SUCCESS });
      });
  };
};

export const outgoingDelete = ({ uid }) => {
  return () => {
    firebase.database().ref(`/data/outgoing_orders/${uid}`)
      .remove();
  };
};

export const incomingDelete = ({ uid }) => {
  return () => {
    firebase.database().ref(`/data/incoming_orders/${uid}`)
      .remove()
      .then(() => {
      });
  };
};
