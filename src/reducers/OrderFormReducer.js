import {
  ORDER_UPDATE,
  OUTGOING_CREATE,
  OUTGOING_CREATE_ERROR,
  OUTGOING_SAVE_SUCCESS,
  INCOMING_CREATE,
  INCOMING_SAVE_SUCCESS,
  SHOW_MODAL_CHANGE,
  OUTGOING_ARCHIVE,
  CLEAR_FORM
} from '../actions/types';

const INITIAL_STATE = {
  companyName: '',
  type: '',
  newDate: '',
  orderCreateError: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case OUTGOING_CREATE:
      return INITIAL_STATE;
    case OUTGOING_CREATE_ERROR:
      return { ...state, orderCreateError: 'Please fill in empty field' };
    case OUTGOING_ARCHIVE:
      return INITIAL_STATE;
    case OUTGOING_SAVE_SUCCESS:
      return INITIAL_STATE;
    case INCOMING_CREATE:
      return INITIAL_STATE;
    case INCOMING_SAVE_SUCCESS:
      return INITIAL_STATE;
    case CLEAR_FORM:
      return { ...INITIAL_STATE, orderType: action.payload.orderType };
    case SHOW_MODAL_CHANGE:
      return { ...state, showModal: action.payload.showModal };
    default:
    return state;
  }
};
