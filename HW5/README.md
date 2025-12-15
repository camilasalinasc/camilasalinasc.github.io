# COMP 4610 GUI Programming I - HW5 Writeup
## Scrabble with Drag-and-Drop

---

### Author Information
- **Name:** Camila Salinas Camacho
- **Email:** Camila_SalinasCamacho@student.uml.edu
- **Assignment:** HW5 - Implementing a Bit of Scrabble with Drag-and-Drop

---

### GitHub Information
- **URL:** https://camilasalinasc.github.io/HW5/index.html
- **GitHub Repository:** https://github.com/camilasalinasc/camilasalinasc.github.io

---

## Project Description

This project implements a single-line Scrabble game using HTML5, CSS3, JavaScript, and jQuery UI. The game features a purple color theme and allows users to drag letter tiles from a rack onto a game board to form words. The application calculates scores based on letter values and applies bonus square multipliers.

---

## Implemented Features - Program Integrity / Design

### 1. Random Tile Selection from Proper Distribution - WORKING

**Implementation:** The `drawRandomTile()` function in `scrabble.js` (lines 120-140) implements proper random selection from the tile distribution.

**How it works:**
- Uses the `ScrabbleTiles` associative array containing all 100 tiles with correct distribution (A=9, B=2, C=2, D=4, E=12, etc.)
- Builds an array of all available letters, adding each letter multiple times based on `number-remaining`
- Uses `Math.random()` to select randomly from available letters
- Decrements the count when a tile is drawn

**Code snippet:**
```javascript
var availableLetters = [];
for (var letter in ScrabbleTiles) {
    for (var i = 0; i < ScrabbleTiles[letter]["number-remaining"]; i++) {
        availableLetters.push(letter);
    }
}
var randomIndex = Math.floor(Math.random() * availableLetters.length);
```

---

### 2. Tiles Can Be Dragged-and-Dropped onto Board Squares - WORKING

**Implementation:** jQuery UI `draggable()` and `droppable()` widgets handle all drag-and-drop functionality.

**How it works:**
- Each tile is made draggable in `createTileElement()` function
- Each board square is made droppable in `initializeBoard()` function
- Uses `revert: "invalid"` to bounce tiles back if not dropped on valid target
- Visual feedback with `hoverClass: "ui-droppable-hover"`

**Code snippet:**
```javascript
$tile.draggable({
    revert: "invalid",
    revertDuration: 200,
    zIndex: 1000
});

$square.droppable({
    accept: ".tile",
    hoverClass: "ui-droppable-hover",
    drop: function(event, ui) {
        handleTileDrop($(this), ui.draggable);
    }
});
```

---

### 3. Program Identifies Which Tile Dropped on Which Square - WORKING

**Implementation:** The `handleTileDrop()` function captures tile and square information.

**How it works:**
- Each board square has `data-index` and `data-type` attributes
- Each tile has `data-letter` and `data-value` attributes
- When dropped, handler extracts: square index, square type, letter, and value
- Information stored in `gameState.tilesOnBoard` array

**Code snippet:**
```javascript
function handleTileDrop($square, $tile) {
    var squareIndex = parseInt($square.attr("data-index"));
    var letter = $tile.attr("data-letter");
    
    gameState.tilesOnBoard.push({
        squareIndex: squareIndex,
        letter: letter,
        squareType: $square.attr("data-type"),
        value: parseInt($tile.attr("data-value"))
    });
}
```

---

### 4. Board Includes At Least Two Bonus Squares - WORKING

**Implementation:** The `boardConfig` array defines 4 types of bonus squares.

**Bonus squares included:**
- **Double Word Score** - Pink squares at positions 1 and 11
- **Double Letter Score** - Light blue squares at positions 5 and 8
- (Board also supports Triple Word and Triple Letter if desired)

**Code snippet:**
```javascript
var boardConfig = [
    { type: "normal", label: "" },
    { type: "double-word", label: "DOUBLE<br>WORD<br>SCORE" },
    // ... more squares
    { type: "double-letter", label: "DOUBLE<br>LETTER<br>SCORE" },
    // ...
];
```

---

### 5. Scoring Updates Dynamically with Bonus Multipliers - WORKING

**Implementation:** The `calculateCurrentScore()` function applies all bonuses correctly.

**How it works:**
- Called after every tile placement
- Letter multipliers (DL, TL) applied to individual letter values first
- Word multipliers (DW, TW) applied to the total sum
- Score display updates in real-time

**Code snippet:**
```javascript
gameState.tilesOnBoard.forEach(function(tile) {
    var letterScore = tile.value;
    switch (tile.squareType) {
        case "double-letter": letterScore *= 2; break;
        case "triple-letter": letterScore *= 3; break;
        case "double-word": wordMultiplier *= 2; break;
        case "triple-word": wordMultiplier *= 3; break;
    }
    baseScore += letterScore;
});
gameState.currentScore = baseScore * wordMultiplier;
```

---

### 6. Multiple Words Can Be Played - WORKING

**Implementation:** After submitting a word, the board clears and play continues.

**How it works:**
- `submitWord()` adds current score to total
- `clearBoard()` removes all tiles from board
- `dealTilesToHand()` replenishes tiles
- Game continues until tiles depleted or user restarts

---

### 7. Board Cleared After Each Round - WORKING

**Implementation:** The `clearBoard()` function restores board to initial state.

**Code snippet:**
```javascript
function clearBoard() {
    $(".board-square").each(function(index) {
        $(this).removeClass("occupied");
        $(this).html(boardConfig[index].label);
    });
}
```

---

### 8. Only Needed Tiles Dealt to Bring Hand to 7 - WORKING

**Implementation:** The `dealTilesToHand()` function calculates tiles needed.

**Code snippet:**
```javascript
function dealTilesToHand() {
    var $rack = $("#tile-rack");
    var currentTileCount = $rack.find(".tile").length;
    var tilesToDeal = 7 - currentTileCount;
    
    for (var i = 0; i < tilesToDeal; i++) {
        var letter = drawRandomTile();
        // ... create and add tile
    }
}
```

---

### 9. Score Kept for Multiple Words - Next vs Restart - WORKING

**Implementation:** Two different behaviors for continuing vs restarting.

- **Submit Word:** Adds current word score to `totalScore`, clears board, deals new tiles
- **Restart Game:** Resets `totalScore` to 0, resets all tile distributions, starts fresh

---

### 10. Tiles Bounce Back if Dropped Outside Board - WORKING

**Implementation:** jQuery UI's `revert: "invalid"` option handles this automatically.

**How it works:**
- If tile is not dropped on a valid droppable target, it reverts to original position
- `revertDuration: 200` provides smooth animation
- Only the rack and board squares are valid drop targets

---

### 11. Tiles on Board Can Be Moved Back to Rack - WORKING

**Implementation:** Placed tiles remain draggable and rack is a drop target.

**How it works:**
- After placement, tile is made draggable with `data("originalSquare")` reference
- `handleTileReturnToRack()` clears the square and restores label
- New tile element created on rack

---

### 12. Adjacent Placement Required - Next Space to Right Only - WORKING

**Implementation:** The `isValidPlacement()` function ensures tiles are placed to the right.

**How it works:**
- First tile can be placed anywhere on the board
- After first tile, subsequent tiles MUST be placed in the next available space to the right
- Finds the rightmost placed tile and only allows placement at index + 1
- Tiles placed elsewhere bounce back to rack

**Code snippet:**
```javascript
function isValidPlacement(squareIndex) {
    if (gameState.tilesOnBoard.length === 0) return true;
    
    var placedIndices = gameState.tilesOnBoard.map(function(t) {
        return t.squareIndex;
    });
    var rightmostIndex = Math.max.apply(null, placedIndices);
    
    // Must be exactly one space to the right
    if (squareIndex === rightmostIndex + 1) {
        return true;
    }
    return false;
}
```

---

### 13. User Can Always Restart the Game - WORKING

**Implementation:** The `restartGame()` function provides complete reset.

**How it works:**
- Resets all tile distributions to original values
- Clears all game state variables
- Clears board and swap area
- Reinitializes rack with new tiles
- Resets scores to 0

---