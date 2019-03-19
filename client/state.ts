import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

const root_reducer = history =>
  combineReducers({
    router: connectRouter(history)
  });

export default root_reducer;

export interface IState {}
