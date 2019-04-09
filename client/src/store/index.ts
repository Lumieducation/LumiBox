import { applyMiddleware, compose, createStore } from 'redux';

import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import apiMiddleware from './api-middleware';

import root_reducer from '../state';

declare var window: any;

const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    root_reducer(history),
    undefined,
    composeEnhancers(
        applyMiddleware(thunk, routerMiddleware(history), apiMiddleware)
    )
);

export default store;

export { history };
