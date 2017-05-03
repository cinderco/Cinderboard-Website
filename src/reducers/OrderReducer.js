import {
  OUTGOING_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OUTGOING_FETCH_SUCCESS:
      return { ...state, outgoing_list: action.payload };
    default:
      return state;
  }
};
