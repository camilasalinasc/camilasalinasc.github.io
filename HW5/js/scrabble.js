/*
  Author: Camila Salinas Camacho
  GitHub Username: camilasalinasc
  Student Email: Camila_SalinasCamacho@student.uml.edu

  Description: Complete game logic for single-line Scrabble with jQuery UI.
  Implements drag-and-drop, scoring with bonus squares, and tile management.

  References / Sources:
    - jQuery UI Draggable API: https://api.jqueryui.com/draggable/
    - jQuery UI Droppable API: https://api.jqueryui.com/droppable/
    - jQuery Documentation: https://api.jquery.com/
    - W3Schools JavaScript Arrays: https://www.w3schools.com/js/js_arrays.asp
    - W3Schools JavaScript Objects: https://www.w3schools.com/js/js_objects.asp
    - Scrabble Tile Data Structure: Jesse M. Heines, UMass Lowell Computer Science
*/

$(document).ready(function() {
    "use strict";

    // ========================================
    // SCRABBLE TILES DATA STRUCTURE
    // Credit: Jesse M. Heines, UMass Lowell Computer Science
    // Contains letter values and distribution counts
    // ========================================
    var ScrabbleTiles = [];
    ScrabbleTiles["A"] = { "value": 1,  "original-distribution": 9,  "number-remaining": 9  };
    ScrabbleTiles["B"] = { "value": 3,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["C"] = { "value": 3,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["D"] = { "value": 2,  "original-distribution": 4,  "number-remaining": 4  };
    ScrabbleTiles["E"] = { "value": 1,  "original-distribution": 12, "number-remaining": 12 };
    ScrabbleTiles["F"] = { "value": 4,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["G"] = { "value": 2,  "original-distribution": 3,  "number-remaining": 3  };
    ScrabbleTiles["H"] = { "value": 4,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["I"] = { "value": 1,  "original-distribution": 9,  "number-remaining": 9  };
    ScrabbleTiles["J"] = { "value": 8,  "original-distribution": 1,  "number-remaining": 1  };
    ScrabbleTiles["K"] = { "value": 5,  "original-distribution": 1,  "number-remaining": 1  };
    ScrabbleTiles["L"] = { "value": 1,  "original-distribution": 4,  "number-remaining": 4  };
    ScrabbleTiles["M"] = { "value": 3,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["N"] = { "value": 1,  "original-distribution": 6,  "number-remaining": 6  };
    ScrabbleTiles["O"] = { "value": 1,  "original-distribution": 8,  "number-remaining": 8  };
    ScrabbleTiles["P"] = { "value": 3,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["Q"] = { "value": 10, "original-distribution": 1,  "number-remaining": 1  };
    ScrabbleTiles["R"] = { "value": 1,  "original-distribution": 6,  "number-remaining": 6  };
    ScrabbleTiles["S"] = { "value": 1,  "original-distribution": 4,  "number-remaining": 4  };
    ScrabbleTiles["T"] = { "value": 1,  "original-distribution": 6,  "number-remaining": 6  };
    ScrabbleTiles["U"] = { "value": 1,  "original-distribution": 4,  "number-remaining": 4  };
    ScrabbleTiles["V"] = { "value": 4,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["W"] = { "value": 4,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["X"] = { "value": 8,  "original-distribution": 1,  "number-remaining": 1  };
    ScrabbleTiles["Y"] = { "value": 4,  "original-distribution": 2,  "number-remaining": 2  };
    ScrabbleTiles["Z"] = { "value": 10, "original-distribution": 1,  "number-remaining": 1  };
    ScrabbleTiles["_"] = { "value": 0,  "original-distribution": 2,  "number-remaining": 2  };

    // ========================================
    // BOARD CONFIGURATION
    // Single row with multiple bonus types (requirement: at least 2 types)
    // Includes: Double Word, Double Letter, Triple Letter, Triple Word
    // ========================================
    var boardConfig = [
        { type: "normal", label: "" },
        { type: "double-word", label: "DOUBLE<br>WORD<br>SCORE" },
        { type: "normal", label: "" },
        { type: "normal", label: "" },
        { type: "normal", label: "" },
        { type: "double-letter", label: "DOUBLE<br>LETTER<br>SCORE" },
        { type: "normal", label: "" },
        { type: "normal", label: "" },
        { type: "double-letter", label: "DOUBLE<br>LETTER<br>SCORE" },
        { type: "normal", label: "" },
        { type: "normal", label: "" },
        { type: "double-word", label: "DOUBLE<br>WORD<br>SCORE" },
        { type: "normal", label: "" }
    ];

    // ========================================
    // GAME STATE VARIABLES
    // Tracks scores, placed tiles, and swap tiles
    // ========================================
    var gameState = {
        totalScore: 0,
        currentScore: 0,
        tilesOnBoard: [],    // Array of placed tile objects
        tilesInSwap: []      // Array of letters in swap area
    };

    // ========================================
    // INITIALIZATION FUNCTIONS
    // ========================================
    
    /**
     * initializeBoard()
     * Creates the game board with configured squares
     * Each square is made droppable for tile placement
     */
    function initializeBoard() {
        var $board = $("#scrabble-board");
        $board.empty();

        // Create each board square from config
        boardConfig.forEach(function(square, index) {
            var $square = $("<div>")
                .addClass("board-square")
                .addClass(square.type)
                .attr("data-index", index)
                .attr("data-type", square.type)
                .html(square.label);

            // Make square droppable (jQuery UI)
            $square.droppable({
                accept: ".tile",
                hoverClass: "ui-droppable-hover",
                tolerance: "intersect",
                drop: function(event, ui) {
                    handleTileDrop($(this), ui.draggable);
                }
            });

            $board.append($square);
        });
    }

    /**
     * getTotalRemainingTiles()
     * Calculates total tiles remaining in the bag
     * @returns {number} Total remaining tiles
     */
    function getTotalRemainingTiles() {
        var total = 0;
        for (var letter in ScrabbleTiles) {
            if (ScrabbleTiles.hasOwnProperty(letter)) {
                total += ScrabbleTiles[letter]["number-remaining"];
            }
        }
        return total;
    }

    /**
     * drawRandomTile()
     * Randomly selects a tile from available tiles based on distribution
     * @returns {string|null} Selected letter or null if bag is empty
     */
    function drawRandomTile() {
        // Build array of all available letters
        var availableLetters = [];
        for (var letter in ScrabbleTiles) {
            if (ScrabbleTiles.hasOwnProperty(letter)) {
                // Add letter multiple times based on remaining count
                for (var i = 0; i < ScrabbleTiles[letter]["number-remaining"]; i++) {
                    availableLetters.push(letter);
                }
            }
        }

        // Return null if no tiles left
        if (availableLetters.length === 0) {
            return null;
        }

        // Select random letter and decrease count
        var randomIndex = Math.floor(Math.random() * availableLetters.length);
        var selectedLetter = availableLetters[randomIndex];
        ScrabbleTiles[selectedLetter]["number-remaining"]--;

        return selectedLetter;
    }

    /**
     * createTileElement()
     * Creates a draggable tile image element
     * @param {string} letter - The letter for the tile
     * @returns {jQuery} The tile element
     */
    function createTileElement(letter) {
        var imageName = letter === "_" ? "Blank" : letter;
        var $tile = $("<img>")
            .addClass("tile")
            .attr("src", "images/tiles/Scrabble_Tile_" + imageName + ".jpg")
            .attr("alt", letter === "_" ? "Blank" : letter)
            .attr("data-letter", letter)
            .attr("data-value", ScrabbleTiles[letter].value);

        // Make tile draggable (jQuery UI)
        $tile.draggable({
            revert: "invalid",      // Bounce back if not dropped on valid target
            revertDuration: 200,
            zIndex: 1000,
            start: function() {
                $(this).css("z-index", 1000);
            }
        });

        return $tile;
    }

    /**
     * dealTilesToHand()
     * Deals tiles to fill player's hand to 7 tiles
     * Only deals the number needed (requirement)
     */
    function dealTilesToHand() {
        var $rack = $("#tile-rack");
        var currentTileCount = $rack.find(".tile").length;
        var tilesToDeal = 7 - currentTileCount;

        for (var i = 0; i < tilesToDeal; i++) {
            var letter = drawRandomTile();
            if (letter === null) {
                showMessage("No more tiles in the bag!", "info");
                break;
            }
            var $tile = createTileElement(letter);
            $rack.append($tile);
        }
    }

    /**
     * initializeRack()
     * Sets up the tile rack as a droppable zone for returning tiles
     */
    function initializeRack() {
        var $rack = $("#tile-rack");
        $rack.empty();

        // Make rack droppable for returning tiles
        $rack.droppable({
            accept: ".tile",
            drop: function(event, ui) {
                handleTileReturnToRack(ui.draggable);
            }
        });

        dealTilesToHand();
    }

    /**
     * initializeSwapArea()
     * Sets up the swap area as droppable for tile exchange
     */
    function initializeSwapArea() {
        var $swap = $("#swap-area");
        
        $swap.droppable({
            accept: ".tile",
            drop: function(event, ui) {
                handleTileToSwap(ui.draggable);
            }
        });
    }

    // ========================================
    // DRAG AND DROP HANDLERS
    // ========================================

    /**
     * handleTileDrop()
     * Handles when a tile is dropped on a board square
     * Validates placement and updates game state
     * Returns tile to rack if placement is invalid
     * @param {jQuery} $square - The target square
     * @param {jQuery} $tile - The dropped tile
     */
    function handleTileDrop($square, $tile) {
        var squareIndex = parseInt($square.attr("data-index"));
        var letter = $tile.attr("data-letter");

        // Check if square is already occupied - return to rack
        if ($square.hasClass("occupied")) {
            showMessage("That square is already occupied!", "error");
            returnTileToRack($tile);
            return;
        }

        // Validate adjacent placement (requirement) - return to rack if invalid
        if (!isValidPlacement(squareIndex)) {
            showMessage("Invalid placement! Place tiles adjacent to existing tiles.", "error");
            returnTileToRack($tile);
            return;
        }

        // Place the tile on the square
        $square.addClass("occupied");
        $square.empty();
        
        // Create tile image for the board
        var $placedTile = $tile.clone();
        $placedTile.addClass("tile-on-board")
            .css({ position: "static", left: "auto", top: "auto" })
            .removeClass("ui-draggable ui-draggable-handle");
        
        $square.append($placedTile);

        // Make placed tile draggable back to rack
        $placedTile.draggable({
            revert: "invalid",
            revertDuration: 200,
            zIndex: 1000,
            start: function() {
                $(this).data("originalSquare", $square);
            }
        });

        // Remove original tile from source
        $tile.remove();

        // Track the placement
        gameState.tilesOnBoard.push({
            squareIndex: squareIndex,
            letter: letter,
            squareType: $square.attr("data-type"),
            value: parseInt($placedTile.attr("data-value"))
        });

        // Update score display
        calculateCurrentScore();
        showMessage("", "");
    }

    /**
     * returnTileToRack()
     * Returns a tile to the rack when placement is invalid
     * @param {jQuery} $tile - The tile to return
     */
    function returnTileToRack($tile) {
        var letter = $tile.attr("data-letter");
        
        // Remove the dragged tile
        $tile.remove();
        
        // Create new tile on rack
        var $newTile = createTileElement(letter);
        $newTile.css({ position: "static" });
        $("#tile-rack").append($newTile);
    }

    /**
     * handleTileReturnToRack()
     * Handles when a tile is returned to the rack from board or swap
     * @param {jQuery} $tile - The tile being returned
     */
    function handleTileReturnToRack($tile) {
        var letter = $tile.attr("data-letter");
        var $originalSquare = $tile.data("originalSquare");

        // If tile came from board, clear that square
        if ($originalSquare) {
            $originalSquare.removeClass("occupied");
            var squareIndex = parseInt($originalSquare.attr("data-index"));
            var config = boardConfig[squareIndex];
            $originalSquare.html(config.label);

            // Remove from tilesOnBoard tracking
            gameState.tilesOnBoard = gameState.tilesOnBoard.filter(function(t) {
                return t.squareIndex !== squareIndex;
            });
        }

        // Remove from swap tracking if applicable
        gameState.tilesInSwap = gameState.tilesInSwap.filter(function(t) {
            return t !== letter;
        });

        // Remove the dragged tile element
        $tile.remove();

        // Create new tile on rack
        var $newTile = createTileElement(letter);
        $newTile.css({ position: "static" });
        $("#tile-rack").append($newTile);

        // Update displays
        updateSwapAreaDisplay();
        calculateCurrentScore();
    }

    /**
     * handleTileToSwap()
     * Handles when a tile is dropped in the swap area
     * @param {jQuery} $tile - The tile being swapped
     */
    function handleTileToSwap($tile) {
        var letter = $tile.attr("data-letter");
        var $originalSquare = $tile.data("originalSquare");

        // If tile came from board, clear that square
        if ($originalSquare) {
            $originalSquare.removeClass("occupied");
            var squareIndex = parseInt($originalSquare.attr("data-index"));
            var config = boardConfig[squareIndex];
            $originalSquare.html(config.label);

            gameState.tilesOnBoard = gameState.tilesOnBoard.filter(function(t) {
                return t.squareIndex !== squareIndex;
            });
        }

        // Track in swap area
        gameState.tilesInSwap.push(letter);

        // Position tile in swap area
        $tile.css({ position: "relative", left: "auto", top: "auto" });
        $tile.data("originalSquare", null);
        $tile.data("inSwap", true);
        $("#swap-area").append($tile);

        updateSwapAreaDisplay();
        calculateCurrentScore();
    }

    /**
     * updateSwapAreaDisplay()
     * Shows/hides the swap icon based on tiles in area
     */
    function updateSwapAreaDisplay() {
        if (gameState.tilesInSwap.length > 0) {
            $("#swap-area").addClass("has-tiles");
        } else {
            $("#swap-area").removeClass("has-tiles");
        }
    }

    /**
     * isValidPlacement()
     * Checks if tile placement is valid
     * First tile can go anywhere, subsequent tiles must be placed:
     * - Directly to the RIGHT of the rightmost existing tile, OR
     * - In a GAP between existing tiles (to fill removed tile spots)
     * @param {number} squareIndex - Index of target square
     * @returns {boolean} True if placement is valid
     */
    function isValidPlacement(squareIndex) {
        // First tile can go anywhere
        if (gameState.tilesOnBoard.length === 0) {
            return true;
        }

        // Get all placed tile indices
        var placedIndices = gameState.tilesOnBoard.map(function(t) {
            return t.squareIndex;
        });
        
        var leftmostIndex = Math.min.apply(null, placedIndices);
        var rightmostIndex = Math.max.apply(null, placedIndices);

        // Allow placement to the right of rightmost tile
        if (squareIndex === rightmostIndex + 1) {
            return true;
        }

        // Allow filling a gap between leftmost and rightmost tiles
        // A gap is any empty square between the leftmost and rightmost placed tiles
        if (squareIndex >= leftmostIndex && squareIndex <= rightmostIndex) {
            // Check if this position is not already occupied
            if (placedIndices.indexOf(squareIndex) === -1) {
                return true; // This is a gap - allow filling it
            }
        }

        return false;
    }
    
    /**
     * hasGapInWord()
     * Checks if there's a gap in the current word on the board
     * @returns {boolean} True if there's a gap
     */
    function hasGapInWord() {
        if (gameState.tilesOnBoard.length <= 1) {
            return false;
        }
        
        var placedIndices = gameState.tilesOnBoard.map(function(t) {
            return t.squareIndex;
        });
        
        var leftmostIndex = Math.min.apply(null, placedIndices);
        var rightmostIndex = Math.max.apply(null, placedIndices);
        
        // Check for gaps
        for (var i = leftmostIndex; i <= rightmostIndex; i++) {
            if (placedIndices.indexOf(i) === -1) {
                return true; // Found a gap
            }
        }
        
        return false;
    }

    // ========================================
    // SCORING FUNCTIONS
    // ========================================

    /**
     * getCurrentWord()
     * Gets the current word formed on the board
     * @returns {string} The word or empty string if invalid
     */
    function getCurrentWord() {
        if (gameState.tilesOnBoard.length === 0) {
            return "";
        }

        // Sort tiles by position
        var sortedTiles = gameState.tilesOnBoard.slice().sort(function(a, b) {
            return a.squareIndex - b.squareIndex;
        });

        // Check for gaps
        for (var i = 1; i < sortedTiles.length; i++) {
            if (sortedTiles[i].squareIndex - sortedTiles[i-1].squareIndex !== 1) {
                return ""; // Gap found - invalid
            }
        }

        // Build word string
        return sortedTiles.map(function(t) {
            return t.letter === "_" ? "?" : t.letter;
        }).join("");
    }

    /**
     * calculateCurrentScore()
     * Calculates score for current word with bonus multipliers
     */
    function calculateCurrentScore() {
        if (gameState.tilesOnBoard.length === 0) {
            gameState.currentScore = 0;
            updateScoreDisplay();
            return;
        }

        var baseScore = 0;
        var wordMultiplier = 1;

        // Process each tile
        gameState.tilesOnBoard.forEach(function(tile) {
            var letterScore = tile.value;

            // Apply bonus based on square type
            switch (tile.squareType) {
                case "double-letter":
                    letterScore *= 2;
                    break;
                case "triple-letter":
                    letterScore *= 3;
                    break;
                case "double-word":
                    wordMultiplier *= 2;
                    break;
                case "triple-word":
                    wordMultiplier *= 3;
                    break;
            }

            baseScore += letterScore;
        });

        // Apply word multiplier
        gameState.currentScore = baseScore * wordMultiplier;
        updateScoreDisplay();
    }

    /**
     * updateScoreDisplay()
     * Updates the score display elements
     */
    function updateScoreDisplay() {
        $("#current-score").text(gameState.currentScore);
        $("#total-score").text(gameState.totalScore);
    }

    // ========================================
    // GAME CONTROL FUNCTIONS
    // ========================================

    /**
     * submitWord()
     * Submits the current word for scoring
     */
    function submitWord() {
        var word = getCurrentWord();

        // Validate word exists
        if (word.length === 0) {
            showMessage("No valid word! Make sure tiles are adjacent.", "error");
            return;
        }

        // Validate minimum length
        if (word.length < 2) {
            showMessage("Word must be at least 2 letters!", "error");
            return;
        }

        // Check for gaps
        var sortedTiles = gameState.tilesOnBoard.slice().sort(function(a, b) {
            return a.squareIndex - b.squareIndex;
        });

        for (var i = 1; i < sortedTiles.length; i++) {
            if (sortedTiles[i].squareIndex - sortedTiles[i-1].squareIndex !== 1) {
                showMessage("There's a gap in your word! Fill it before submitting.", "error");
                return;
            }
        }

        // Add to total score
        gameState.totalScore += gameState.currentScore;
        showMessage("'" + word + "' scored " + gameState.currentScore + " points!", "success");

        // Clear board for next word
        clearBoard();
        gameState.tilesOnBoard = [];
        gameState.currentScore = 0;

        // Deal new tiles to fill hand
        dealTilesToHand();
        updateScoreDisplay();
    }

    /**
     * swapTiles()
     * Exchanges tiles in swap area for new ones
     * Only gives back the same number of tiles that were swapped
     */
    function swapTiles() {
        if (gameState.tilesInSwap.length === 0) {
            showMessage("Drop tiles in the swap area first!", "error");
            return;
        }

        // Store the number of tiles to swap
        var numTilesToSwap = gameState.tilesInSwap.length;

        // Return tiles to bag
        gameState.tilesInSwap.forEach(function(letter) {
            ScrabbleTiles[letter]["number-remaining"]++;
        });

        // Clear swap area
        $("#swap-area").find(".tile").remove();
        gameState.tilesInSwap = [];
        updateSwapAreaDisplay();

        // Deal only the same number of new tiles that were swapped
        var $rack = $("#tile-rack");
        for (var i = 0; i < numTilesToSwap; i++) {
            var letter = drawRandomTile();
            if (letter === null) {
                showMessage("No more tiles in the bag!", "info");
                break;
            }
            var $tile = createTileElement(letter);
            $rack.append($tile);
        }
        
        showMessage(numTilesToSwap + " tile(s) swapped!", "success");
    }

    /**
     * clearBoard()
     * Clears all tiles from the board
     */
    function clearBoard() {
        $(".board-square").each(function(index) {
            $(this).removeClass("occupied");
            $(this).html(boardConfig[index].label);
        });
    }

    /**
     * restartGame()
     * Completely resets the game
     */
    function restartGame() {
        // Reset tile distributions
        for (var letter in ScrabbleTiles) {
            if (ScrabbleTiles.hasOwnProperty(letter)) {
                ScrabbleTiles[letter]["number-remaining"] = 
                    ScrabbleTiles[letter]["original-distribution"];
            }
        }

        // Reset game state
        gameState.totalScore = 0;
        gameState.currentScore = 0;
        gameState.tilesOnBoard = [];
        gameState.tilesInSwap = [];

        // Clear and reinitialize
        clearBoard();
        $("#swap-area").find(".tile").remove();
        updateSwapAreaDisplay();
        initializeRack();
        updateScoreDisplay();
        showMessage("Game restarted!", "success");
    }

    /**
     * showMessage()
     * Displays a message to the user
     * @param {string} text - Message text
     * @param {string} type - Message type (success/error/info)
     */
    function showMessage(text, type) {
        var $msg = $("#game-message");
        $msg.removeClass("success error info");
        if (text) {
            $msg.addClass(type).text(text);
        } else {
            $msg.text("");
        }
    }

    // ========================================
    // EVENT HANDLERS
    // Button click handlers
    // ========================================
    
    $("#btn-submit").on("click", submitWord);
    $("#btn-swap").on("click", swapTiles);
    $("#btn-restart").on("click", restartGame);

    // ========================================
    // INITIALIZE GAME
    // Start the game when document is ready
    // ========================================
    
    initializeBoard();
    initializeRack();
    initializeSwapArea();

});
