import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('Immutability:', () => {

  describe('List', () => {
    function addMovie(currentState, movie) {
      return currentState.push(movie);
    }

    it('is immutable', () => {
      const moviesOrig = List.of('Millions', 'Slumdog');
      const moviesUpdate = addMovie(moviesOrig, 'Trainspotting');

      expect(moviesOrig).to.equal(moviesOrig);
      expect(moviesOrig).to.deep.equal(List.of('Millions', 'Slumdog'));
      expect(moviesOrig).to.not.equal(moviesUpdate);

      expect(moviesUpdate).to.equal(moviesUpdate);
      expect(moviesUpdate).to.deep.equal(List.of('Millions', 'Slumdog', 'Trainspotting'));
      expect(moviesUpdate).to.deep.equal(moviesOrig.push('Trainspotting'));
    });
  });

  describe('Tree', () => {
    function addMovie(currentState, movie) {
      return currentState.update('movies', (movies) => movies.push(movie));
    }

    it('is immutable', () => {
      const movies = List.of('Millions', 'Slumdog');
      const state = Map({movies});
      const nextState = addMovie(state, 'Trainspotting');

      expect(state).to.equal(state);
      expect(state).to.deep.equal(Map({movies}));
      expect(nextState).to.not.equal(state);
      expect(nextState).to.deep.equal(
        Map({movies: List.of(
          'Millions',
          'Slumdog',
          'Trainspotting'
        )})
      );
    });
  });

});
