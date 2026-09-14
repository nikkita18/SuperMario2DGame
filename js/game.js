class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.state = GAME_STATES.TITLE;
        this.score = 0;
        this.coins = 0;
        this.lives = STARTING_LIVES;
        this.world = LEVELS[0];
        this.timeLeft = TIME_START;
        this.camera = { x: 0, y: 0 };
        this.screenShake = { x: 0, y: 0, timer: 0 };
        this.deathTimer = 0;
        this.levelCompleteTimer = 0;

        this.currentLevelIndex = 0;
        this.level = null;
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.fireballs = [];

        this.highScore = parseInt(localStorage.getItem('mario_highscore') || '0');
        this.lastTime = 0;
        this.timeAccumulator = 0;

        // Direct global keydown fallback for reliable starting
        window.addEventListener('keydown', (e) => {
            if (this.state === GAME_STATES.TITLE) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
                    if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                    this.resetGame();
                } else if (e.key === '1') {
                    if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                    this.currentLevelIndex = 0; this.world = '1-1'; this.startLevel();
                } else if (e.key === '2') {
                    if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                    this.currentLevelIndex = 1; this.world = '1-2'; this.startLevel();
                } else if (e.key === '3') {
                    if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                    this.currentLevelIndex = 2; this.world = '1-3'; this.startLevel();
                }
            } else if (this.state === GAME_STATES.GAME_OVER || this.state === GAME_STATES.VICTORY) {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.state = GAME_STATES.TITLE;
                    if (typeof UI !== 'undefined') UI.showScreen('title');
                }
            }
        });

        if (typeof UI !== 'undefined') UI.showScreen('title');
    }

    start() {
        requestAnimationFrame((t) => this.loop(t));
    }

    resetGame() {
        this.score = 0;
        this.coins = 0;
        this.lives = STARTING_LIVES;
        this.currentLevelIndex = 0;
        this.world = LEVELS[0];
        this.startTransition();
    }

    startTransition() {
        this.state = GAME_STATES.TRANSITION;
        if (typeof AudioSystem !== 'undefined') {
            AudioSystem.stopMusic();
        }
        if (typeof UI !== 'undefined') {
            UI.setupTransition(this.world, this.lives);
        }
        setTimeout(() => {
            if (this.state === GAME_STATES.TRANSITION) {
                this.startLevel();
            }
        }, 2000);
    }

    startLevel() {
        // Load level data
        let data;
        if (this.currentLevelIndex === 0) data = typeof level1 !== 'undefined' ? level1 : null;
        else if (this.currentLevelIndex === 1) data = typeof level2 !== 'undefined' ? level2 : null;
        else data = typeof level3 !== 'undefined' ? level3 : null;

        if (!data) { this.state = GAME_STATES.TITLE; return; }

        this.level = new Level(data);
        this.player = new Player(data.playerSpawn.x, data.playerSpawn.y);

        this.enemies = [];
        for (const e of this.level.enemySpawns) {
            this.enemies.push(new Enemy(e.x, e.y, e.type));
        }

        this.items = [];
        this.fireballs = [];
        this.camera.x = 0;
        this.timeLeft = TIME_START;
        this.timeAccumulator = 0;
        
        // Flagpole variables
        this.flagpoleCol = this.currentLevelIndex === 2 ? 144 : 198;
        this.flagX = this.flagpoleCol * TILE_SIZE - 8;
        this.flagY = 3 * TILE_SIZE;
        this.levelCompletePhase = 0;

        this.state = GAME_STATES.PLAYING;

        if (typeof AudioSystem !== 'undefined') {
            const track = this.currentLevelIndex === 1 ? 'underground' : (this.currentLevelIndex === 2 ? 'castle' : 'overworld');
            AudioSystem.startMusic(track);
        }

        if (typeof ParticleSystem !== 'undefined') ParticleSystem.particles = [];
        if (typeof UI !== 'undefined') UI.showScreen(null);
    }

    update(dt) {
        // === TITLE ===
        if (this.state === GAME_STATES.TITLE) {
            if (Input.isJustPressed('start') || Input.isJustPressed('jump')) {
                if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                this.resetGame();
            } else if (Input.isJustPressed('level1')) {
                if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                this.currentLevelIndex = 0;
                this.world = LEVELS[0];
                this.startTransition();
            } else if (Input.isJustPressed('level2')) {
                if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                this.currentLevelIndex = 1;
                this.world = LEVELS[1];
                this.startTransition();
            } else if (Input.isJustPressed('level3')) {
                if (typeof AudioSystem !== 'undefined') AudioSystem.init();
                this.currentLevelIndex = 2;
                this.world = LEVELS[2];
                this.startTransition();
            }
            return;
        }

        // === TRANSITION ===
        if (this.state === GAME_STATES.TRANSITION) return;

        // === GAME OVER ===
        if (this.state === GAME_STATES.GAME_OVER) {
            if (Input.isJustPressed('start') || Input.isJustPressed('jump')) {
                this.state = GAME_STATES.TITLE;
                if (typeof UI !== 'undefined') UI.showScreen('title');
            }
            return;
        }

        // === VICTORY ===
        if (this.state === GAME_STATES.VICTORY) {
            if (Input.isJustPressed('start') || Input.isJustPressed('jump')) {
                this.state = GAME_STATES.TITLE;
                if (typeof UI !== 'undefined') UI.showScreen('title');
            }
            if (typeof ParticleSystem !== 'undefined') ParticleSystem.update();
            return;
        }

        // === PAUSED ===
        if (this.state === GAME_STATES.PAUSED) {
            if (Input.isJustPressed('pause')) {
                this.state = GAME_STATES.PLAYING;
                if (typeof UI !== 'undefined') UI.hidePause();
            }
            return;
        }

        // Pause check
        if (Input.isJustPressed('pause') && this.state === GAME_STATES.PLAYING) {
            this.state = GAME_STATES.PAUSED;
            if (typeof UI !== 'undefined') UI.showPause();
            if (typeof AudioSystem !== 'undefined') AudioSystem.playPause();
            return;
        }

        // === PLAYING ===
        if (this.state === GAME_STATES.PLAYING) {
            // Cheat key to get Fire Mario (for testing/playability)
            if (typeof Input !== 'undefined' && Input.isJustPressed('fire_cheat')) {
                this.player.power = POWER.FIRE;
                this.player.height = PLAYER_BIG_HEIGHT;
                if (typeof AudioSystem !== 'undefined') AudioSystem.playPowerUp();
            }

            // Timer countdown (1 per second at 60fps, dt is frame-based)
            this.timeAccumulator += dt / 60;
            if (this.timeAccumulator >= 1) {
                this.timeLeft--;
                this.timeAccumulator -= 1;
                if (this.timeLeft <= 0) this.playerDied();
            }

            // Update all entities
            this.player.update(dt, this.level, this);

            for (let i = this.enemies.length - 1; i >= 0; i--) {
                this.enemies[i].update(dt, this.level);
                if (!this.enemies[i].active) this.enemies.splice(i, 1);
            }

            for (let i = this.items.length - 1; i >= 0; i--) {
                this.items[i].update(dt, this.level);
                if (!this.items[i].active) this.items.splice(i, 1);
            }

            for (let i = this.fireballs.length - 1; i >= 0; i--) {
                this.fireballs[i].update(dt, this.level);
                if (!this.fireballs[i].active) this.fireballs.splice(i, 1);
            }

            this.level.updateBlockAnimations(dt);
            if (typeof ParticleSystem !== 'undefined') ParticleSystem.update();

            this.checkCollisions();

            // Camera: follow player rightward
            const targetX = this.player.x - CANVAS_WIDTH / 2;
            if (targetX > this.camera.x) this.camera.x = targetX;
            const maxCamX = this.level.width * TILE_SIZE - CANVAS_WIDTH;
            if (this.camera.x > maxCamX) this.camera.x = maxCamX;
            if (this.camera.x < 0) this.camera.x = 0;

            // Prevent player going behind camera
            if (this.player.x < this.camera.x) {
                this.player.x = this.camera.x;
                this.player.vx = 0;
            }

            // Screen shake decay
            if (this.screenShake.timer > 0) {
                this.screenShake.x = (Math.random() - 0.5) * 4;
                this.screenShake.y = (Math.random() - 0.5) * 4;
                this.screenShake.timer--;
            } else {
                this.screenShake.x = 0;
                this.screenShake.y = 0;
            }

            // High Score update
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('mario_highscore', this.highScore.toString());
            }

            // Update HUD
            if (typeof UI !== 'undefined' && UI.updateHUD) {
                UI.updateHUD(this.score, this.coins, this.world, this.timeLeft, this.highScore);
            }

        // === DYING ===
        } else if (this.state === GAME_STATES.DYING) {
            this.player.vy += GRAVITY;
            this.player.y += this.player.vy;
            this.deathTimer--;
            if (this.deathTimer <= 0) {
                this.lives--;
                if (this.lives > 0) {
                    this.startTransition();
                } else {
                    this.gameOver();
                }
            }

        // === LEVEL COMPLETE ===
        } else if (this.state === GAME_STATES.LEVEL_COMPLETE) {
            if (this.levelCompletePhase === 0) {
                // Phase 0: Slide down the pole
                this.player.y += 2;
                this.flagY += 2;
                
                const groundY = 13 * TILE_SIZE - this.player.height;
                if (this.player.y >= groundY) {
                    this.player.y = groundY;
                }
                const flagMaxY = 11 * TILE_SIZE;
                if (this.flagY >= flagMaxY) {
                    this.flagY = flagMaxY;
                }
                
                if (this.player.y === groundY && this.flagY === flagMaxY) {
                    this.levelCompletePhase = 1;
                    this.levelCompleteTimer = 25; // brief pause before walking
                }
            } else if (this.levelCompletePhase === 1) {
                // Phase 1: Wait briefly, then walk to castle
                if (this.levelCompleteTimer > 0) {
                    this.levelCompleteTimer--;
                    this.player.vx = 0;
                } else {
                    this.player.facing = 1;
                    this.player.vx = 1.2;
                    this.player.x += this.player.vx;
                    
                    // Walk animation frame update
                    this.player.animTimer += Math.abs(this.player.vx);
                    if (this.player.animTimer > 12) {
                        this.player.animTimer = 0;
                        this.player.animFrame = (this.player.animFrame + 1) % 3;
                    }
                    
                    // Walk 5.5 tiles past the flagpole (into the castle)
                    const castleEntranceX = (this.flagpoleCol + 5.5) * TILE_SIZE;
                    if (this.player.x >= castleEntranceX) {
                        this.player.x = castleEntranceX;
                        this.player.vx = 0;
                        this.levelCompletePhase = 2; // start countdown
                    }
                }
            } else if (this.levelCompletePhase === 2) {
                // Phase 2: Time countdown bonus + fireworks
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.score += 50;
                    
                    // Play beep sound
                    if (this.timeLeft % 4 === 0 && typeof AudioSystem !== 'undefined') {
                        AudioSystem.playCoin();
                    }
                    
                    // Spawn fireworks!
                    if (this.timeLeft % 12 === 0 && typeof ParticleSystem !== 'undefined') {
                        const fx = (this.flagpoleCol + 5.5) * TILE_SIZE + (Math.random() - 0.5) * 60;
                        const fy = 40 + Math.random() * 50;
                        ParticleSystem.spawnFirework(fx, fy);
                    }
                } else {
                    this.levelCompleteTimer = 60; // wait 1 second before advancing
                    this.levelCompletePhase = 3;
                }
            } else if (this.levelCompletePhase === 3) {
                this.levelCompleteTimer--;
                if (this.levelCompleteTimer <= 0) {
                    this.advanceLevel();
                }
            }
        }
    }

    checkCollisions() {
        if (!this.player || this.player.isDead) return;
        const pb = this.player.getBounds();

        // Player vs Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            if (!e.active || e.state === 'dead') continue;

            if (this._aabb(pb, { x: e.x, y: e.y, width: e.width, height: e.height })) {
                if (this.player.starTimer > 0) {
                    // Star Mario defeats enemies on contact!
                    e.hitByShell(this);
                    this.score += SCORE_STOMP_BASE * 2;
                    if (typeof ParticleSystem !== 'undefined') {
                        ParticleSystem.spawnScorePopup(e.x, e.y, '+200');
                    }
                } else if (this.player.vy > 0 && pb.y + pb.height - e.y < 10) {
                    // Stomped from above?
                    e.stomp(this);
                    this.player.vy = -4;
                    this.player.stompCombo++;
                    const points = SCORE_STOMP_BASE * this.player.stompCombo;
                    this.score += points;
                    if (typeof ParticleSystem !== 'undefined') {
                        ParticleSystem.spawnScorePopup(e.x, e.y, '+' + points);
                        ParticleSystem.spawnStompStar(e.x, e.y);
                    }
                } else if (e.state === 'shell' && e.vx === 0) {
                    // Kick a stopped shell
                    e.stomp(this);
                } else {
                    // Take damage from side/bottom
                    this.player.takeDamage(this);
                }
            }
        }

        // Player vs Items
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (!item.active || item.emerging) continue;
            if (this._aabb(pb, { x: item.x, y: item.y, width: item.width, height: item.height })) {
                if (item.type === 'mushroom') {
                    this.player.powerUp('mushroom', this);
                } else if (item.type === 'fireflower') {
                    this.player.powerUp('fireflower', this);
                } else if (item.type === 'star') {
                    this.player.powerUp('star', this);
                } else if (item.type === 'oneup') {
                    this.lives++;
                    if (typeof AudioSystem !== 'undefined') AudioSystem.playOneUp();
                    if (typeof ParticleSystem !== 'undefined') {
                        ParticleSystem.spawnScorePopup(item.x, item.y, '1UP');
                    }
                }
                item.active = false;
            }
        }

        // Player vs Coin tiles
        const pcx = Math.floor((this.player.x + this.player.width / 2) / TILE_SIZE);
        const pcy = Math.floor((this.player.y + this.player.height / 2) / TILE_SIZE);
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const cx = pcx + dx, cy = pcy + dy;
                const tile = this.level.getTile(cx, cy);
                if (tile === TILES.COIN_TILE) {
                    this.level.setTile(cx, cy, TILES.EMPTY);
                    this.collectCoin();
                    if (typeof ParticleSystem !== 'undefined') {
                        ParticleSystem.spawnCoinPop(cx * TILE_SIZE, cy * TILE_SIZE);
                    }
                }
                // Flagpole
                if (tile === TILES.FLAGPOLE || tile === TILES.FLAG_TOP) {
                    if (this._aabb(pb, { x: cx * TILE_SIZE, y: cy * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE })) {
                        this.state = GAME_STATES.LEVEL_COMPLETE;
                        this.levelCompletePhase = 0;
                        this.levelCompleteTimer = 60;
                        // Align player to flagpole X
                        this.player.x = cx * TILE_SIZE + (TILE_SIZE - this.player.width) / 2;
                        this.player.vx = 0;
                        this.player.vy = 0;
                        this.flagpoleCol = cx;
                        this.flagX = cx * TILE_SIZE - 8;
                        this.flagY = 3 * TILE_SIZE;
                        if (typeof AudioSystem !== 'undefined') AudioSystem.playFlagpole();
                    }
                }

                // Axe Switch in Bowser Castle
                if (tile === TILES.AXE) {
                    if (this._aabb(pb, { x: cx * TILE_SIZE, y: cy * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE })) {
                        this.level.setTile(cx, cy, TILES.EMPTY);
                        // Collapse bridge blocks into lava
                        for (let bx = 125; bx <= 133; bx++) {
                            setTimeout(() => {
                                this.level.setTile(bx, 12, TILES.EMPTY);
                                if (typeof ParticleSystem !== 'undefined') {
                                    ParticleSystem.spawnBrickDebris(bx * TILE_SIZE, 12 * TILE_SIZE);
                                }
                            }, (133 - bx) * 100);
                        }
                        if (typeof AudioSystem !== 'undefined') AudioSystem.playBreak();
                        // Trigger level complete cutscene
                        setTimeout(() => {
                            this.state = GAME_STATES.LEVEL_COMPLETE;
                            this.levelCompletePhase = 2; // Jump directly to countdown & fireworks!
                            this.flagpoleCol = cx;
                        }, 1200);
                    }
                }
            }
        }

        // Fireball vs Enemies / Player
        for (const fb of this.fireballs) {
            if (!fb.active) continue;
            if (fb.isEnemy) {
                if (this._aabb({ x: fb.x, y: fb.y, width: fb.width, height: fb.height }, pb)) {
                    this.player.takeDamage(this);
                    fb.active = false;
                }
            } else {
                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    const e = this.enemies[i];
                    if (!e.active || e.state === 'dead') continue;
                    if (this._aabb({ x: fb.x, y: fb.y, width: 4, height: 4 }, { x: e.x, y: e.y, width: e.width, height: e.height })) {
                        if (e.type === 'bowser') {
                            e.hp--;
                            if (e.hp <= 0) e.hitByShell(this);
                        } else {
                            e.hitByShell(this);
                        }
                        fb.active = false;
                        this.score += SCORE_STOMP_BASE;
                        break;
                    }
                }
            }
        }

        // Shell vs other Enemies
        for (const e of this.enemies) {
            if (e.state !== 'shell-moving') continue;
            for (const other of this.enemies) {
                if (other === e || !other.active || other.state === 'dead') continue;
                if (this._aabb({ x: e.x, y: e.y, width: e.width, height: e.height },
                    { x: other.x, y: other.y, width: other.width, height: other.height })) {
                    other.hitByShell(this);
                    this.score += SCORE_STOMP_BASE;
                }
            }
        }
    }

    _aabb(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x &&
               a.y < b.y + b.height && a.y + a.height > b.y;
    }

    hitBlock(tx, ty) {
        const tile = this.level.getTile(tx, ty);

        if (tile === TILES.QUESTION_COIN) {
            this.level.setTile(tx, ty, TILES.USED_BLOCK);
            this.collectCoin();
            this.level.addBlockBounce(tx, ty);
            if (typeof ParticleSystem !== 'undefined') {
                ParticleSystem.spawnCoinPop(tx * TILE_SIZE, ty * TILE_SIZE);
                ParticleSystem.spawnScorePopup(tx * TILE_SIZE, ty * TILE_SIZE - 8, '+' + SCORE_COIN);
            }
            if (typeof AudioSystem !== 'undefined') AudioSystem.playCoin();

        } else if (tile === TILES.QUESTION_POWERUP) {
            this.level.setTile(tx, ty, TILES.USED_BLOCK);
            this.level.addBlockBounce(tx, ty);
            let itemType = 'mushroom';
            if (tx === 101 || tx === 84) {
                itemType = 'star';
            } else if (tx === 64) {
                itemType = 'oneup';
            } else if (this.player.power !== POWER.SMALL) {
                itemType = 'fireflower';
            }
            this.items.push(new Item(tx * TILE_SIZE, ty * TILE_SIZE, itemType));
            if (typeof AudioSystem !== 'undefined') AudioSystem.playBump();

        } else if (tile === TILES.BRICK || tile === TILES.UNDERGROUND_BRICK) {
            const isUnderground = (tile === TILES.UNDERGROUND_BRICK);
            const debrisColor = isUnderground ? '#0070e8' : '#c84c0c';
            if (this.player.power !== POWER.SMALL) {
                // Big Mario breaks bricks
                this.level.setTile(tx, ty, TILES.EMPTY);
                if (typeof AudioSystem !== 'undefined') AudioSystem.playBreak();
                if (typeof ParticleSystem !== 'undefined') ParticleSystem.spawnBrickDebris(tx * TILE_SIZE, ty * TILE_SIZE, debrisColor);
                this.score += SCORE_BRICK;
                this.screenShake.timer = 5;
            } else {
                // Small Mario just bumps
                this.level.addBlockBounce(tx, ty);
                if (typeof AudioSystem !== 'undefined') AudioSystem.playBump();
            }
        }
    }

    collectCoin() {
        this.coins++;
        this.score += SCORE_COIN;
        if (typeof AudioSystem !== 'undefined') AudioSystem.playCoin();
        if (this.coins >= COINS_FOR_LIFE) {
            this.coins -= COINS_FOR_LIFE;
            this.lives++;
            if (typeof AudioSystem !== 'undefined') AudioSystem.playOneUp();
        }
    }

    spawnFireball(x, y, dir = 1, isEnemy = false) {
        const count = this.fireballs.filter(f => f.isEnemy === isEnemy).length;
        if (!isEnemy && count >= 2) return;
        if (isEnemy && count >= 2) return;
        this.fireballs.push(new Fireball(x, y, dir, isEnemy));
        if (typeof AudioSystem !== 'undefined') AudioSystem.playFireball();
    }

    playerDied() {
        if (this.player.isDead) return;
        this.player.isDead = true;
        this.player.vy = -6;
        this.player.vx = 0;
        this.state = GAME_STATES.DYING;
        this.deathTimer = 120;
        if (typeof AudioSystem !== 'undefined') AudioSystem.playDeath();
    }

    gameOver() {
        this.state = GAME_STATES.GAME_OVER;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('mario_highscore', this.highScore);
        }
        if (typeof AudioSystem !== 'undefined') AudioSystem.playGameOver();
        if (typeof UI !== 'undefined') UI.showScreen('gameOver');
    }

    victory() {
        this.state = GAME_STATES.VICTORY;
        if (typeof AudioSystem !== 'undefined') {
            AudioSystem.playOneUp();
            setTimeout(() => {
                AudioSystem.playOneUp();
            }, 600);
        }
        if (typeof UI !== 'undefined') UI.showScreen('victory');
        
        let count = 0;
        const interval = setInterval(() => {
            if (this.state !== GAME_STATES.VICTORY) {
                clearInterval(interval);
                return;
            }
            if (typeof ParticleSystem !== 'undefined') {
                const vx = 40 + Math.random() * (CANVAS_WIDTH - 80);
                const vy = 30 + Math.random() * 80;
                ParticleSystem.spawnFirework(vx, vy);
            }
            count++;
            if (count > 25) clearInterval(interval);
        }, 300);
    }

    advanceLevel() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= LEVELS.length) {
            // All levels complete! Victory!
            this.victory();
        } else {
            this.world = LEVELS[this.currentLevelIndex];
            this.startTransition();
        }
    }



    draw() {
        // Full-screen overlays handled by HTML/CSS
        if (this.state === GAME_STATES.TITLE || this.state === GAME_STATES.TRANSITION || this.state === GAME_STATES.GAME_OVER || this.state === GAME_STATES.VICTORY) {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            // Draw fireworks on black screen during victory!
            if (this.state === GAME_STATES.VICTORY && typeof ParticleSystem !== 'undefined') {
                ParticleSystem.draw(this.ctx, 0, 0);
            }
            return;
        }

        if (!this.level) return;

        // Draw level + entities
        this.ctx.save();
        this.ctx.translate(
            Math.floor(-this.camera.x + this.screenShake.x),
            Math.floor(this.screenShake.y)
        );

        this.level.draw(this.ctx, this.camera);

        // Draw dynamic flag
        if (this.flagX !== undefined && this.flagY !== undefined) {
            const flagSprite = Sprites.getTile('flag');
            if (flagSprite) {
                this.ctx.drawImage(flagSprite, this.flagX, this.flagY);
            }
        }

        for (const item of this.items) item.draw(this.ctx);
        for (const e of this.enemies) e.draw(this.ctx);
        for (const fb of this.fireballs) fb.draw(this.ctx);
        this.player.draw(this.ctx);

        if (typeof ParticleSystem !== 'undefined') {
            ParticleSystem.draw(this.ctx, 0, 0);
        }

        this.ctx.restore();

        // Pause overlay (canvas-based fallback)
        if (this.state === GAME_STATES.PAUSED) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }

    loop(timestamp) {
        let dt = (timestamp - this.lastTime) / (1000 / 60);
        if (isNaN(dt) || dt > 3) dt = 1;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        if (typeof Input !== 'undefined') Input.latchFrame();
        requestAnimationFrame((t) => this.loop(t));
    }
}

function initGame() {
    if (!window.game) {
        window.game = new Game();
        window.game.start();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
