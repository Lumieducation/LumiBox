import { assign } from 'lodash';

export default function callAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        const {
            types,
            api,
            shouldCallAPI = state => true,
            payload = {}
        } = action;

        if (!types) {
            return next(action);
        }

        if (
            !Array.isArray(types) ||
            types.length !== 3 ||
            !types.every(type => typeof type === 'string')
        ) {
            const error = new Error('Expected an array of three string types.');
            throw error;
        }

        if (!shouldCallAPI(getState())) {
            return;
        }

        const [requestType, successType, failureType] = types;

        dispatch({
            payload,
            type: requestType
        });

        return api.then(
            response => {
                dispatch({
                    payload: response,
                    type: successType
                });
                return response;
            },

            error => {
                dispatch(
                    assign({
                        error,
                        payload,
                        type: failureType
                    })
                );
            }
        );
    };
}
