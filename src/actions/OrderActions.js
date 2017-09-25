import moment from 'moment';
import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import { browserHistory, Link, history } from 'react-router';
import {
  ORDER_UPDATE,
  OUTGOING_CREATE,
  OUTGOING_ARCHIVE,
  INCOMING_CREATE,
  OUTGOING_FETCH_SUCCESS,
  ALL_ARCHIVED_FETCH_SUCCESS,
  ARCHIVED_FETCH_SUCCESS,
  INCOMING_FETCH_SUCCESS,
  OUTGOING_SAVE_SUCCESS,
  ORDER_FETCH_SUCCESS,
  INCOMING_SAVE_SUCCESS,
  LOG_FETCH_SUCCESS,
  SHOW_MODAL_CHANGE,
  TOGGLE_SIDE_MENU,
  INITIATE_SAVE,
  INITIATE_DELETE,
  DELETE_SUCCESS,
  SET_IS_OPEN,
  LOADING_LOG,
  CLEAR_FORM
} from './types';

export const setIsOpen = (isOpen) => {
  return {
    type: SET_IS_OPEN,
    payload: { isOpen: !isOpen }
  };
};

export const clearForm = (orderType) => {
  return {
    type: CLEAR_FORM,
    payload: { orderType }
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

export const outgoingCreate = ({ companyName, type, newDate, other, setModalVisible }) => {
  const { currentUser } = firebase.auth();
  const logTime = moment().format('LT');
  const logDate = moment().format('LL');
  const name = currentUser.displayName;

  if (newDate === 'Unknown') {
    const date = 'Unknown';

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref('/data/outgoing_orders')
        .push({
          companyName, type, date, other, orderType: 'outgoing', createdBy: name, createDate: logDate, status: 'new'
        })
        .then((order) => {
          firebase.database().ref(`/data/outgoing_orders/${order.path.o[2]}/log`)
            .push({ log: 'created order', logDate, logTime, createdBy: name });
          dispatch({ type: OUTGOING_CREATE });
          setModalVisible(false, 'three');
        });

        firebase.database().ref('/users')
          .once('value', snapshot => {
            const employees = _.map(snapshot.val(), (val, uid) => {
              return { ...val, uid };
            });

            const tokens = _.map(employees, (val) => {
              return val.token;
            });

            for (let i = 0; i < tokens.length; i++) {
              const config = {
                headers: {
                  "accept": "application/json",
                  "content-type": "application/json"
                }
              };

              axios.post('https://cinderboard.com/pushNotification',
                {
                  "token": `${tokens[i]}`,
                  "message": `New outgoing order created!`
                },
                config
              );
            }
          });
    };
  } else {
    const date = moment(newDate).format('l');

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref('/data/outgoing_orders')
        .push({
          companyName, type, date, other, orderType: 'outgoing', createdBy: name, createDate: logDate, status: 'new'
        })
        .then((order) => {
          firebase.database().ref(`/data/outgoing_orders/${order.path.o[2]}/log`)
            .push({ log: 'created order', logDate, logTime, createdBy: name });
          dispatch({ type: OUTGOING_CREATE });
          setModalVisible(false, 'three');
        });

        firebase.database().ref('/users')
          .once('value', snapshot => {
            const employees = _.map(snapshot.val(), (val, uid) => {
              return { ...val, uid };
            });

            const tokens = _.map(employees, (val) => {
              return val.token;
            });

            for (let i = 0; i < tokens.length; i++) {
              const config = {
                headers: {
                  "accept": "application/json",
                  "content-type": "application/json"
                }
              };

              axios.post('https://cinderboard.com/pushNotification',
                {
                  "token": `${tokens[i]}`,
                  "message": `New outgoing order created!`
                },
                config
              );
            }
          });
    };
  }
};

export const incomingCreate = ({ companyName, type, newDate, setModalVisible }) => {
  const { currentUser } = firebase.auth();
  const logTime = moment().format('LT');
  const logDate = moment().format('LL');
  const name = currentUser.displayName;

  if (newDate === 'Unknown') {
    const date = 'Unknown';

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref('/data/incoming_orders')
        .push({ companyName, type, date, orderType: 'incoming', createdBy: name, createDate: logDate, status: 'In Transit' })
          .then((order) => {
            firebase.database().ref(`/data/incoming_orders/${order.path.o[2]}/log`)
              .push({ log: 'created order', logDate, logTime, createdBy: name });
            dispatch({ type: INCOMING_CREATE });
            setModalVisible(false, 'three');
          });

        firebase.database().ref('/users')
          .once('value', snapshot => {
            const employees = _.map(snapshot.val(), (val, uid) => {
              return { ...val, uid };
            });

            const tokens = _.map(employees, (val) => {
              return val.token;
            });

            for (let i = 0; i < tokens.length; i++) {
              const config = {
                headers: {
                  "accept": "application/json",
                  "content-type": "application/json"
                }
              };

              axios.post('https://cinderboard.com/pushNotification',
                {
                  "token": `${tokens[i]}`,
                  "message": `New incoming order created!`
                },
                config
              );
            }
          });
    };
  } else {
    const date = moment(newDate).format('l');

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref('/data/incoming_orders')
        .push({ companyName, type, date, orderType: 'incoming', createdBy: name, createDate: logDate, status: 'In Transit' })
          .then((order) => {
            firebase.database().ref(`/data/incoming_orders/${order.path.o[2]}/log`)
              .push({ log: 'created order', logDate, logTime, createdBy: name });
            dispatch({ type: INCOMING_CREATE });
            setModalVisible(false, 'three');
          });

        firebase.database().ref('/users')
          .once('value', snapshot => {
            const employees = _.map(snapshot.val(), (val, uid) => {
              return { ...val, uid };
            });

            const tokens = _.map(employees, (val) => {
              return val.token;
            });

            for (let i = 0; i < tokens.length; i++) {
              const config = {
                headers: {
                  "accept": "application/json",
                  "content-type": "application/json"
                }
              };

              axios.post('https://cinderboard.com/pushNotification',
                {
                  "token": `${tokens[i]}`,
                  "message": `New incoming order created!`
                },
                config
              );
            }
          });
    };
  }
};

export const outgoingArchive = ({ uid }) => {
  console.log("OUTOING ARCHIVE", uid);

  const newDate = new Date();
  const archiveDate = newDate.toLocaleDateString();

  return (dispatch) => {
    firebase.database().ref(`/data/outgoing_orders/${uid}`)
      .once('value', snapshot => {
        const { companyName, createDate, createdBy, date, log, orderType, other, status, type } = snapshot.val();

        firebase.database().ref('/data/archived_orders')
          .push({ companyName, createDate, createdBy, date, log, orderType, other, status, type, archiveDate })
          .then(() => {
            dispatch({ type: OUTGOING_ARCHIVE });

            firebase.database().ref(`/data/outgoing_orders/${uid}`)
              .remove()
              .then(() => {
                browserHistory.push('/home');
              });
          });
      });
  };
};

export const incomingArchive = ({ uid }) => {
  const newDate = new Date();
  const archiveDate = newDate.toLocaleDateString();

  return (dispatch) => {
    firebase.database().ref(`/data/incoming_orders/${uid}`)
      .once('value', snapshot => {
        const { companyName, createDate, createdBy, date, orderType, status, type } = snapshot.val();

        firebase.database().ref('/data/archived_orders')
          .push({ companyName, createDate, createdBy, date, orderType, status, type, archiveDate })
          .then(() => {
            dispatch({ type: OUTGOING_ARCHIVE });

            firebase.database().ref(`/data/incoming_orders/${uid}`)
              .remove()
              .then(() => {
                browserHistory.push('/home');
              });
          });
      });
  };
};

export const orderFetch = ({ uid, type }) => {
  console.log("IN ORDER FETCH", uid);

  return (dispatch) => {
    firebase.database().ref(`/data/${type}/${uid}`)
      .on('value', snapshot => {
        console.log('order fetched', snapshot.val());
        dispatch({ type: ORDER_FETCH_SUCCESS, payload: { ...snapshot.val(), uid } });
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

export const logFetch = ({ uid, logType }) => {
  return (dispatch) => {
    dispatch({ type: LOADING_LOG });
    firebase.database().ref(`/data/${logType}/${uid}/log`)
      .on('value', snapshot => {
        dispatch({ type: LOG_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const archivedFetch = (startDate, endDate) => {
  return (dispatch) => {
    firebase.database().ref('/data/archived_orders')
      .on('value', snapshot => {
        if (startDate === null || endDate === null) {
          dispatch({ type: ALL_ARCHIVED_FETCH_SUCCESS, payload: snapshot.val() });
        }
        else if (snapshot.val().length === 0) {
          dispatch({ type: ARCHIVED_FETCH_SUCCESS, payload: snapshot.val() });
        } else {
          const start = moment(startDate).format('x');
          const end = moment(endDate).format('x');

          const mappedDate = _.map(snapshot.val(), (val, uid) => {
            let orig = val;
            orig['uid'] = uid

            return orig;
          });

          const filteredDate = _.filter(mappedDate, (val) => {
            const date = moment(val.archiveDate).format('x');

            return date >= start && date <= end;
          });

          if (filteredDate.length === 0) {
            dispatch({ type: ARCHIVED_FETCH_SUCCESS, payload: 'no results' });
          } else {
            dispatch({ type: ARCHIVED_FETCH_SUCCESS, payload: filteredDate });
          }
        }
      })
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

export const outgoingSave = ({ companyName, type, newDate, other, status, uid, createDate, changed, createdBy, savingOrder }) => {
  console.log('Test new DAte Test: ', newDate);

  const { currentUser } = firebase.auth();
  const logTime = moment().format('LT');
  const logDate = moment().format('LL');
  const name = currentUser.displayName;

  if (newDate === 'Unknown') {
    const date = newDate;

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref(`/data/outgoing_orders/${uid}`)
        .update({ companyName, type, date, other, orderType: 'outgoing', status, createdBy })
        .then(() => {
          if (changed.length <= 1) {
            dispatch({ type: OUTGOING_SAVE_SUCCESS });
            savingOrder();
          } else {
            firebase.database().ref(`/data/outgoing_orders/${uid}/log`)
              .push({ log: changed, logDate, logTime, createdBy: name })
                .then(() => {
                  dispatch({ type: OUTGOING_SAVE_SUCCESS });
                  savingOrder();

                  firebase.database().ref('/users')
                    .once('value', snapshot => {
                      const employees = _.map(snapshot.val(), (val, uid) => {
                        return { ...val, uid };
                      });

                      const tokens = _.map(employees, (val) => {
                        return val.token;
                      });

                      for (let i = 0; i < tokens.length; i++) {
                        const config = {
                          headers: {
                            "accept": "application/json",
                            "content-type": "application/json"
                          }
                        };

                        axios.post('https://cinderboard.com/pushNotification',
                          {
                            "token": `${tokens[i]}`,
                            "message": `${companyName} order has been changed.`
                          },
                          config
                        );
                      }
                    });
                });
          }
        });
    };
  } else {
    const date = moment(newDate).format('l');

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref(`/data/outgoing_orders/${uid}`)
        .update({ companyName, type, date, other, orderType: 'outgoing', status, createdBy })
        .then(() => {
          if (changed.length <= 1) {
            dispatch({ type: OUTGOING_SAVE_SUCCESS });
            savingOrder();
          } else {
            firebase.database().ref(`/data/outgoing_orders/${uid}/log`)
              .push({ log: changed, logDate, logTime, createdBy: name })
                .then(() => {
                  dispatch({ type: OUTGOING_SAVE_SUCCESS });
                  savingOrder();

                  firebase.database().ref('/users')
                    .once('value', snapshot => {
                      const employees = _.map(snapshot.val(), (val, uid) => {
                        return { ...val, uid };
                      });

                      const tokens = _.map(employees, (val) => {
                        return val.token;
                      });

                      for (let i = 0; i < tokens.length; i++) {
                        const config = {
                          headers: {
                            "accept": "application/json",
                            "content-type": "application/json"
                          }
                        };

                        axios.post('https://cinderboard.com/pushNotification',
                          {
                            "token": `${tokens[i]}`,
                            "message": `${companyName} order has been changed.`
                          },
                          config
                        );
                      }
                    });
                });
          }
        });
    };
  }
};

export const setOrderStatus = ({ orderStatus, uid, company, log, orderType }) => {
  const { currentUser } = firebase.auth();
  const name = currentUser.displayName;
  const logTime = moment().format('LT');
  const logDate = moment().format('LL');

  return () => {
    firebase.database().ref(`/data/${orderType}/${uid}/status`)
      .set(orderStatus)
      .then(() => {
        firebase.database().ref(`/data/${orderType}/${uid}/log`)
          .push({ log, logDate, logTime, createdBy: name })
          .then(() => {
            firebase.database().ref('/users')
              .once('value', snapshot => {
                const employees = _.map(snapshot.val(), (val, id) => {
                  return { ...val, uid: id };
                });

                const tokens = _.map(employees, (val) => {
                  if (val.uid !== currentUser.uid) {
                    return val.token;
                  }
                  return;
                });

                for (let i = 0; i < tokens.length; i++) {
                  const config = {
                    headers: {
                      "accept": "application/json",
                      "content-type": "application/json"
                    }
                  };

                  if (orderStatus === 'processing') {
                    axios.post('https://cinderboard.com/pushNotification',
                      {
                        "token": `${tokens[i]}`,
                        "message": `${company} order has been set to ${orderStatus}`
                      },
                      config
                    );
                  } else if (orderStatus === 'ready') {
                    axios.post('https://cinderboard.com/pushNotification',
                      {
                        "token": `${tokens[i]}`,
                        "message": `${company} order is ready!`
                      },
                      config
                    );
                  } else if (orderStatus === 'complete') {
                    axios.post('https://cinderboard.com/pushNotification',
                      {
                        "token": `${tokens[i]}`,
                        "message": `${company} order has been completed!`
                      },
                      config
                    );
                  } else if (orderStatus === 'Received') {
                    axios.post('https://cinderboard.com/pushNotification',
                      {
                        "token": `${tokens[i]}`,
                        "message": `${company} order has been received!`
                      },
                      config
                    );
                  }
                }
              });
          })
      });
  };
};

export const incomingSave = ({ companyName, type, newDate, status, uid, createDate, changed, createdBy, savingOrder }) => {
  console.log('Test new DAte Test: ', newDate);

  const { currentUser } = firebase.auth();
  const logTime = moment().format('LT');
  const logDate = moment().format('LL');
  const name = currentUser.displayName;

  if (newDate === 'Unknown') {
    const date = newDate;

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref(`/data/incoming_orders/${uid}`)
        .update({ companyName, type, date, orderType: 'incoming', status, createdBy })
        .then(() => {
          if (changed.length <= 1) {
            dispatch({ type: OUTGOING_SAVE_SUCCESS });
            savingOrder();
          } else {
            firebase.database().ref(`/data/incoming_orders/${uid}/log`)
              .push({ log: changed, logDate, logTime, createdBy: name })
                .then(() => {
                  dispatch({ type: OUTGOING_SAVE_SUCCESS });
                  savingOrder();

                  firebase.database().ref('/users')
                    .once('value', snapshot => {
                      const employees = _.map(snapshot.val(), (val, uid) => {
                        return { ...val, uid };
                      });

                      const tokens = _.map(employees, (val) => {
                        return val.token;
                      });

                      for (let i = 0; i < tokens.length; i++) {
                        const config = {
                          headers: {
                            "accept": "application/json",
                            "content-type": "application/json"
                          }
                        };

                        axios.post('https://cinderboard.com/pushNotification',
                          {
                            "token": `${tokens[i]}`,
                            "message": `${companyName} order has been changed.`
                          },
                          config
                        );
                      }
                    });
                });
          }
        });
    };
  } else {
    const date = moment(newDate).format('l');

    return (dispatch) => {
      dispatch({ type: INITIATE_SAVE });

      firebase.database().ref(`/data/incoming_orders/${uid}`)
        .update({ companyName, type, date, orderType: 'incoming', status, createdBy })
        .then(() => {
          if (changed.length <= 1) {
            dispatch({ type: OUTGOING_SAVE_SUCCESS });
            savingOrder();
          } else {
            firebase.database().ref(`/data/incoming_orders/${uid}/log`)
              .push({ log: changed, logDate, logTime, createdBy: name })
                .then(() => {
                  dispatch({ type: OUTGOING_SAVE_SUCCESS });
                  savingOrder();

                  firebase.database().ref('/users')
                    .once('value', snapshot => {
                      const employees = _.map(snapshot.val(), (val, uid) => {
                        return { ...val, uid };
                      });

                      const tokens = _.map(employees, (val) => {
                        return val.token;
                      });

                      for (let i = 0; i < tokens.length; i++) {
                        const config = {
                          headers: {
                            "accept": "application/json",
                            "content-type": "application/json"
                          }
                        };

                        axios.post('https://cinderboard.com/pushNotification',
                          {
                            "token": `${tokens[i]}`,
                            "message": `${companyName} order has been changed.`
                          },
                          config
                        );
                      }
                    });
                });
          }
        });
    };
  }
};

export const outgoingDelete = ({ uid, closeModal }) => {
  return (dispatch) => {
    if (closeModal) {
      firebase.database().ref(`/data/outgoing_orders/${uid}`)
        .remove()
        .then(() => {
          browserHistory.push('/home');
        });
    } else {
      firebase.database().ref(`/data/outgoing_orders/${uid}`)
        .remove()
        .then(() => {
          browserHistory.push('/home');
        });
    }
  };
};

export const incomingDelete = ({ uid, closeModal }) => {
  return (dispatch) => {
    if (closeModal) {
      firebase.database().ref(`/data/incoming_orders/${uid}`)
        .remove()
        .then(() => {
          browserHistory.push('/home');
        });
    } else {
      firebase.database().ref(`/data/incoming_orders/${uid}`)
        .remove()
        .then(() => {
          browserHistory.push('/home');
        });
    }
  };
};

export const restoreOrder = ({ type, uid, setModalVisible }) => {
  return (dispatch) => {
    firebase.database().ref(`/data/archived_orders/${uid}`)
      .once('value', snapshot => {
        firebase.database().ref(`/data/${type}_orders`)
          .push(snapshot.val())
          .then(() => {
            firebase.database().ref(`/data/archived_orders/${uid}`)
            .remove()
            .then(() => setModalVisible(false))
          });
      });
  };
}

