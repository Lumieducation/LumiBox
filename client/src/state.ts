import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import * as Tools from 'lib/tools';


const root_reducer = history =>
  combineReducers({
    router: connectRouter(history),
    tools: Tools.reducer
  });

export default root_reducer;

export interface IState extends Tools.types.IState {}
