// * This function will take in the board and determine what immediate moves are safe
// * this will return all safe next moves for the snake
const findSafeMoves = state => {
  const { currHead, currBoard, currBody, currTail, snakeName } = state;
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
          }
          isBody = true;
        }
      });
      return !isBody;
    })
    .filter(opt => {
      // * Filter out other snakes body parts
      let isOther = false;
      // Get snakes that aren't itself
      const otherSnakes = currBoard.snakes;
      // Checks if moves into another snakes body
      otherSnakes.forEach(otherSnake => {
        otherSnake.body.forEach(bodyPos => {
          if (bodyPos.x == opt.x && bodyPos.y == opt.y) {
            isOther = true;
          }
        });
      });
      return !isOther;
    });
  return filterOutDangers;
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
  findClosestFood,
};
