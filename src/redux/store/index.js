import {createStore,combineReducers,applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';
import globalReducer from '../reducers/globalReducer';
import userReducer from '../reducers/userReducer';
import { reducer as formReducer } from 'redux-form';

let rootReducer = combineReducers({
	global:globalReducer,
	usersData:userReducer,
	form: formReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...[thunk])));

window.store = store;

export default store;