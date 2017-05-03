import {
  CLIENTS_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLIENTS_FETCH_SUCCESS:
      return { ...state, client_list: action.payload, loading: false };
    default:
      return state;
  }
};
