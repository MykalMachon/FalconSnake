const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js');

const { spin, findSafeMoves } = require('./pathfinding.js');

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', process.env.PORT || 9001);

app.enable('verbose errors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(poweredByHandler);

// --- SNAKE LOGIC GOES BELOW THIS LINE ---
const state = {
  GameID: '',
  snakeName: 'FalconSnake',
  snakeColor: '#B5BABE',
  snakeAvatar: '',
  currBody: '',
  currBoard: '',
  currHead: '',
  currTail: '',
  prevMove: 'left'
};

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  state.currBoard = request.body.board;
  state.currBody = request.body.you.body;
  // Response data
  const data = {
    color: '#ff69b4',
    headType: 'pixel',
    tailType: 'pixel'
  };

  return response.json(data);
});

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // * Initialize Data Value
  const data = {};
  // * Set new state for turn
  state.currBody = request.body.you.body;
  state.currBoard = request.body.board;
  state.currHead = state.currBody[0];
  state.currTail = state.currBody[state.currBody.length - 1];
  // * Pathfinding AI
  const validMoves = findSafeMoves(state);
  data.move =
    validMoves[Math.floor(Math.random() * validMoves.length)].direction;
  // * Set Previous Move to Current Move
  state.prevMove = data.move;
  // * Return Data
  let validMovesString = '';
  validMoves.forEach(o => {
    validMovesString += `${o.direction}, `;
  });
  console.log(`Current Turn: ${request.body.turn}`);
  console.log(`Valid Directions: ${validMovesString}`);
  return response.json(data);
});

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({});
});

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
});

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'));
});
