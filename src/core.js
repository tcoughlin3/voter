import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair');
  const aVote = vote.getIn(['tally', a], 0);
  const bVote = vote.getIn(['tally', b], 0);
  if (aVote > bVote) return [a];
  if (bVote > aVote) return [b];
  return [a, b];
}

export function next(state) {
  const winners = getWinners(state.get('vote'));
  const entries = state.get('entries').concat(winners);

  if (entries.size <= 1) return state.remove('vote').remove('entries').set('winner', entries.first());

  return state.merge({
    vote: Map({
      'pair': entries.take(2)
    }),
    entries: entries.skip(2)
  });
}

export function vote(voteState, entry) {
  return voteState.updateIn(['tally', entry], 0, (tally) => tally + 1);
}
