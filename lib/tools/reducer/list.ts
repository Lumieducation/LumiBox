import { ITool } from '../types';
import { assign, unionBy } from 'lodash';

import * as actions from '../actions';

export default function(state: ITool[] = [], action): ITool[] {
    try {
        switch (action.type) {

            case actions.TOOLS_GET_TOOLS_SUCCESS:
                return unionBy(action.payload, state, '_id')

            case actions.TOOLS_START_TOOL_SUCCESS:

                return state.map(tool => tool._id === action.payload._id ? assign({}, tool, { status: 'running'}): tool);
           
                case actions.TOOLS_STOP_TOOL_SUCCESS:
                return state.map(tool => tool._id === action.payload._id ? assign({}, tool, { status: 'stopped'}): tool);

            case actions.TOOLS_START_TOOL_REQUEST:
            case actions.TOOLS_STOP_TOOL_REQUEST:
                return state.map(tool => tool._id === action.payload.tool_id ? assign({}, tool, { status: 'pending'}) : tool)

            default:
                return state;
        }
    } catch (error) {
        return state;
    }
}
