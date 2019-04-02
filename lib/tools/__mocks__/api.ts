import { ITool } from '../types';

let _tools: ITool[] = [
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
];

export function set_tools(tools: ITool[]) {
    _tools = tools;
}

export function get_tools(): Promise<ITool[]> {
    return new Promise((y, n) => {
        y(_tools);
    });
}

export function start_tool(tool_id: string): Promise<ITool> {
    return new Promise((y, n) => {
        y(_tools[0]);
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
