import {
  OUTGOING_FETCH_SUCCESS,
  ORDER_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true,
  order: {},
  outgoing_list: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OUTGOING_FETCH_SUCCESS:
      return { ...state, outgoing_list: action.payload };
    case ORDER_FETCH_SUCCESS:
      return { ...state, order: action.payload };
    default:
      return state;
  }
};
