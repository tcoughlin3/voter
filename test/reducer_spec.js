import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('Reducer', () => {

  it('handles SET_ENTRIES', () => {
    const state = fromJS({});
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']};
    const nextState = reducer(state, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting', '28 Days Later']
    }));
  });

  it('handles NEXT', () => {
    const state = fromJS({
      entries: ['Trainspotting', '28 Days Later', 'Millions', 'Slumdog']
    });
    const action = {type: 'NEXT'};
    const nextState = reducer(state, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: ['Millions', 'Slumdog']
    }));
  });

  it('handles VOTE', () => {
    const state = fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: ['Millions', 'Slumdog']
    });
    const action = {type: 'VOTE', entry: 'Trainspotting'};
    const nextState = reducer(state, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        tally: {
          'Trainspotting': 1
        },
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: ['Millions', 'Slumdog']
    }));
  });

  it('has an initial state', () => {
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Trainspotting'},
      {type: 'VOTE', entry: 'Trainspotting'},
      {type: 'VOTE', entry: '28 Days Later'},
      {type: 'NEXT'}
    ];
    const nextState = actions.reduce(reducer, Map());

    expect(nextState).to.equal(fromJS({
      winner: 'Trainspotting'
    }));
  });
});
