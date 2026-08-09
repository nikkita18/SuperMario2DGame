// Level 1: Overworld 1-1 Recreation
const level1Map = [];
for (let y = 0; y < 15; y++) {
    let row = [];
    for (let x = 0; x < 212; x++) {
        if (y >= 13) {
            // Pits at columns 69-70, 86-87, and 153-154
            if ((x >= 69 && x <= 70) || (x >= 86 && x <= 87) || (x >= 153 && x <= 154)) {
                row.push(TILES.EMPTY);
            } else {
                row.push(TILES.GROUND);
            }
        } else {
            row.push(TILES.EMPTY);
        }
    }
    level1Map.push(row);
}

// Helper to place pipes cleanly
function placePipe(col, height) {
    const startY = 13 - height;
    level1Map[startY][col] = TILES.PIPE_TL;
    level1Map[startY][col + 1] = TILES.PIPE_TR;
    for (let y = startY + 1; y < 13; y++) {
        level1Map[y][col] = TILES.PIPE_BL;
        level1Map[y][col + 1] = TILES.PIPE_BR;
    }
}

// Helper to place staircase
function placeStaircase(startCol, height, ascending = true) {
    for (let i = 0; i < height; i++) {
        const col = startCol + i;
        const colHeight = ascending ? (i + 1) : (height - i);
        for (let j = 0; j < colHeight; j++) {
            level1Map[12 - j][col] = TILES.HARD_BLOCK;
        }
    }
}

// Early Block Structures
level1Map[9][16] = TILES.QUESTION_POWERUP; // Mushroom Question Block
level1Map[9][20] = TILES.BRICK;
level1Map[9][21] = TILES.QUESTION_COIN;
level1Map[9][22] = TILES.BRICK;
level1Map[9][23] = TILES.QUESTION_COIN;
level1Map[9][24] = TILES.BRICK;
level1Map[5][22] = TILES.QUESTION_COIN; // High Question Block

// Pipes
placePipe(28, 2); // 2-block high pipe
placePipe(38, 3); // 3-block high pipe
placePipe(46, 4); // 4-block high pipe
placePipe(57, 4); // 4-block high pipe (leads to underground in original)

// Hidden Mushroom / Powerup Brick
level1Map[9][64] = TILES.QUESTION_POWERUP;

// Second row of Bricks and Question Blocks
level1Map[9][77] = TILES.BRICK;
level1Map[9][78] = TILES.QUESTION_COIN;
level1Map[9][79] = TILES.BRICK;

// High bricks
for (let x = 80; x <= 87; x++) {
    level1Map[5][x] = TILES.BRICK;
}
level1Map[5][81] = TILES.QUESTION_COIN;
level1Map[5][82] = TILES.QUESTION_COIN;

// Low bricks after pit
level1Map[9][91] = TILES.BRICK;
level1Map[9][92] = TILES.QUESTION_COIN;
level1Map[9][93] = TILES.BRICK;
level1Map[9][94] = TILES.QUESTION_COIN;
level1Map[9][100] = TILES.BRICK;
level1Map[5][100] = TILES.QUESTION_COIN;
level1Map[5][101] = TILES.QUESTION_POWERUP; // Star Powerup Block
level1Map[9][101] = TILES.BRICK;
level1Map[9][102] = TILES.BRICK;

// High platforms of coins
for (let x = 110; x <= 114; x++) {
    level1Map[6][x] = TILES.COIN_TILE;
}

// Staircase 1 (ascending) & 2 (descending) around first pit
placeStaircase(134, 4, true);
placeStaircase(140, 4, false);

// Staircase 3 (ascending) & 4 (descending) around second pit
placeStaircase(148, 4, true);
// Extra hard block at the end of first landing
level1Map[12][152] = TILES.HARD_BLOCK;
placeStaircase(155, 4, false);

// Final Flagpole Staircase (height 8)
placeStaircase(181, 8, true);
for (let y = 5; y <= 12; y++) {
    level1Map[y][189] = TILES.HARD_BLOCK; // 9-wide column base
}

// Flagpole
level1Map[2][198] = TILES.FLAG_TOP;
for (let y = 3; y <= 12; y++) {
    level1Map[y][198] = TILES.FLAGPOLE;
}
level1Map[12][198] = TILES.HARD_BLOCK; // Flagpole base block

// Castle placement at end (handled by Level.draw at x=202)

const level1 = {
    map: level1Map,
    background: '#5c94fc',
    playerSpawn: { x: 32, y: 192 },
    enemies: [
        { x: 350, y: 192, type: 'goomba' },
        { x: 500, y: 192, type: 'goomba' },
        { x: 650, y: 192, type: 'goomba' },
        { x: 680, y: 192, type: 'goomba' },
        { x: 800, y: 192, type: 'koopa' },
        { x: 950, y: 192, type: 'goomba' },
        { x: 1000, y: 192, type: 'goomba' },
        { x: 1100, y: 192, type: 'koopa' },
        { x: 1200, y: 192, type: 'goomba' },
        { x: 1300, y: 192, type: 'goomba' },
        { x: 1650, y: 192, type: 'goomba' },
        { x: 1700, y: 192, type: 'goomba' }
    ]
};
