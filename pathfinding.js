// * This function will take in the board and determine what immediate moves are safe
// * this will return all safe next moves for the snake
const findSafeMoves = state => {
  const {
    currHead,
    currBoard,
    currBody,
    currTail,
    snakeID,
    snakeLength,
  } = state;
  //* Up, Right, Down, Left
  const possibleMoves = [
    { direction: 'up', x: currHead.x, y: currHead.y - 1 },
    { direction: 'right', x: currHead.x + 1, y: currHead.y },
    { direction: 'down', x: currHead.x, y: currHead.y + 1 },
    { direction: 'left', x: currHead.x - 1, y: currHead.y },
  ];
  // * Check if moves out of board bounds
  const filterOutDangers = possibleMoves
    .filter(opt => {
      // * Filter out of bounds areas
      return (
        opt.x >= 0 &&
        opt.x < currBoard.width &&
        (opt.y >= 0 && opt.y < currBoard.height)
      );
    })
    .filter(opt => {
      // * Filter out the snakes own body
      let isBody = false;
      currBody.forEach(bodyPos => {
        if (bodyPos.x == opt.x && bodyPos.y == opt.y) {
          // * Allows the snake to chase it's tail
          if (currTail.x == opt.x && currTail.y == opt.y) {
            isBody = false;
          } else {
            isBody = true;
          }
        }
      });
      return !isBody;
    })
    .filter((opt, index) => {
      // * Filter out other snakes body parts
      let isOther = false;
      // Get snakes that aren't itself
      const otherSnakes = currBoard.snakes.filter(snake => {
        return snake.id != snakeID;
      });
      // Checks if moves into another snakes body
      otherSnakes.forEach(otherSnake => {
        otherSnake.body.forEach((bodyPos, bodyIndex) => {
          if (bodyPos.x == opt.x && bodyPos.y == opt.y) {
            isOther = true;
          }
        });
      });
      return !isOther;
    });
  return filterOutDangers;
};

const findRiskyMoves = state => {
  const { currHead, currBoard, snakeID, snakeLength } = state;

  const possibleMoves = [
    { direction: 'up', x: currHead.x, y: currHead.y - 1 },
    { direction: 'right', x: currHead.x + 1, y: currHead.y },
    { direction: 'down', x: currHead.x, y: currHead.y + 1 },
    { direction: 'left', x: currHead.x - 1, y: currHead.y },
  ];

  const otherSnakes = currBoard.snakes.filter(snake => {
    return snake.id != snakeID;
  });

  const preferredMoves = possibleMoves.filter(opt => {
    let isRisky = false;
    otherSnakes.forEach(snake => {
      snake.body.forEach((bodyPos, bodyIndex) => {
        if (
          bodyIndex == 0 &&
          findSnakeLength(bodyPos.x, bodyPos.y, currBoard) >= snakeLength
        ) {
          if (possibleMoves[index].direction == 'up') {
            if (
              (opt.x - 1 == bodyPos.x || opt.x + 1 == bodyPos.x) &&
              opt.y == bodyPos.y
            ) {
              isRisky = true;
            } else if (opt.y - 1 == bodyPos.y && opt.x == bodyPos.x) {
              isRisky = true;
            }
          } else if (possibleMoves[index].direction == 'down') {
            if (
              (opt.x - 1 == bodyPos.x || opt.x + 1 == bodyPos.x) &&
              opt.y == bodyPos.y
            ) {
              isRisky = true;
            } else if (opt.y + 1 == bodyPos.y && opt.x == bodyPos.x) {
              isRisky = true;
            }
          } else if (possibleMoves[index].direction == 'right') {
            if (
              (opt.y - 1 == bodyPos.y || opt.y + 1 == bodyPos.y) &&
              opt.x == bodyPos.x
            ) {
              isRisky = true;
            } else if (opt.x + 1 == bodyPos.x && opt.y == bodyPos.y) {
              isRisky = true;
            }
          } else if (possibleMoves[index].direction == 'left') {
            if (
              (opt.y - 1 == bodyPos.y || opt.y + 1 == bodyPos.y) &&
              opt.x == bodyPos.x
            ) {
              isRisky = true;
            } else if (opt.x - 1 == bodyPos.x && opt.y == bodyPos.y) {
              isRisky = true;
            }
          }
        }
      });
    });
    return !isRisky;
  });
  console.log('Non risky moves are :');
  console.log(preferredMoves);
  const directions = preferredMoves.map(move => {
    return move.direction;
  });
  return directions;
};

/**
 * closestFood looks at the map every move and determines if there is food
 * left, right, up, or down relative to your position. as well as the distance.
 * A sorted array is returned based on distance
 *
 * @param {*} state
 */
const findClosestFood = state => {
  const { currHead, currBoard, currBody, currTail } = state;
  // Define Schema of food map
  const PossibleFoodPos = [];
  // Get all co-ordinates to the left, right, above, and below
  // * parse x co-ords
  for (i = 0; i < currBoard.width; i++) {
    let dir;
    let distanceFromHead = currHead.x - i;
    if (distanceFromHead > 0) {
      dir = 'left';
    } else {
      dir = 'right';
    }
    PossibleFoodPos.push({
      x: i,
      y: currHead.y,
      distance: Math.abs(distanceFromHead),
      direction: dir,
    });
  }
  // * Parse y co-ords
  for (i = 0; i < currBoard.height; i++) {
    let dir;
    let distanceFromHead = currHead.y - i;
    if (distanceFromHead > 0) {
      dir = 'up';
    } else {
      dir = 'down';
    }
    PossibleFoodPos.push({
      x: currHead.x,
      y: i,
      distance: Math.abs(currHead.y - i),
      direction: dir,
    });
  }
  // * Filter out nonFood Positions & sort by distance
  const FoodPositions = PossibleFoodPos.filter(pos => {
    let isFood = false;
    currBoard.food.forEach(foodPos => {
      if (foodPos.x == pos.x && foodPos.y == pos.y) {
        isFood = true;
      }
    });
    return isFood;
  }).sort((curr, next) => {
    if (curr.distance > next.distance) {
      return 1;
    } else if (curr.distance < next.distance) {
      return -1;
    } else {
      return 0;
    }
  });
  return FoodPositions;
};

const findSnakeLength = (xPos, yPos, currBoard) => {
  const isSnake = currBoard.snakes.filter(snake => {
    let snakeAtPos = false;
    snake.body.forEach((bodyPos, index) => {
      if (bodyPos.x == xPos && bodyPos.y == yPos) {
        snakeAtPos = snake.body;
      }
    });
    return snakeAtPos;
  });
  return isSnake[0].body.length;
};

module.exports = {
  findSafeMoves,
  findRiskyMoves,
  findClosestFood,
};
