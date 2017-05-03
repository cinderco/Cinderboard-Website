import {
  CLEAR_CLIENT_FORM,
  CLIENT_UPDATE,
  CLIENT_CREATE,
  CLIENT_SAVE_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  companyName: '',
  contact: '',
  jobTitle: '',
  phone: '',
  email: '',
  address: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLIENT_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case CLIENT_CREATE:
      return INITIAL_STATE;
    case CLIENT_SAVE_SUCCESS:
      return INITIAL_STATE;
    case CLEAR_CLIENT_FORM:
      return INITIAL_STATE;
    default:
    return state;
  }
};
