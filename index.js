const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler,
} = require('./handlers.js');

const {
  findSafeMoves,
  findClosestFood,
  findRiskyMoves,
} = require('./pathfinding.js');

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', process.env.PORT || 9001);

app.enable('verbose errors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(poweredByHandler);

const state = {
  GameID: '',
  snakeID: '',
  snakeName: 'FalconSnake',
  snakeColor: '#B5BABE',
  snakeLength: '',
  snakeAvatar: '',
  currBody: '',
  currBoard: '',
  currHead: '',
  currTail: '',
  prevMove: 'left',
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
    tailType: 'pixel',
  };

  return response.json(data);
});

// Handle POST request to '/move'
app.post('/move', async (request, response) => {
  // * Initialize Data Value
  const data = {};
  // * Set new state for turn
  state.currBody = request.body.you.body;
  state.currBoard = request.body.board;
  state.snakeID = request.body.you.id;
  state.currHead = state.currBody[0];
  state.currTail = state.currBody[state.currBody.length - 1];
  state.snakeLength = request.body.you.length;
  // * Pathfinding AI
  const validMoves = findSafeMoves(state);
  const nonRiskyMoves = findRiskyMoves(state);
  const foodMoves = findClosestFood(state);
  let foundPreferredMove = false;
  let preferredMove;
  for (let i = 0; i < validMoves.length && !foundPreferredMove; i++) {
    for (let z = 0; z < foodMoves.length; z++) {
      if (validMoves[i].direction == foodMoves[z].direction) {
        preferredMove = validMoves[i].direction;
        foundPreferredMove = true;
      }
    }
  }

  const fallbackMove =
    validMoves[Math.floor(Math.random() * validMoves.length)].direction;

  if (preferredMove && nonRiskyMoves.includes(preferredMove)) {
    data.move = preferredMove;
  } else {
    while (!nonRiskyMoves.includes(fallbackMove)) {
      fallbackMove =
        validMoves[Math.floor(Math.random() * validMoves.length)].direction;
    }
    data.move = fallbackMove;
  }
  // * Set Previous Move to Current Move
  state.prevMove = data.move;
  // * Return Data
  let validMovesString = '';
  let foodMovesString = '';
  let nonRiskyMovesString = '';
  validMoves.forEach(o => {
    validMovesString += `${o.direction}, `;
  });
  foodMoves.forEach(o => {
    foodMovesString += `${o.direction}, `;
  });
  nonRiskyMoves.forEach(o => {
    nonRiskyMovesString += `${o}, `;
  });
  console.log(`Current Turn: ${request.body.turn}`);
  console.log(`Valid Directions: ${validMovesString}`);

  console.log(`Food Directions: ${foodMovesString}`);

  console.log(`Non-Risky moves: ${nonRiskyMovesString}`);

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
