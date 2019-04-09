export const TOOLS_GET_TOOLS_REQUEST = 'TOOLS_GET_TOOLS_REQUEST';
export const TOOLS_GET_TOOLS_SUCCESS = 'TOOLS_GET_TOOLS_SUCCESS';
export const TOOLS_GET_TOOLS_ERROR = 'TOOLS_GET_TOOLS_ERROR';

export const TOOLS_START_TOOL_REQUEST = 'TOOLS_START_TOOL_REQUEST';
export const TOOLS_START_TOOL_SUCCESS = 'TOOLS_START_TOOL_SUCCESS';
export const TOOLS_START_TOOL_ERROR = 'TOOLS_START_TOOL_ERROR';

export const TOOLS_STOP_TOOL_REQUEST = 'TOOLS_STOP_TOOL_REQUEST';
export const TOOLS_STOP_TOOL_SUCCESS = 'TOOLS_STOP_TOOL_SUCCESS';
export const TOOLS_STOP_TOOL_ERROR = 'TOOLS_STOP_TOOL_ERROR';

import * as API from './api';

export function get_tools() {
    return {
        types: [
            TOOLS_GET_TOOLS_REQUEST,
            TOOLS_GET_TOOLS_SUCCESS,
            TOOLS_GET_TOOLS_ERROR
        ],
        api: API.get_tools(),
        payload: {}
    };
}

export function start_tool(tool_id: string) {
    return {
        types: [
            TOOLS_START_TOOL_REQUEST,
            TOOLS_START_TOOL_SUCCESS,
            TOOLS_START_TOOL_ERROR
        ],
        api: API.start_tool(tool_id),
        payload: { tool_id }
    };
}

export function stop_tool(tool_id: string) {
    return {
        types: [
            TOOLS_STOP_TOOL_REQUEST,
            TOOLS_STOP_TOOL_SUCCESS,
            TOOLS_STOP_TOOL_ERROR
        ],
        api: API.stop_tool(tool_id),
        payload: { tool_id }
    };
}
