import { applyMiddleware, compose, createStore } from "redux";

import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";

import root_reducer from "./state";

const history = createBrowserHistory();

const store = createStore(
  root_reducer(history),
  undefined,
  compose(applyMiddleware(thunk, routerMiddleware(history)))
);

export default store;

export { history };
