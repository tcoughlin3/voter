import React from 'react';
import ReactDOM from 'react-dom';
import Voting from './components/voting';

const pair = ['Jackie Brown', 'Pulp Fiction'];

ReactDOM.render(
  <Voting pair={pair} />,
  document.getElementById('app')
);
