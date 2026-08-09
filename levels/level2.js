// Level 2: Underground 1-2 Recreation
const level2Map = [];
for (let y = 0; y < 15; y++) {
    let row = [];
    for (let x = 0; x < 212; x++) {
        const isCeiling = y < 2 && x < 190;
        const isFloor = y >= 13;
        
        if (isFloor) {
            // Pits at columns 60-63 and 110-113
            if ((x >= 60 && x <= 63) || (x >= 110 && x <= 113)) {
                row.push(TILES.EMPTY);
            } else {
                row.push(TILES.UNDERGROUND_BRICK);
            }
        } else if (isCeiling) {
            row.push(TILES.UNDERGROUND_BRICK);
        } else {
            row.push(TILES.EMPTY);
        }
    }
    level2Map.push(row);
}

// Helper to place pipes cleanly in underground
function placeUndergroundPipe(col, height) {
    const startY = 13 - height;
    level2Map[startY][col] = TILES.PIPE_TL;
    level2Map[startY][col + 1] = TILES.PIPE_TR;
    for (let y = startY + 1; y < 13; y++) {
        level2Map[y][col] = TILES.PIPE_BL;
        level2Map[y][col + 1] = TILES.PIPE_BR;
    }
}

// Platforms and layout elements
for (let x = 12; x <= 22; x++) {
    level2Map[9][x] = TILES.UNDERGROUND_BRICK;
    if (x % 3 === 0) level2Map[5][x] = TILES.COIN_TILE;
}

level2Map[9][17] = TILES.QUESTION_POWERUP; // Mushroom question block

// Pipe 1
placeUndergroundPipe(32, 2);

// High block platform with coins
for (let x = 40; x <= 52; x++) {
    level2Map[6][x] = TILES.UNDERGROUND_BRICK;
    level2Map[5][x] = TILES.COIN_TILE;
}

// Pipe 2
placeUndergroundPipe(70, 3);

// Long row of blocks over the pit
for (let x = 58; x <= 65; x++) {
    level2Map[9][x] = TILES.UNDERGROUND_BRICK;
}
level2Map[9][61] = TILES.QUESTION_COIN;

// High floating coins
for (let x = 80; x <= 88; x++) {
    level2Map[4][x] = TILES.COIN_TILE;
    level2Map[9][x] = TILES.UNDERGROUND_BRICK;
}
level2Map[9][84] = TILES.QUESTION_POWERUP;

// Staircases before flagpole
for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
        level2Map[12 - j][180 + i] = TILES.UNDERGROUND_BRICK;
    }
}

// Flagpole
level2Map[2][198] = TILES.FLAG_TOP;
for (let y = 3; y <= 12; y++) {
    level2Map[y][198] = TILES.FLAGPOLE;
}
level2Map[12][198] = TILES.UNDERGROUND_BRICK; // Base block

const level2 = {
    map: level2Map,
    background: 'black',
    playerSpawn: { x: 32, y: 192 },
    enemies: [
        { x: 280, y: 192, type: 'goomba' },
        { x: 450, y: 192, type: 'goomba' },
        { x: 620, y: 120, type: 'goomba' }, // on the platform
        { x: 800, y: 192, type: 'koopa' },
        { x: 1050, y: 192, type: 'goomba' },
        { x: 1250, y: 192, type: 'koopa' },
        { x: 1400, y: 192, type: 'goomba' },
        { x: 1430, y: 192, type: 'goomba' }
    ]
};
