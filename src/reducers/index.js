import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import AuthReducer from './AuthReducer';
import OrderFormReducer from './OrderFormReducer';
import OrderReducer from './OrderReducer';
import NoteFormReducer from './NoteFormReducer';
import NoteReducer from './NoteReducer';
import IncomingReducer from './IncomingReducer';
import ArchivedReducer from './ArchivedReducer';
import ClientFormReducer from './ClientFormReducer';
import ClientReducer from './ClientReducer';
import SideMenuReducer from './SideMenuReducer';
import EmployeeReducer from './EmployeeReducer';
import LogReducer from './LogReducer';

export default combineReducers({
  auth: AuthReducer,
  clientForm: ClientFormReducer,
  clients: ClientReducer,
  orderForm: OrderFormReducer,
  orders: OrderReducer,
  incomingOrders: IncomingReducer,
  archivedOrders: ArchivedReducer,
  noteForm: NoteFormReducer,
  messages: NoteReducer,
  sideMenu: SideMenuReducer,
  orderLog: LogReducer,
  admin: EmployeeReducer,
  form: formReducer
});
