// Level 3: Castle 1-4 Recreation
const level3Map = [];
for (let y = 0; y < 15; y++) {
    let row = [];
    for (let x = 0; x < 150; x++) {
        const isCeiling = y < 2 && x < 135;
        
        if (y >= 13) {
            // Lava pits at columns 25-32, 60-70, 95-108
            const isLavaPit = (x >= 25 && x <= 32) || (x >= 60 && x <= 70) || (x >= 95 && x <= 108);
            if (isLavaPit) {
                if (y === 14) {
                    row.push(TILES.LAVA);
                } else {
                    row.push(TILES.EMPTY);
                }
            } else {
                row.push(TILES.CASTLE_BRICK);
            }
        } else if (isCeiling) {
            row.push(TILES.CASTLE_BRICK);
        } else {
            row.push(TILES.EMPTY);
        }
    }
    level3Map.push(row);
}

// Platforms over the first lava pit (col 25-32)
level3Map[10][27] = TILES.CASTLE_BRICK;
level3Map[10][28] = TILES.CASTLE_BRICK;
level3Map[10][29] = TILES.CASTLE_BRICK;

// Mid-level platforms & bricks (col 40-52)
for (let x = 40; x <= 50; x++) {
    level3Map[8][x] = TILES.CASTLE_BRICK;
    if (x % 3 === 0) level3Map[5][x] = TILES.COIN_TILE;
}

// Platforms over the second lava pit (col 60-70)
level3Map[9][62] = TILES.CASTLE_BRICK;
level3Map[9][63] = TILES.CASTLE_BRICK;
level3Map[7][67] = TILES.CASTLE_BRICK;
level3Map[7][68] = TILES.CASTLE_BRICK;

// Platforms over the third lava pit (col 95-108)
for (let x = 96; x <= 106; x += 3) {
    level3Map[10][x] = TILES.CASTLE_BRICK;
    level3Map[9][x] = TILES.COIN_TILE;
}

// Castle maze style walls (col 115-125)
for (let y = 2; y <= 8; y++) {
    level3Map[y][118] = TILES.CASTLE_BRICK;
}
// Step platforms to climb or pass under
level3Map[10][120] = TILES.CASTLE_BRICK;
level3Map[10][121] = TILES.CASTLE_BRICK;
level3Map[7][122] = TILES.CASTLE_BRICK;
level3Map[7][123] = TILES.CASTLE_BRICK;

for (let y = 2; y <= 8; y++) {
    level3Map[y][124] = TILES.CASTLE_BRICK;
}

// Bowser's Bridge & Axe (col 125-134)
for (let x = 125; x <= 133; x++) {
    level3Map[12][x] = TILES.BRIDGE;
    level3Map[13][x] = TILES.EMPTY;
    level3Map[14][x] = TILES.LAVA;
}
level3Map[11][134] = TILES.AXE;

// Staircase before flagpole
for (let i = 0; i < 4; i++) {
    for (let j = 0; j <= i; j++) {
        level3Map[12 - j][136 + i] = TILES.CASTLE_BRICK;
    }
}

// Flagpole
level3Map[2][144] = TILES.FLAG_TOP;
for (let y = 3; y <= 12; y++) {
    level3Map[y][144] = TILES.FLAGPOLE;
}
level3Map[12][144] = TILES.CASTLE_BRICK; // Base block

const level3 = {
    map: level3Map,
    background: 'black',
    playerSpawn: { x: 32, y: 192 },
    enemies: [
        { x: 300, y: 192, type: 'koopa' },
        { x: 550, y: 120, type: 'goomba' },
        { x: 780, y: 192, type: 'goomba' },
        { x: 920, y: 192, type: 'koopa' },
        { x: 1100, y: 192, type: 'goomba' },
        { x: 2020, y: 160, type: 'bowser' } // Bowser Boss on the bridge!
    ]
};
