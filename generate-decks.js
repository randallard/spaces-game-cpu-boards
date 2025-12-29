#!/usr/bin/env node
/**
 * Generate fixed deck files from board files
 * Creates 2 decks per board size, each with 10 boards
 * For now, focuses on easier boards (minimal traps)
 */

const fs = require('fs');
const path = require('path');

// Board sizes to generate decks for
const BOARD_SIZES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const BOARDS_DIR = path.join(__dirname, 'boards');
const DECKS_DIR = path.join(__dirname, 'decks');
const DECKS_PER_SIZE = 2;

// Create decks directory if it doesn't exist
if (!fs.existsSync(DECKS_DIR)) {
  fs.mkdirSync(DECKS_DIR);
}

for (const size of BOARD_SIZES) {
  const boardFile = path.join(BOARDS_DIR, `${size}x${size}.json`);

  if (!fs.existsSync(boardFile)) {
    console.log(`Skipping ${size}x${size}: board file not found`);
    continue;
  }

  // Read boards
  const boards = JSON.parse(fs.readFileSync(boardFile, 'utf8'));

  if (boards.length < 10 * DECKS_PER_SIZE) {
    console.log(`Warning: ${size}x${size} only has ${boards.length} boards (need ${10 * DECKS_PER_SIZE} for ${DECKS_PER_SIZE} decks)`);
  }

  // Sort boards by difficulty (fewer traps = easier)
  const sortedBoards = boards.sort((a, b) => {
    const aTraps = a.sequence.filter(m => m.type === 'trap').length;
    const bTraps = b.sequence.filter(m => m.type === 'trap').length;
    return aTraps - bTraps;
  });

  // Create 2 decks per size
  for (let deckNum = 1; deckNum <= DECKS_PER_SIZE; deckNum++) {
    const deckFile = path.join(DECKS_DIR, `${size}x${size}-deck-${deckNum}.json`);

    // Select boards for this deck (interleave to distribute variety)
    const selectedBoards = [];
    const startIdx = (deckNum - 1) * 10;

    for (let i = 0; i < 10; i++) {
      const boardIdx = startIdx + i;
      if (boardIdx < sortedBoards.length) {
        selectedBoards.push(sortedBoards[boardIdx]);
      } else {
        // If we don't have enough boards, wrap around
        selectedBoards.push(sortedBoards[i % sortedBoards.length]);
      }
    }

    // Create deck object
    const deck = {
      id: `remote-cpu-${size}x${size}-deck-${deckNum}`,
      name: `CPU Remote ${size}×${size} Deck #${deckNum}`,
      boards: selectedBoards,
      createdAt: Date.now()
    };

    // Write deck file
    fs.writeFileSync(deckFile, JSON.stringify(deck, null, 2));
    console.log(`✓ Generated ${size}x${size} deck #${deckNum} with ${selectedBoards.length} boards`);
  }
}

console.log('\nDeck generation complete!');
