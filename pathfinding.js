// * This function just spins the snake in place
const spin = prevMove => {
  if (prevMove == 'right') {
    return 'down';
  } else if (prevMove == 'left') {
    return 'up';
  } else if (prevMove == 'up') {
    return 'right';
  } else if (prevMove == 'down') {
    return 'left';
  }
};

// * This function will take in the board and determine what immediate moves are safe
// * this will return all safe next moves for the snake
const findSafeMoves = state => {
  const { currHead, currBoard, currBody, currTail } = state;

  //* Up, Right, Down, Left
  const possibleMoves = [
    { direction: 'up', x: currHead.x, y: currHead.y - 1 },
    { direction: 'right', x: currHead.x + 1, y: currHead.y },
    { direction: 'down', x: currHead.x, y: currHead.y + 1 },
    { direction: 'left', x: currHead.x - 1, y: currHead.y }
  ];
  // * Check if moves out of board bounds
  const filterOutOfBounds = possibleMoves.filter(opt => {
    return (
      opt.x >= 0 &&
      opt.x < currBoard.width &&
      (opt.y >= 0 && opt.y < currBoard.height)
    );
  });
  // * Checks if moves into own body
  const filterOutSelf = filterOutOfBounds.filter(opt => {
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
  });
  // * Checks if moves into others body
  const filterOutOthers = filterOutSelf.filter(opt => {
    return true;
  });
  return filterOutOthers;
};

// * This will attempt to map movement to the nearest food
// * if there is a valid path it will return the path, if not it will return false
const findFood = state => {
  // if(isSafePath){
  //   return [...path];
  // } else {
  //   return false;
  // }
};

module.exports = {
  spin,
  findSafeMoves
};
