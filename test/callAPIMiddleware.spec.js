import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';
import callAPIMiddleware from '../src';

const { expect } = chai;

chai.use(sinonChai);

const noop = () => {};

const types = {
  requestType: 'REQUEST_TYPE',
  successType: 'SUCCESS_TYPE',
  failureType: 'FAILURE_TYPE'
};

const create = () => {
  const store = {
    dispatch: sinon.spy(),
    getState: sinon.spy(() => {})
  };
  const next = sinon.spy();
  const invoke = action => callAPIMiddleware(store)(next)(action);
  return { store, next, invoke };
};

describe('callAPIMiddleware', () => {
  it('should pass through next action', () => {
    const { next, invoke } = create();

    const action = {
      type: 'TEST_ACTION'
    };

    invoke(action);

    expect(next).to.have.been.calledWith(action);
  });

  it('should dispatch actions of type REQUEST_TYPE and SUCCESS_TYPE', () => {
    const { store, invoke } = create();

    const action = {
      types,
      callAPI: () => Promise.resolve(true)
    };

    invoke(action).then(() => {
      expect(store.dispatch).to.have.been.calledWith({
        type: 'SUCCESS_TYPE',
        response: true
      });
    });

    expect(store.dispatch).to.have.been.calledWith({
      type: 'REQUEST_TYPE'
    });
  });

  it('should dispatch actions of type REQUEST_TYPE and FAILURE_TYPE', () => {
    const { store, invoke } = create();

    const action = {
      types,
      callAPI: () => Promise.reject(false)
    };

    invoke(action).then(noop, () => {
      expect(store.dispatch).to.have.been.calledWith({
        type: 'FAILURE_TYPE',
        error: false
      });
    });

    expect(store.dispatch).to.have.been.calledWith({
      type: 'REQUEST_TYPE'
    });
  });

  it('should pass payload to dispatched actions', () => {
    const { store, invoke } = create();

    const action = {
      types,
      callAPI: () => Promise.resolve(true),
      payload: { foo: 'bar' }
    };

    invoke(action).then(() => {
      expect(store.dispatch).to.have.been.calledWith({
        type: 'SUCCESS_TYPE',
        response: true,
        foo: 'bar'
      });
    });

    expect(store.dispatch).to.have.been.calledWith({
      type: 'REQUEST_TYPE',
      foo: 'bar'
    });
  });

  it('should not dispatch any actions', () => {
    const { store, invoke } = create();

    const action = {
      types,
      callAPI: () => Promise.reject(false),
      shouldCallAPI: () => false
    };

    invoke(action);

    expect(store.dispatch).to.not.have.been.called;
  });

  it('should call onRequestDispatched callback', () => {
    const { invoke } = create();

    const action = {
      types,
      callAPI: () => Promise.resolve(true),
      onRequestDispatched: sinon.spy()
    };

    invoke(action);

    expect(action.onRequestDispatched).to.have.been.called;
  });

  it('should call onSuccessDispatched callback', () => {
    const { invoke } = create();

    const action = {
      types,
      callAPI: () => Promise.resolve(true),
      onSuccessDispatched: sinon.spy()
    };

    invoke(action).then(() => {
      expect(action.onSuccessDispatched).to.have.been.called;
    });
  });

  it('should call onFailureDispatched callback', () => {
    const { invoke } = create();

    const action = {
      types,
      callAPI: () => Promise.reject(false),
      onFailureDispatched: sinon.spy()
    };

    invoke(action).then(() => {
      expect(action.onFailureDispatched).to.have.been.called;
    });
  });

  it('should throw if types is not plain object', () => {
    const { invoke } = create();

    const action = {
      types: ['REQUEST_TYPE', 'SUCCESS_TYPE', 'FAILURE_TYPE'],
      callAPI: () => Promise.resolve(true)
    };

    expect(() => invoke(action)).to.throw();
  });

  it('should throw if not all types provided', () => {
    const { invoke } = create();

    const action = {
      types: {
        requestType: 'REQUEST_TYPE'
      },
      callAPI: () => Promise.resolve(true)
    };

    expect(() => invoke(action)).to.throw();
  });

  it('should throw if any of the types object value is not a string', () => {
    const { invoke } = create();

    const action = {
      types: {
        requestType: 'REQUEST_TYPE',
        successType: 'SUCCESS_TYPE',
        failureType: null
      },
      callAPI: () => Promise.resolve(true)
    };

    expect(() => invoke(action)).to.throw();
  });

  it('should throw if callAPI is not a function', () => {
    const { invoke } = create();

    const action = {
      types,
      callAPI: Promise.resolve()
    };

    expect(() => invoke(action)).to.throw();
  });
});
