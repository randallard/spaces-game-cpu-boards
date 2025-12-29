# Board Generation Goals & Game Strategy Guide

## Game Overview

Spaces is a competitive board game where two players simultaneously navigate their own boards while trying to trap each other. Each player selects a pre-designed board, and both boards are played at the same time. The opponent's board is rotated 180 degrees, creating a mirrored competitive experience.

**Critical Concept**: When you create a board, you're designing BOTH:
1. A challenge for your opponent to navigate
2. A path that YOU must complete while avoiding the opponent's traps

## How Competitive Gameplay Works

### Simultaneous Board Play
1. **Both players select a board** from their available boards
2. **Player board**: Played as-is (bottom to top)
3. **Opponent board**: Rotated 180° (their top becomes bottom)
4. **Both players execute their sequences simultaneously**, step by step
5. As each player moves through their sequence, they place pieces and traps on their board
6. **Traps placed by one player can catch the other player** as they navigate their own board

### Scoring System
- **+1 point**: Each forward move (getting closer to your goal)
- **-1 point**: If you hit a trap placed by your opponent
- **Winner**: Player with more points at the end of the round

### Example Round

**Player's Board (4x4):**
```
Row 0: [empty] [empty] [piece] [empty]   ← Player will exit from column 2
Row 1: [empty] [empty] [piece] [empty]
Row 2: [empty] [trap]  [piece] [empty]
Row 3: [empty] [piece] [piece] [trap]
```

**Player's Sequence:**
1. (3,1) piece - Starting position
2. (2,1) trap - Place trap here
3. (3,0) trap - Place trap here (not shown on board for clarity)
4. (3,2) piece - Move to this position
5. (3,3) trap - Place trap here
6. (2,2) piece - Move forward (+1 point)
7. (1,2) piece - Move forward (+1 point)
8. (0,2) piece - Move forward (+1 point)
9. (-1,2) final - EXIT THE BOARD (row -1)

Player hits opponent's trap during their movement, losing 1 point.
**Final Player Score**: 3 - 1 = 2 points

**Opponent's Board (rotated 180°):**
```
Row 0: [empty] [empty] [piece] [empty]   ← Opponent exits from their column
Row 1: [empty] [empty] [empty] [empty]
Row 2: [empty] [trap]  [empty] [empty]
Row 3: [trap]  [piece] [empty] [empty]
```

**What Happens:**
- As Player places trap at (2,1), Opponent is moving through their board
- Opponent hits Player's trap at position (2,1), losing 1 point
- Both players score points for forward moves
- Both players exit at row -1 (their respective columns)

**Result**: Player scores 2 points, Opponent scores 1 point. Player wins the round.

### Strategic Implications

**Why Easy Boards Matter**: Sometimes you want a guaranteed completion to ensure you score points, even if you don't trap the opponent.

**Why Medium Boards Matter**: One strategic trap can catch an opponent while still giving you a clear path.

**Why Hard Boards Matter**: Complex boards with multiple traps can catch skilled opponents, but require you to navigate carefully too.

**The Balance**: Your board must be solvable (so YOU can complete it) but challenging enough to potentially trap your opponent.

## Game Rules

### Board Components
- **Piece (starting position)**: Where the player begins (placed on the grid)
- **Empty spaces**: Safe cells the player can move through (placed on the grid)
- **Trap**: Ending position that causes the player to lose (placed on the grid)
- **Final (goal)**: The winning destination - **ALWAYS at row -1** (beyond the top edge of the board, NOT on the grid itself)

**CRITICAL**: The "final" cell is conceptual - it represents exiting the board at row -1. The grid never contains a "final" cell type. The final position in the sequence is always `{ "row": -1, "col": X }` where X is the column the player exits from.

### Movement Rules
**IMPORTANT FOR BOARD GENERATION**: You don't need to worry about column selection mechanics when creating boards. The sequence you create IS the predetermined path for that board. Just focus on creating a valid sequence from start to finish.

1. When playing, players select which column to start from
2. The board's sequence defines the predetermined path through that column
3. The sequence continues until reaching:
   - The **final** (row -1) - player wins
   - A **trap** in the sequence - player loses
   - Getting **stuck** - player loses

**For board generation**: Create the complete sequence from piece → final. The game engine handles the column selection logic.

### Round Win Conditions
- **Round winner**: Player with higher score after both sequences complete
- **Tie**: Both players score the same points
- **Game winner**: Best of multiple rounds (typically 10 rounds)

### How Sequences End
- **Reach "final"**: Sequence completes successfully
- **Hit "trap"**: Sequence ends at trap (placed by self in sequence)
- **Get stuck**: No valid moves available

## Strategic Goals

### As a Board Designer (Creating Boards)
1. **Create a solvable path**: Ensure YOUR sequence can reach the final
2. **Place strategic traps**: Position traps where opponent might move
3. **Maximize your progress**: Longer sequences = more potential points
4. **Trap the opponent early**: Traps early in sequence catch opponent sooner
5. **Balance risk/reward**: Hard boards can trap opponents but are risky for you

### As a Player (Playing Boards)
1. **Complete your sequence**: Reach your final cell for maximum points
2. **Avoid opponent's traps**: Navigate your board without hitting their traps
3. **Make progress**: Each forward move scores +1 point
4. **Catch opponent**: Hope your traps align with opponent's movement path

## Board Design Philosophy

### Easy Boards
**Goal**: Introduce players to mechanics, build confidence
- **Strategy**: Straight run from piece to final
- **Traps**: None
- **Complexity**: Minimal decision-making required
- **Why useful**: Sometimes a guaranteed win is strategically valuable

### Medium Boards
**Goal**: Create meaningful tactical choices
- **Strategy**: One strategic trap that blocks an obvious path
- **Traps**: 1 trap placed to create a decision point
- **Complexity**: Player must think about which path to take
- **Navigation**: Requires going around the trap to reach final

### Hard Boards
**Goal**: Challenge skilled players with complex navigation
- **Strategy**: Mix of straight runs and maze-like paths
- **Traps**: 2-3+ traps creating strategic blocking
- **Complexity**: Multiple decision points, longer sequences
- **Direction changes**: Limited to `Math.floor(boardSize / 2)` to avoid backtracking
- **Balance**: Some hard boards can still have straight shots (strategic variety)

## Board Generation Constraints

### Technical Requirements
1. **Board sizes**: 2x2 through 10x10
2. **Quantity per size**: Approximately `2 × boardSize` boards
   - 2x2: 4 boards
   - 3x3: 6 boards
   - 4x4: 8 boards
   - etc.
3. **Difficulty distribution**: Roughly split between easy/medium/hard

### Grid Requirements
- **NEVER contains "final"** - the goal is always row -1 (beyond the board)
- Must contain at least **one "piece"** cell (starting position)
- Can contain any number of **"empty"** cells
- Can contain zero or more **"trap"** cells (based on difficulty)
- Valid grid cell types: "piece", "empty", "trap" only (never "final")

### Sequence Requirements
- **Array of moves** from piece → final (row -1)
- Each move specifies:
  - `position`: `{row: number, col: number}` (0-indexed, row -1 is beyond the board)
  - `type`: "piece", "trap", or "final"
  - `order`: Sequential numbering starting at 1
- Sequence must match the grid contents for all moves EXCEPT the final move
- **The last move in every sequence** must be `type: "final"` at `row: -1` (exiting the board)
- For hard boards: direction changes ≤ `Math.floor(boardSize / 2)`

**Example final move**: `{ "position": { "row": -1, "col": 2 }, "type": "final", "order": 9 }`
This means the player exits from column 2 at row -1 (beyond the top of the board).

### Sequence Validation Rules (CRITICAL)
When creating sequences, follow these constraints:

1. **Traps can ONLY be placed in spaces adjacent to current piece position**
   - Adjacent means: up, down, left, right (NOT diagonal)
   - Example: If piece is at (2,1), can ONLY place trap at: (1,1), (3,1), (2,0), or (2,2)
   - Example: If piece is at (2,1), CANNOT place trap at (0,0) - not adjacent!
   - This is the most important rule for valid sequences

2. **Cannot move to a space where a trap was already placed**
   - Example: If piece is at (2,1) and places trap at (2,0), a subsequent move to (2,0) is INVALID
   - Once you place a trap somewhere, you can never move to that position

3. **Can place trap on a space you previously occupied**
   - Example: Move from (3,1) to (2,1), then place trap at (3,1) is VALID (3,1 is adjacent to 2,1)
   - After leaving a space, you can trap it IF it's adjacent to current position

4. **Cannot place multiple traps at the same position**
   - Example: Place trap at (2,1) then place trap at (2,1) again is INVALID
   - Each trap placement must be at a unique position

5. **Piece moves (type: "piece") must match grid**
   - If sequence has move to (2,1) with type "piece", grid[2][1] must be "piece" or "empty"
   - Grid "piece" cells mark spaces you visit, "empty" cells are also valid to move through

6. **Trap placements (type: "trap") must match grid**
   - If sequence has placement at (2,1) with type "trap", grid[2][1] must be "trap"

**Valid Sequence Example**:
```json
[
  { "position": { "row": 2, "col": 1 }, "type": "piece", "order": 1 },  // Start at (2,1)
  { "position": { "row": 2, "col": 0 }, "type": "trap", "order": 2 },   // Trap LEFT (adjacent to 2,1) ✓
  { "position": { "row": 1, "col": 1 }, "type": "piece", "order": 3 },  // Move UP to (1,1)
  { "position": { "row": 2, "col": 1 }, "type": "trap", "order": 4 },   // Trap DOWN (adjacent to 1,1) ✓
  { "position": { "row": 0, "col": 1 }, "type": "piece", "order": 5 },  // Move UP to (0,1)
  { "position": { "row": -1, "col": 1 }, "type": "final", "order": 6 }  // Exit
]
```

**Invalid Sequence Examples**:
```json
// INVALID: Moving to trapped space
[
  { "position": { "row": 2, "col": 1 }, "type": "piece", "order": 1 },
  { "position": { "row": 2, "col": 0 }, "type": "trap", "order": 2 },
  { "position": { "row": 2, "col": 0 }, "type": "piece", "order": 3 }  // INVALID! Can't move to trap
]

// INVALID: Trap not adjacent
[
  { "position": { "row": 2, "col": 1 }, "type": "piece", "order": 1 },  // At (2,1)
  { "position": { "row": 0, "col": 0 }, "type": "trap", "order": 2 }    // INVALID! (0,0) not adjacent to (2,1)
]

// INVALID: Trap placement must be adjacent
[
  { "position": { "row": 2, "col": 1 }, "type": "piece", "order": 1 },  // At (2,1)
  { "position": { "row": 1, "col": 2 }, "type": "trap", "order": 2 },   // OK - (1,2) is diagonal, NOT adjacent
  // Actually this is INVALID - diagonals are NOT adjacent!
]
```

### Strategic Considerations
1. **No backtracking**: Paths should be efficient
2. **Trap placement**: Should block natural/obvious paths
3. **Multiple solutions**: Optional but adds depth
4. **Progressive difficulty**: Larger boards can be more complex
5. **Strategic variety**: Mix of board types within each difficulty level

## Real Board Examples

### Example 1: Easy 2x2 Board
A simple straight path with one trap to place.

```json
{
  "id": "20353528-82c8-41b4-9892-9d7502a1d4be",
  "name": "My First Board",
  "boardSize": 2,
  "grid": [
    ["piece", "empty"],
    ["piece", "trap"]
  ],
  "sequence": [
    { "position": { "row": 1, "col": 0 }, "type": "piece", "order": 1 },
    { "position": { "row": 1, "col": 1 }, "type": "trap", "order": 2 },
    { "position": { "row": 0, "col": 0 }, "type": "piece", "order": 3 },
    { "position": { "row": -1, "col": 0 }, "type": "final", "order": 4 }
  ],
  "thumbnail": "",
  "createdAt": 1766938522610
}
```

**Analysis**:
- Starts at (1,0), places trap at (1,1)
- Moves to (0,0), then exits at (-1,0) to reach final
- Simple 4-move sequence
- One trap that could catch opponent

### Example 2: Easy 3x3 Board
Straight vertical path, no traps.

```json
{
  "id": "d154ccc2-f6cd-4cb6-ad77-94c30fe04397",
  "name": "Board 2",
  "boardSize": 3,
  "grid": [
    ["piece", "empty", "empty"],
    ["piece", "empty", "empty"],
    ["piece", "empty", "empty"]
  ],
  "sequence": [
    { "position": { "row": 2, "col": 0 }, "type": "piece", "order": 1 },
    { "position": { "row": 1, "col": 0 }, "type": "piece", "order": 2 },
    { "position": { "row": 0, "col": 0 }, "type": "piece", "order": 3 },
    { "position": { "row": -1, "col": 0 }, "type": "final", "order": 4 }
  ],
  "thumbnail": "",
  "createdAt": 1766938735975
}
```

**Analysis**:
- Pure vertical path from bottom to top
- No traps - guaranteed completion
- 4-move sequence (3 moves + final)
- Good for ensuring points when you need a safe board

### Example 3: Medium 3x3 Board
Straight path with strategic trap placement.

```json
{
  "id": "8d8b3905-4bdf-42ec-a36a-35c2ede7231a",
  "name": "Board 5",
  "boardSize": 3,
  "grid": [
    ["empty", "piece", "empty"],
    ["empty", "piece", "empty"],
    ["trap", "piece", "trap"]
  ],
  "sequence": [
    { "position": { "row": 2, "col": 1 }, "type": "piece", "order": 1 },
    { "position": { "row": 2, "col": 0 }, "type": "trap", "order": 2 },
    { "position": { "row": 2, "col": 2 }, "type": "trap", "order": 3 },
    { "position": { "row": 1, "col": 1 }, "type": "piece", "order": 4 },
    { "position": { "row": 0, "col": 1 }, "type": "piece", "order": 5 },
    { "position": { "row": -1, "col": 1 }, "type": "final", "order": 6 }
  ],
  "thumbnail": "",
  "createdAt": 1766938831800
}
```

**Analysis**:
- Center column path (column 1)
- Places two traps early (left and right at row 2)
- 6-move sequence (5 moves + final)
- Traps placed on sides could catch opponent moving horizontally

### Example 4: Hard 4x4 Board
Complex path with multiple traps and direction changes.

```json
{
  "id": "70a93653-41bb-497f-9fde-1b0bd5e74553",
  "name": "Board 7",
  "boardSize": 4,
  "grid": [
    ["empty", "empty", "piece", "empty"],
    ["empty", "empty", "piece", "empty"],
    ["empty", "trap", "piece", "empty"],
    ["trap", "piece", "piece", "trap"]
  ],
  "sequence": [
    { "position": { "row": 3, "col": 1 }, "type": "piece", "order": 1 },
    { "position": { "row": 2, "col": 1 }, "type": "trap", "order": 2 },
    { "position": { "row": 3, "col": 0 }, "type": "trap", "order": 3 },
    { "position": { "row": 3, "col": 2 }, "type": "piece", "order": 4 },
    { "position": { "row": 3, "col": 3 }, "type": "trap", "order": 5 },
    { "position": { "row": 2, "col": 2 }, "type": "piece", "order": 6 },
    { "position": { "row": 1, "col": 2 }, "type": "piece", "order": 7 },
    { "position": { "row": 0, "col": 2 }, "type": "piece", "order": 8 },
    { "position": { "row": -1, "col": 2 }, "type": "final", "order": 9 }
  ],
  "thumbnail": "",
  "createdAt": 1766939214356
}
```

**Analysis**:
- Starts at (3,1), places trap at (2,1) immediately
- Places traps at (3,0) and (3,3) - blocking horizontal movement
- Moves right to (3,2) then up column 2 to final
- 9-move sequence (8 moves + final)
- 3 traps strategically placed
- 1 direction change (horizontal then vertical) - within floor(4/2) = 2 limit

## Output Format

Each board must be a valid JSON object following this structure:

### Field Specifications
- **id**: Unique string identifier
  - **Format**: `{size}x{size}-{difficulty}-{number}` (e.g., "2x2-easy-1", "4x4-hard-3")
  - Must be unique across all boards
  - Use lowercase for difficulty ("easy", "medium", "hard")
- **name**: Human-readable name (e.g., "2x2 Easy #1", "4x4 Hard #3")
- **boardSize**: Number matching the grid dimensions (2-10)
- **grid**: 2D array of strings, each either "piece", "empty", or "trap" (NEVER "final")
  - Must be boardSize × boardSize in dimensions
  - Row 0 is the top, row (boardSize-1) is the bottom
- **sequence**: Array of move objects solving the board
  - Each move has position {row, col}, type, and order
  - Last move must be type "final" at row -1
- **thumbnail**: Empty string "" (client generates thumbnails automatically)
- **createdAt**: Timestamp in milliseconds (use Date.now() or similar)

## Quality Guidelines

### Good Board Characteristics
- **Clear intent**: Easy to understand what the board is testing
- **Fair challenge**: Difficulty matches the classification
- **Strategic value**: Board serves a purpose in gameplay
- **Proper solution**: Sequence actually solves the board

### Avoid
- **Impossible boards**: No valid path to final
- **Trivial traps**: Traps that don't create meaningful choices
- **Excessive backtracking**: Paths that fold back on themselves
- **Duplicate patterns**: Too many similar boards in the same size/difficulty

## Board Generation Strategy Summary

1. **Choose exit column**: Decide which column (0 to boardSize-1) will lead to row -1 (the goal)
2. **Place the starting piece**: Choose strategic starting position (typically bottom row)
3. **Add traps** (if difficulty > easy): Block obvious/natural paths on the grid
4. **Fill with empty cells**: Create the navigable space between start and exit
5. **Generate sequence**: Create the solution path from start → row 0 → row -1
6. **Validate**:
   - Ensure all sequence positions (except final) match grid contents
   - Ensure final move is at row -1
   - Ensure grid contains only "piece", "empty", "trap" (NEVER "final")
7. **Export**: Create properly formatted JSON

**Remember**: The "final" destination is NOT on the grid - it's the space beyond row 0, at row -1.
