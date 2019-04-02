import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import api_middleware from '../../../client/store/api-middleware';

import * as actions from '../actions';
import * as api from '../api';
import { ITool } from '../types';

const middlewares = [thunk, api_middleware];
const mockStore = configureMockStore(middlewares);

jest.mock('../api');

describe('get_tools', () => {
    const api_get_tools = jest.spyOn(api, 'get_tools');

    afterEach(() => {
        api_get_tools.mockClear();
        api.set_tools([]);
    });

    it('gets all tools from api: ', done => {
        const tools: ITool[] = [
            {
                _id: 'test',
                name: 'test',
                logo_url: '',
                status: 'stopped'
            }
        ];

        api.set_tools(tools);

        const expectedActions = [
            { type: actions.TOOLS_GET_TOOLS_REQUEST, payload: {} },
            { type: actions.TOOLS_GET_TOOLS_SUCCESS, payload: tools }
        ];

        const store = mockStore();

        return store.dispatch(actions.get_tools()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(api_get_tools).toBeCalledTimes(1);
            done();
        });
    });
});
