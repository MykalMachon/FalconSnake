// functions that could be implemented in the future

const checkDiagonals = (opt, index, possibleMoves){
  if (possibleMoves[index].direction == 'up') {
    console.log('up');
    if (
      (opt.x - 1 == bodyPos.x || opt.x + 1 == bodyPos.x) &&
      opt.y == bodyPos.y
    ) {
      isOther = true;
    } else if (opt.y - 1 == bodyPos.y && opt.x == bodyPos.x) {
      isOther = true;
    }
  } else if (possibleMoves[index].direction == 'down') {
    console.log('down');
    if (
      (opt.x - 1 == bodyPos.x || opt.x + 1 == bodyPos.x) &&
      opt.y == bodyPos.y
    ) {
      isOther = true;
    } else if (opt.y + 1 == bodyPos.y && opt.x == bodyPos.x) {
      isOther = true;
    }
  } else if (possibleMoves[index].direction == 'right') {
    console.log('right');
    if (
      (opt.y - 1 == bodyPos.y || opt.y + 1 == bodyPos.y) &&
      opt.x == bodyPos.x
    ) {
      isOther = true;
    } else if (opt.x + 1 == bodyPos.x && opt.y == bodyPos.y) {
      isOther = true;
    }
  } else if (possibleMoves[index].direction == 'left') {
    console.log('left');
    if (
      (opt.y - 1 == bodyPos.y || opt.y + 1 == bodyPos.y) &&
      opt.x == bodyPos.x
    ) {
      isOther = true;
    } else if (opt.x - 1 == bodyPos.x && opt.y == bodyPos.y) {
      isOther = true;
    }
  }
}