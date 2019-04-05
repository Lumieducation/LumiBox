import { ITool } from './types';

let _tools: ITool[] = [];

export function set_tools(tools: ITool[]) {
    _tools = tools;
}

let _response = {};
let _fail = false;

export function set_response(fail: boolean, response: any) {
    _response = response;
    _fail = fail;
}
export function get_tools(): Promise<ITool[]> {
    return new Promise((y, n) => {
        setTimeout(() => {
            y([
                {
                    _id: 'wekan',
                    name: 'wekan',
                    logo_url: '/assets/wekan.svg',
                    status: 'running'
                },
                {
                    _id: 'test',
                    name: 'test',
                    logo_url: '',
                    status: 'stopped'
                }
            ]);
        }, 2500);
    });
}

export function start_tool(tool_id: string): Promise<boolean> {
    return new Promise((y, n) => {
        setTimeout(() => {
            y(true);
        }, 5000);
    });
}

export function stop_tool(tool_id: string): Promise<boolean> {
    return new Promise((y, n) => {
        setTimeout(() => {
            y(true);
        }, 5000);
    });
}
