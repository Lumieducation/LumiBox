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

        api.set_response(false, tools);

        const expectedActions = [
            { type: actions.TOOLS_GET_TOOLS_REQUEST },
            { type: actions.TOOLS_GET_TOOLS_SUCCESS, response: tools }
        ];

        const store = mockStore();

        return store.dispatch(actions.get_tools()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(api_get_tools).toBeCalledTimes(1);
            done();
        });
    });

    it('handles an error', done => {
        const response = { message: 'error' };
        api.set_response(true, response);

        const expectedActions = [
            { type: actions.TOOLS_GET_TOOLS_REQUEST },
            { type: actions.TOOLS_GET_TOOLS_ERROR, response }
        ];

        const store = mockStore();

        return store.dispatch(actions.get_tools()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(api_get_tools).toBeCalledTimes(1);
            done();
        });
    });
});

describe('start_tool(tool_id: string)', () => {
    const api_start_tool = jest.spyOn(api, 'start_tool');

    afterEach(() => {
        api_start_tool.mockClear();
    });

    it('starts a tool: ', done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'stopped'
        };
        const response = true;
        api.set_response(false, response);

        const expectedActions = [
            {
                type: actions.TOOLS_START_TOOL_REQUEST,
                tool_id: tool._id
            },
            {
                response,
                type: actions.TOOLS_START_TOOL_SUCCESS,
                tool_id: tool._id
            }
        ];

        const store = mockStore();

        return store.dispatch(actions.start_tool(tool._id)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(api_start_tool).toBeCalledTimes(1);
            done();
        });
    });

    it('handles an error ', done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'stopped'
        };
        const response = { message: 'error' };
        api.set_response(true, response);

        const expectedActions = [
            {
                type: actions.TOOLS_START_TOOL_REQUEST,
                tool_id: tool._id
            },
            {
                response,
                type: actions.TOOLS_START_TOOL_ERROR,
                tool_id: tool._id
            }
        ];

        const store = mockStore();

        return store.dispatch(actions.start_tool(tool._id)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(api_start_tool).toBeCalledTimes(1);
            done();
        });
    });
});

describe('stop_tool(tool_id: string)', () => {
    const api_stop_tool = jest.spyOn(api, 'stop_tool');

    afterEach(() => {
        api_stop_tool.mockClear();
    });

    it('stops a tool: ', done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'stopped'
        };
        const response = true;
        api.set_response(false, response);

        const expectedActions = [
            {
                type: actions.TOOLS_STOP_TOOL_REQUEST,
                tool_id: tool._id
            },
            {
                response,
                type: actions.TOOLS_STOP_TOOL_SUCCESS,
                tool_id: tool._id
            }
        ];

        const store = mockStore();

        return store.dispatch(actions.stop_tool(tool._id)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(api_stop_tool).toBeCalledTimes(1);
            done();
        });
    });

    it('handles an error ', done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'stopped'
        };
        const response = { message: 'error' };
        api.set_response(true, response);

        const expectedActions = [
            {
                type: actions.TOOLS_STOP_TOOL_REQUEST,
                tool_id: tool._id
            },
            {
                response,
                type: actions.TOOLS_STOP_TOOL_ERROR,
                tool_id: tool._id
            }
        ];

        const store = mockStore();

        return store.dispatch(actions.stop_tool(tool._id)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(api_stop_tool).toBeCalledTimes(1);
            done();
        });
    });
});
