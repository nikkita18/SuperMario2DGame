class Level {
    constructor(data) {
        this.map = JSON.parse(JSON.stringify(data.map));
        this.width = this.map[0].length;
        this.height = this.map.length;
        this.background = data.background || '#5c94fc';
        this.blockBounces = [];
        this.enemySpawns = data.enemies || [];
        this.animTimer = 0;

        // Parallax background elements
        this.clouds = [];
        this.hills = [];
        this.bushes = [];
        this._generateParallax();
    }

    _generateParallax() {
        const levelPixelWidth = this.width * TILE_SIZE;
        for (let i = 0; i < levelPixelWidth; i += 128) {
            if (Math.random() > 0.3) this.clouds.push({ x: i + Math.random() * 32, y: 28 + Math.random() * 30 });
            if (Math.random() > 0.5) this.hills.push({ x: i + Math.random() * 64, y: (this.height - 3) * TILE_SIZE });
            if (Math.random() > 0.4) this.bushes.push({ x: i + 32 + Math.random() * 32, y: (this.height - 2) * TILE_SIZE });
        }
    }

    getTile(tx, ty) {
        if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return TILES.EMPTY;
        return this.map[ty][tx];
    }

    setTile(tx, ty, id) {
        if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
            this.map[ty][tx] = id;
        }
    }

    isSolid(tx, ty) {
        const tile = this.getTile(tx, ty);
        const solids = [
            TILES.GROUND, TILES.BRICK, TILES.QUESTION_COIN, TILES.QUESTION_POWERUP,
            TILES.USED_BLOCK, TILES.PIPE_TL, TILES.PIPE_TR, TILES.PIPE_BL,
<<<<<<< HEAD
            TILES.PIPE_BR, TILES.HARD_BLOCK, TILES.UNDERGROUND_BRICK, TILES.CASTLE_BRICK,
            TILES.BRIDGE, TILES.AXE
=======
            TILES.PIPE_BR, TILES.HARD_BLOCK, TILES.UNDERGROUND_BRICK, TILES.CASTLE_BRICK
>>>>>>> 2e2ca2d86bf90a836096171f388d07ca26ccbd0c
        ];
        return solids.includes(tile);
    }

    addBlockBounce(tx, ty) {
        this.blockBounces.push({ tx, ty, offsetY: 0, vy: -2 });
    }

    updateBlockAnimations(dt) {
        this.animTimer += dt || 1;
        for (let i = this.blockBounces.length - 1; i >= 0; i--) {
            const b = this.blockBounces[i];
            b.offsetY += b.vy;
            b.vy += 0.4;
            if (b.offsetY >= 0) {
                b.offsetY = 0;
                this.blockBounces.splice(i, 1);
            }
        }
    }

    // Map numeric tile ID to sprite type string for Sprites.getTile()
    _tileToSpriteType(tile) {
        switch (tile) {
            case TILES.GROUND: return 'ground';
            case TILES.BRICK: return 'brick';
            case TILES.QUESTION_COIN:
            case TILES.QUESTION_POWERUP: return 'question';
            case TILES.USED_BLOCK: return 'used';
            case TILES.PIPE_TL: return 'pipe_tl';
            case TILES.PIPE_TR: return 'pipe_tr';
            case TILES.PIPE_BL: return 'pipe_bl';
            case TILES.PIPE_BR: return 'pipe_br';
            case TILES.FLAGPOLE: return 'flagpole';
            case TILES.FLAG_TOP: return null; // Drawn dynamically in game.js to allow sliding
            case TILES.COIN_TILE: return 'coin';
            case TILES.UNDERGROUND_BRICK: return 'underground_brick';
            case TILES.CASTLE_BRICK: return 'castle_brick';
            case TILES.LAVA: return 'lava';
            case TILES.HARD_BLOCK: return 'hard';
            case TILES.AXE: return 'axe';
            case TILES.BRIDGE: return 'bridge';
            default: return null;
        }
    }

    // NOTE: draw() is called inside a ctx that's already translated by -camera.x
    // So all world-space coordinates are drawn directly. drawBackground handles
    // its own parallax by undoing the camera transform and applying slower scrolling.
    drawBackground(ctx, camera) {
        // Undo the game's camera transform so we can draw screen-space background
        ctx.save();
        ctx.translate(camera.x, 0); // Cancel the -camera.x from game.js

        // Sky fill (screen space)
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Only draw parallax for non-black backgrounds
        if (this.background !== 'black' && this.background !== '#000000' && this.background !== '#000') {
            // Clouds at 0.3x speed
            for (const c of this.clouds) {
                const sx = c.x - camera.x * 0.3;
                if (sx > -48 && sx < CANVAS_WIDTH + 48) {
                    const sprite = Sprites.getBackground('cloud');
                    if (sprite) {
                        ctx.drawImage(sprite, Math.floor(sx), c.y);
                    }
                }
            }

            // Hills at 0.5x speed
            for (const h of this.hills) {
                const sx = h.x - camera.x * 0.5;
                if (sx > -96 && sx < CANVAS_WIDTH + 96) {
                    const sprite = Sprites.getBackground('hill');
                    if (sprite) {
                        ctx.drawImage(sprite, Math.floor(sx), h.y + 16 - 48); // aligned to ground Y=13
                    }
                }
            }

            // Bushes at 0.5x speed
            for (const b of this.bushes) {
                const sx = b.x - camera.x * 0.5;
                if (sx > -48 && sx < CANVAS_WIDTH + 48) {
                    const sprite = Sprites.getBackground('bush');
                    if (sprite) {
                        ctx.drawImage(sprite, Math.floor(sx), b.y - 16); // aligned to ground Y=13
                    }
                }
            }
        }

        ctx.restore(); // Back to camera-transformed space
    }

    draw(ctx, camera) {
        this.drawBackground(ctx, camera);

        // Draw castle at the end of the overworld level (columns 202 to 206)
        if (this.background === '#5c94fc' && typeof Sprites !== 'undefined') {
            const castleSprite = Sprites.getBackground('castle');
            if (castleSprite) {
                const cx = 202 * TILE_SIZE;
                const cy = 13 * TILE_SIZE - 80;
                ctx.drawImage(castleSprite, cx, cy);
            }
        }

        // Tiles are drawn in world space (game.js already translates by -camera.x)
        const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
        const endCol = Math.min(this.width - 1, startCol + Math.ceil(CANVAS_WIDTH / TILE_SIZE) + 1);
        const animFrame = Math.floor(this.animTimer / 15) % 4;

        for (let y = 0; y < this.height; y++) {
            for (let x = startCol; x <= endCol; x++) {
                const tile = this.map[y][x];
                if (tile === TILES.EMPTY) continue;

                // World-space coordinates (camera transform already applied by ctx)
                let drawX = x * TILE_SIZE;
                let drawY = y * TILE_SIZE;

                // Apply block bounce offset
                for (const b of this.blockBounces) {
                    if (b.tx === x && b.ty === y) drawY += b.offsetY;
                }

                const spriteType = this._tileToSpriteType(tile);
                let sprite = null;
                if (typeof Sprites !== 'undefined' && spriteType && Sprites.getTile) {
                    sprite = Sprites.getTile(spriteType, animFrame);
                }

                if (sprite) {
                    ctx.drawImage(sprite, Math.floor(drawX), Math.floor(drawY));
                } else if (spriteType !== null) {
                    ctx.fillStyle = this._tileColor(tile);
                    ctx.fillRect(Math.floor(drawX), Math.floor(drawY), TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                    ctx.strokeRect(Math.floor(drawX), Math.floor(drawY), TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    _tileColor(tile) {
        switch (tile) {
            case TILES.GROUND: return '#c84c0c';
            case TILES.BRICK: return '#c84c0c';
            case TILES.QUESTION_COIN:
            case TILES.QUESTION_POWERUP: return '#f8d870';
            case TILES.USED_BLOCK: return '#7c7c7c';
            case TILES.PIPE_TL: case TILES.PIPE_TR:
            case TILES.PIPE_BL: case TILES.PIPE_BR: return '#00a800';
            case TILES.HARD_BLOCK: return '#7c7c7c';
            case TILES.FLAGPOLE: return '#e8a060';
            case TILES.FLAG_TOP: return '#00a800';
            case TILES.COIN_TILE: return '#f8d870';
            case TILES.UNDERGROUND_BRICK: return '#0070e8';
            case TILES.CASTLE_BRICK: return '#707070';
            case TILES.LAVA: return '#e80000';
            default: return '#c84c0c';
        }
    }
}
