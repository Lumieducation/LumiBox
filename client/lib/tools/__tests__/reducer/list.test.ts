import reducer from '../../reducer/list';
import * as actions from '../../actions';
import { ITool } from '../../types';

describe('tools list-reducer', () => {
    it('should default to an empty object', done => {
        const state = reducer(undefined, {
            type: 'test'
        });
        expect(state).toEqual([]);
        done();
    });

    it('should add a tool on TOOLS_GET_TOOLS_SUCCESS', done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'running'
        };

        expect(
            reducer([], {
                type: actions.TOOLS_GET_TOOLS_SUCCESS,
                response: [tool]
            })
        ).toEqual([tool]);
        done();
    });

    it('should update an existing tool on TOOLS_GET_TOOLS_SUCCESS', done => {
        const tool_1: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'running'
        };
        const tool_2: ITool = {
            _id: 'test',
            name: 'test2',
            logo_url: '',
            status: 'stopped'
        };

        expect(
            reducer([tool_1], {
                type: actions.TOOLS_GET_TOOLS_SUCCESS,
                response: [tool_2]
            })
        ).toEqual([tool_2]);
        done();
    });

    it("should update the tool's status to 'running' on TOOLS_START_TOOL_SUCCESS", done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'stopped'
        };

        expect(
            reducer([tool], {
                tool_id: tool._id,
                type: actions.TOOLS_START_TOOL_SUCCESS
            })
        ).toEqual([
            {
                _id: 'test',
                name: 'test',
                logo_url: '',
                status: 'running'
            }
        ]);
        done();
    });

    it("should update the tool's status to 'pending' on TOOLS_START_TOOL_REQUEST", done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'stopped'
        };

        expect(
            reducer([tool], {
                tool_id: tool._id,
                type: actions.TOOLS_START_TOOL_REQUEST
            })
        ).toEqual([
            {
                _id: 'test',
                name: 'test',
                logo_url: '',
                status: 'pending'
            }
        ]);
        done();
    });

    it("should update the tool's status to 'pending' on TOOLS_STOP_TOOL_REQUEST", done => {
        const state = reducer(
            [
                {
                    _id: 'test',
                    name: 'test',
                    logo_url: '',
                    status: 'running'
                }
            ],
            {
                tool_id: 'test',
                type: actions.TOOLS_STOP_TOOL_REQUEST
            }
        );

        expect(state).toEqual([
            {
                _id: 'test',
                name: 'test',
                logo_url: '',
                status: 'pending'
            }
        ]);
        done();
    });

    it("should update the tool's status to 'stopped' on TOOLS_STOP_TOOL_SUCCESS", done => {
        const tool: ITool = {
            _id: 'test',
            name: 'test',
            logo_url: '',
            status: 'running'
        };

        expect(
            reducer([tool], {
                tool_id: tool._id,
                type: actions.TOOLS_STOP_TOOL_SUCCESS
            })
        ).toEqual([
            {
                _id: 'test',
                name: 'test',
                logo_url: '',
                status: 'stopped'
            }
        ]);
        done();
    });
});
