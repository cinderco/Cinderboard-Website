import _ from 'lodash';
import firebase from 'firebase';
import {
  NOTE_UPDATE,
  NOTE_CREATE,
  NOTES_FETCH_SUCCESS,
  MESSAGES_FETCH_SUCCESS,
  EMPLOYEES_FETCH_SUCCESS,
  NOTE_SAVE_SUCCESS,
  NOTE_BEING_CREATED,
  CLEAR_NOTE_FORM
} from './types';

export const clearNoteForm = () => {
  return { type: CLEAR_NOTE_FORM };
};

export const adminEmployeesFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/users')
      .on('value', snapshot => {
        dispatch({ type: EMPLOYEES_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const noteUpdate = ({ prop, value }) => {
  return {
    type: NOTE_UPDATE,
    payload: { prop, value }
  };
};

export const noteCreate = ({ note, recipient1, recipient2, newDate, read, ampersand, adminEmployees }) => {
  const { currentUser } = firebase.auth();
  const employees = _.map(adminEmployees, (val) => {
    return val.name;
  });

  const name = currentUser.displayName;
  const date = newDate.toString();

  return (dispatch) => {
    dispatch({ type: NOTE_BEING_CREATED });
    firebase.database().ref('/data/conversations')
      .push({ note, recipient1, recipient2, date, from: name, ampersand })
      .then((message) => {
        dispatch({ type: NOTE_CREATE });
        for (let i = 0; i < employees.length; i++) {
          const nameSplit = employees[i].split(' ');
          const nameToLower = nameSplit[0].toLowerCase();
          const readProp = nameToLower + 'Read';
          firebase.database().ref(`/data/conversations/${message.path.o[2]}`)
            .update({ [readProp]: read });
        }
        firebase.database().ref(`/data/conversations/${message.path.o[2]}/messages`)
          .push({ note, date, from: name })
          .then(() => Actions.notesList({ type: 'reset' }));
      });
  };
};

export const newMessageCreate = ({ messageText, newDate, read, uid }) => {
  const note = messageText;
  const { currentUser } = firebase.auth();
  const name = currentUser.displayName;
  const date = newDate.toString();

  return (dispatch) => {
    dispatch({ type: NOTE_BEING_CREATED });
    firebase.database().ref(`/data/conversations/${uid}/messages`)
      .push({ note, date, from: name })
      .then(() => noteUpdateRead({ read, uid }));
  };
};

export const notesFetch = (uid) => {
  if (uid) {
    return (dispatch) => {
      firebase.database().ref(`/data/conversations/${uid}/messages`)
        .on('value', snapshot => {
          dispatch({ type: NOTES_FETCH_SUCCESS, payload: snapshot.val() });
        });
    };
  }
  return (dispatch) => {
    firebase.database().ref('/data/conversations')
      .on('value', snapshot => {
        dispatch({ type: NOTES_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const messagesFetch = (uid) => {
  return (dispatch) => {
    firebase.database().ref(`/data/conversations/${uid}/messages`)
      .on('value', snapshot => {
        dispatch({ type: MESSAGES_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const noteSave = ({ note, newDate, uid }) => {
  const date = newDate.toString();

  return (dispatch) => {
    firebase.database().ref(`/data/messages/${uid}`)
      .set({ note, date })
      .then(() => {
        dispatch({ type: NOTE_SAVE_SUCCESS });
      });
  };
};

export const noteUpdateRead = ({ read, uid, userRead }) => {
  return (dispatch) => {
    firebase.database().ref(`/data/conversations/${uid}/${userRead}`)
      .set(!read)
      .then(() => {
        dispatch({ type: NOTE_SAVE_SUCCESS });
      });
  };
};

export const noteDelete = ({ uid }) => {
  return () => {
    firebase.database().ref(`/data/messages/${uid}`)
      .remove()
      .then(() => {
      });
  };
};
