import { ITool } from '../types';

let _response = {};
let _fail: boolean;

export function set_response(fail: boolean, response: any) {
    _response = response;
    _fail = fail;
}

export function get_tools(): Promise<ITool[]> {
    return new Promise((y, n) => {
        _fail ? n(_response) : y(_response as ITool[]);
    });
}

export function start_tool(tool_id: string): Promise<ITool> {
    return new Promise((y, n) => {
        _fail ? n(_response) : y(_response as ITool);
    });
}

export function stop_tool(tool_id: string): Promise<ITool> {
    return new Promise((y, n) => {
        _fail ? n(_response) : y(_response as ITool);
    });
}
