import isPlainObject from './utils/isPlainObject';

export default ({ dispatch, getState }) => next => action => {
  const {
    types,
    callAPI,
    shouldCallAPI = () => true,
    payload = {},
    onRequestDispatched = () => {},
    onSuccessDispatched = () => {},
    onFailureDispatched = () => {}
  } = action;

  if (!types) {
    // Normal action: pass it on
    return next(action);
  }

  if (
    !isPlainObject(types)
    || Object.keys(types).length !== 3
    || !Object.keys(types).every(type => typeof types[type] === 'string')
  ) {
    throw new Error('Expected an object of three string types.');
  }

  if (typeof callAPI !== 'function') {
    throw new TypeError('Expected callAPI to be a function.');
  }

  if (!shouldCallAPI(getState())) {
    return;
  }

  const { requestType, successType, failureType } = types;

  if (!requestType || !successType || !failureType) {
    throw new Error('Expected types to have the following three keys: requestType, successType and failureType');
  }

  dispatch({
    ...payload,
    type: requestType
  });

  onRequestDispatched(payload, dispatch, getState());

  return callAPI().then(response => {
    const returnAction = dispatch({
      ...payload,
      response,
      type: successType
    });
    onSuccessDispatched(response, payload, dispatch, getState());
    return returnAction;
  }, error => {
    const returnAction = dispatch({
      ...payload,
      error,
      type: failureType
    });
    onFailureDispatched(error, payload, dispatch, getState());
    return returnAction;
  });
};
