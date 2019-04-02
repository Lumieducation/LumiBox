export interface ITool {
    _id: string;
    name: string;
    logo_url: string;
    status: 'running' | 'stopped' | 'pending' | 'error';
}

export interface IState {
    tools: {
        list: ITool[];
    }
}