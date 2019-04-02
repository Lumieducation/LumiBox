import { IState, ITool } from './types';

export function tools(state: IState): ITool[] {
    return state.tools.list.sort();
}