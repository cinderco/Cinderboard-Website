import {
  ARCHIVED_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ARCHIVED_FETCH_SUCCESS:
      return { ...state, archived_list: action.payload, loading: false };
    default:
      return state;
  }
};
