[![npm version](https://img.shields.io/npm/v/@georapbox/redux-call-api-middleware.svg)](https://www.npmjs.com/package/@georapbox/redux-call-api-middleware)
[![Build Status](https://travis-ci.com/georapbox/redux-call-api-middleware.svg?branch=master)](https://travis-ci.com/georapbox/redux-call-api-middleware)
[![Codecov](https://img.shields.io/codecov/c/github/georapbox/redux-call-api-middleware/master.svg)](https://codecov.io/gh/georapbox/redux-call-api-middleware)
[![Dependencies](https://david-dm.org/georapbox/redux-call-api-middleware.svg)](https://david-dm.org/georapbox/redux-call-api-middleware)
[![devDependency Status](https://david-dm.org/georapbox/redux-call-api-middleware/dev-status.svg)](https://david-dm.org/georapbox/redux-call-api-middleware#info=devDependencies)
[![npm license](https://img.shields.io/npm/l/@georapbox/redux-call-api-middleware.svg)](https://www.npmjs.com/package/@georapbox/redux-call-api-middleware)

# redux-call-api-middleware

Redux middleware to perform api calls reducing action creators boilerplate

This is a slight modification of the example found in Redux [docs](https://redux.js.org/recipes/reducing-boilerplate).

## Install
```sh
$ npm install @georapbox/redux-call-api-middleware
```

## Usage

After passing it once to [applyMiddleware(...middlewares)](https://redux.js.org/api-reference/applymiddleware), you can write all your API-calling action creators the following way:

```js
export function loadPosts(userId) {
  return {
    // Types of actions to emit before and after (required)
    types: {
      requestType: 'LOAD_POSTS_REQUEST',
      successType: 'LOAD_POSTS_SUCCESS',
      failureType: 'LOAD_POSTS_FAILURE'
    },

    // Check the cache (optional); defaults to `() => true`
    shouldCallAPI: state => !state.posts[userId],

    // Perform the fetching (required)
    callAPI: (dispatch, state) => fetch(`http://myapi.com/users/${userId}/posts`),

    // Arguments to inject in begin/end actions (optional); defaults to `{}`
    payload: { userId },

    // Callback function to be executed after `requestType` is dispatched (optional); defaults to `() => {}`
    onRequestDispatched: (payload, dispatch, state) => {
      // Do something when `requestType` is dispatched
    },

    // Callback function to be executed after `successType` is dispatched (optional); defaults to `() => {}`
    onSuccessDispatched: (response, payload, dispatch, state) => {
      // Do something when `successType` is dispatched
    },

    // Callback function to be executed after `failureType` is dispatched (optional); defaults to `() => {}`
    onFailureDispatched: (error, payload, dispatch, state) => {
      // Do something when `failureType` is dispatched
    }
  }
}
```

## License

[The MIT License (MIT)](https://georapbox.mit-license.org/@2018)
