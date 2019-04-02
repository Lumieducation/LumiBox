import { ITool } from './types';

let _tools: ITool[] = [];

export function set_tools(tools: ITool[]) {
    _tools = tools;
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

export function start_tool(tool_id: string): Promise<ITool> {
    return new Promise((y, n) => {
        setTimeout(() => {
            y({
                _id: tool_id,
                name: 'test',
                logo_url: '',
                status: 'running'
            });
        }, 5000);
    });
}

export function stop_tool(tool_id: string): Promise<ITool> {
    return new Promise((y, n) => {
        setTimeout(() => {
            y({
                _id: tool_id,
                name: 'test',
                logo_url: '',
                status: 'stopped'
            });
        }, 5000);
    });
}
