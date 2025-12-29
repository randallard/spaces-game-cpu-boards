const boards = require('/home/ryankhetlyr/Development/spaces-game-cpu-boards/boards/4x4.json');

function isAdjacent(pos1, pos2) {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  // Adjacent means exactly one step up/down/left/right (not diagonal)
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

let allValid = true;

boards.forEach(board => {
  console.log(`\n=== Validating ${board.id} (${board.name}) ===`);

  let currentPiecePos = null;
  const trapPositions = new Set();
  let valid = true;

  board.sequence.forEach((move, idx) => {
    if (move.type === 'piece') {
      currentPiecePos = move.position;
      console.log(`  [${move.order}] Piece at (${move.position.row}, ${move.position.col})`);
    } else if (move.type === 'trap') {
      if (!currentPiecePos) {
        console.log(`  ❌ [${move.order}] ERROR: Trap at (${move.position.row}, ${move.position.col}) placed before any piece!`);
        valid = false;
        allValid = false;
      } else if (!isAdjacent(currentPiecePos, move.position)) {
        console.log(`  ❌ [${move.order}] ERROR: Trap at (${move.position.row}, ${move.position.col}) NOT adjacent to current piece at (${currentPiecePos.row}, ${currentPiecePos.col})`);
        valid = false;
        allValid = false;
      } else {
        const trapKey = `${move.position.row},${move.position.col}`;
        if (trapPositions.has(trapKey)) {
          console.log(`  ❌ [${move.order}] ERROR: Duplicate trap at (${move.position.row}, ${move.position.col})`);
          valid = false;
          allValid = false;
        } else {
          trapPositions.add(trapKey);
          console.log(`  ✓ [${move.order}] Trap at (${move.position.row}, ${move.position.col}) - adjacent to piece at (${currentPiecePos.row}, ${currentPiecePos.col})`);
        }
      }
    } else if (move.type === 'final') {
      console.log(`  ✓ [${move.order}] Final at row -1, col ${move.position.col}`);
    }
  });

  // Count direction changes
  let directionChanges = 0;
  let lastDirection = null;

  const pieceMovesOnly = board.sequence.filter(m => m.type === 'piece');
  for (let i = 1; i < pieceMovesOnly.length; i++) {
    const prev = pieceMovesOnly[i-1].position;
    const curr = pieceMovesOnly[i].position;

    let direction;
    if (curr.row < prev.row) direction = 'up';
    else if (curr.row > prev.row) direction = 'down';
    else if (curr.col < prev.col) direction = 'left';
    else if (curr.col > prev.col) direction = 'right';

    if (lastDirection && lastDirection !== direction) {
      directionChanges++;
    }
    lastDirection = direction;
  }

  const maxDirectionChanges = Math.floor(board.boardSize / 2);
  console.log(`  Direction changes: ${directionChanges} (max allowed: ${maxDirectionChanges})`);

  if (directionChanges > maxDirectionChanges) {
    console.log(`  ❌ ERROR: Too many direction changes!`);
    valid = false;
    allValid = false;
  }

  if (valid) {
    console.log(`  ✅ Board is VALID`);
  } else {
    console.log(`  ❌ Board has ERRORS`);
  }
});

console.log(`\n${'='.repeat(60)}`);
if (allValid) {
  console.log('✅ ALL BOARDS ARE VALID!');
} else {
  console.log('❌ SOME BOARDS HAVE VALIDATION ERRORS');
}
