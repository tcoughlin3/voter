import {expect} from 'chai';
import {List, Map, fromJS} from 'immutable';

import {setEntries, next, vote} from '../src/core'

describe('Application logic:', () => {

  describe('setEntries', () => {
    it('adds entries to the state', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const newState = setEntries(state, entries);

      expect(newState).to.deep.equal(Map({
        entries: List(entries)
      }));
    });
  });

  describe('next', () => {
    it('adds entries for voting', () => {
      const entries = ['Trainspotting', '28 Days Later', 'Millions', 'Slumdog'];
      const state = Map({entries: List(entries)});
      const newState = next(state);

      expect(state).to.deep.equal(Map({
        entries: List(entries)
      }));
      expect(newState).to.deep.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Millions', 'Slumdog')
      }));
    });

    it('moves winner of current vote to end of entries and removes loser', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          })
        }),
        entries: List.of('Millions', 'Slumdog')
      });
      const nextState = next(state);

      expect(nextState).to.deep.equal(Map({
        vote: Map({
          pair: List.of('Millions', 'Slumdog')
        }),
        entries: List.of('Trainspotting')
      }));
    });

    it('if current vote is a tie, moves both to end of entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        }),
        entries: List.of('Millions', 'Slumdog')
      });
      const nextState = next(state);

      expect(nextState).to.deep.equal(Map({
        vote: Map({
          pair: List.of('Millions', 'Slumdog')
        }),
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

    it('marks a final winner if just one entry is left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          })
        }),
        entries: List.of()
      });
      const nextState = next(state);

      expect(nextState).to.deep.equal(Map({
        winner: 'Trainspotting'
      }));
    });

    it('starts another vote if final round ends in tie', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        }),
        entries: List.of()
      });
      const nextState = next(state);

      expect(nextState).to.deep.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of()
      }));
    });
  });

  describe('vote', () => {
    it('should handle first vote for entry', () => {
      const state = fromJS({
        pair: ['Trainspotting', '28 Days Later']
      });
      const newState = vote(state, 'Trainspotting');

      expect(newState).to.equal(fromJS({
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 1
          }
        }
      ));
    });

    it('should increment votes', () => {
      const state = fromJS({
        pair: ['Trainspotting', '28 Days Later'],
        tally: {
          'Trainspotting': 1
        }
      });
      let newState = vote(state, 'Trainspotting');
      newState = vote(newState, '28 Days Later');

      expect(newState).to.equal(fromJS({
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 2,
            '28 Days Later': 1
          }
        }
      ));
    });
  });

});
