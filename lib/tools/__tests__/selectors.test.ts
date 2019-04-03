import * as selectors from '../selectors';
import { ITool, IState } from '../types';

describe('tools selectors', () => {
    it('tools() returns all tools', done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'stopped'
        };

        const state: IState = {
            tools: {
                list: [tool]
            }
        };

        const tools = selectors.tools(state);

        expect(tools).toEqual([tool]);
        done();
    });
});
