class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.power = POWER.SMALL; // SMALL, SUPER, FIRE
        this.width = 12;
        this.height = PLAYER_SMALL_HEIGHT;
        this.grounded = false;
        this.facing = 1; // 1 = right, -1 = left
        this.animFrame = 0;
        this.animTimer = 0;
        this.isSkidding = false;
        this.isDead = false;
        this.invincibleTimer = 0;
        this.starTimer = 0;
        this.stompCombo = 0;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
    }

    update(dt, level, game) {
        if (this.isDead) return;

        // Invincibility flicker timer
        if (this.invincibleTimer > 0) this.invincibleTimer--;

        // Star power timer
        if (this.starTimer > 0) {
            this.starTimer--;
            if (this.starTimer === 0 && typeof AudioSystem !== 'undefined') {
                const track = game.currentLevelIndex === 1 ? 'underground' : (game.currentLevelIndex === 2 ? 'castle' : 'overworld');
                AudioSystem.startMusic(track);
            }
        }

        // Coyote Time & Jump Buffer timers
        if (this.grounded) {
            this.coyoteTimer = 6;
        } else if (this.coyoteTimer > 0) {
            this.coyoteTimer--;
        }

        if (Input.isJustPressed('jump')) {
            this.jumpBufferTimer = 6;
        } else if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer--;
        }

        // Horizontal Movement
        const accel = PLAYER_ACCEL;
        const maxSpeed = (Input.isPressed('action') || this.starTimer > 0) ? PLAYER_RUN_MAX_SPEED : PLAYER_MAX_SPEED;

        if (Input.isPressed('left')) {
            this.facing = -1;
            if (this.vx > 0) {
                this.isSkidding = true;
                this.vx -= accel * 2;
                if (this.grounded && Math.random() < 0.3 && typeof ParticleSystem !== 'undefined') {
                    ParticleSystem.spawnSkidDust(this.x + this.width / 2, this.y + this.height);
                }
            } else {
                this.isSkidding = false;
                this.vx -= accel;
            }
        } else if (Input.isPressed('right')) {
            this.facing = 1;
            if (this.vx < 0) {
                this.isSkidding = true;
                this.vx += accel * 2;
                if (this.grounded && Math.random() < 0.3 && typeof ParticleSystem !== 'undefined') {
                    ParticleSystem.spawnSkidDust(this.x + this.width / 2, this.y + this.height);
                }
            } else {
                this.isSkidding = false;
                this.vx += accel;
            }
        } else {
            this.isSkidding = false;
            this.vx *= FRICTION;
            if (Math.abs(this.vx) < 0.05) this.vx = 0;
        }

        // Clamp Speed
        if (this.vx > maxSpeed) this.vx = maxSpeed;
        if (this.vx < -maxSpeed) this.vx = -maxSpeed;

        // Jump Execution (with Coyote time & Jump buffering)
        if (this.jumpBufferTimer > 0 && (this.grounded || this.coyoteTimer > 0)) {
            this.vy = PLAYER_JUMP_FORCE;
            this.grounded = false;
            this.coyoteTimer = 0;
            this.jumpBufferTimer = 0;
            if (typeof AudioSystem !== 'undefined') AudioSystem.playJump();
        }

        // Variable Jump Height (holding jump key)
        if (!Input.isPressed('jump') && this.vy < -2) {
            this.vy = -2;
        }

        // Gravity
        this.vy += GRAVITY;
        if (this.vy > PLAYER_MAX_FALL_SPEED) this.vy = PLAYER_MAX_FALL_SPEED;

        // Fireball Shooting (Fire Mario only — on Shift/Z/Action press)
        if (this.power === POWER.FIRE && Input.isJustPressed('action') && game && game.spawnFireball) {
            game.spawnFireball(
                this.facing === 1 ? this.x + this.width : this.x - 6,
                this.y + 4,
                this.facing
            );
        }

        // Horizontal Collision
        this.x += this.vx;
        this._checkHorizontalCollisions(level);

        // Vertical Collision
        this.grounded = false;
        this.y += this.vy;
        this._checkVerticalCollisions(level, game);

        // Fall Off Screen Death
        if (this.y > CANVAS_HEIGHT + 32) {
            game.playerDied();
        }

        // Reset Stomp Combo on ground
        if (this.grounded) this.stompCombo = 0;

        // Update Animation Frame
        this.animTimer += Math.abs(this.vx);
        if (this.animTimer > 10) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 3;
        }
    }

    _checkHorizontalCollisions(level) {
        const leftCol = Math.floor(this.x / TILE_SIZE);
        const rightCol = Math.floor((this.x + this.width - 0.01) / TILE_SIZE);
        const topRow = Math.floor(this.y / TILE_SIZE);
        const bottomRow = Math.floor((this.y + this.height - 0.01) / TILE_SIZE);

        for (let r = topRow; r <= bottomRow; r++) {
            if (this.vx > 0 && level.isSolid(rightCol, r)) {
                this.x = rightCol * TILE_SIZE - this.width;
                this.vx = 0;
            } else if (this.vx < 0 && level.isSolid(leftCol, r)) {
                this.x = (leftCol + 1) * TILE_SIZE;
                this.vx = 0;
            }
        }
    }

    _checkVerticalCollisions(level, game) {
        const topRow = Math.floor(this.y / TILE_SIZE);
        const bottomRow = Math.floor((this.y + this.height - 0.01) / TILE_SIZE);
        const leftCol = Math.floor(this.x / TILE_SIZE);
        const rightCol = Math.floor((this.x + this.width - 0.01) / TILE_SIZE);

        if (this.vy > 0) {
            for (let c = leftCol; c <= rightCol; c++) {
                if (level.isSolid(c, bottomRow)) {
                    this.y = bottomRow * TILE_SIZE - this.height;
                    this.vy = 0;
                    this.grounded = true;
                    break;
                }
            }
        } else if (this.vy < 0) {
            // Check center of Mario first to determine which block was bumped
            const centerCol = Math.floor((this.x + this.width / 2) / TILE_SIZE);
            let hitTargetCol = null;

            if (level.isSolid(centerCol, topRow)) {
                hitTargetCol = centerCol;
            } else if (level.isSolid(leftCol, topRow)) {
                hitTargetCol = leftCol;
            } else if (level.isSolid(rightCol, topRow)) {
                hitTargetCol = rightCol;
            }

            if (hitTargetCol !== null) {
                this.y = (topRow + 1) * TILE_SIZE;
                this.vy = 0;
                game.hitBlock(hitTargetCol, topRow);
            }
        }
    }

    powerUp(type, game) {
        if (type === 'mushroom' && this.power === POWER.SMALL) {
            this.power = POWER.SUPER;
            this.y -= (PLAYER_BIG_HEIGHT - PLAYER_SMALL_HEIGHT);
            this.height = PLAYER_BIG_HEIGHT;
            if (typeof AudioSystem !== 'undefined') AudioSystem.playPowerUp();
            game.score += SCORE_POWERUP;
        } else if (type === 'fireflower') {
            if (this.power === POWER.SMALL) {
                this.y -= (PLAYER_BIG_HEIGHT - PLAYER_SMALL_HEIGHT);
                this.height = PLAYER_BIG_HEIGHT;
            }
            this.power = POWER.FIRE;
            if (typeof AudioSystem !== 'undefined') AudioSystem.playPowerUp();
            game.score += SCORE_POWERUP;
        } else if (type === 'star') {
            this.starTimer = 360; // 6 seconds of star power invincibility
            if (typeof AudioSystem !== 'undefined') AudioSystem.startMusic('star');
            game.score += SCORE_POWERUP;
        }
    }

    takeDamage(game) {
        if (this.starTimer > 0 || this.invincibleTimer > 0 || this.isDead) return;

        if (this.power > POWER.SMALL) {
            this.power = POWER.SMALL;
            this.height = PLAYER_SMALL_HEIGHT;
            this.invincibleTimer = INVINCIBLE_FRAMES;
            if (typeof AudioSystem !== 'undefined') AudioSystem.playPowerDown();
        } else {
            game.playerDied();
        }
    }

    getBounds() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    draw(ctx) {
        if (this.isDead) {
            let deadSprite = null;
            if (typeof Sprites !== 'undefined' && Sprites.getMario) {
                deadSprite = Sprites.getMario('small', 'dead');
            }
            if (deadSprite) {
                ctx.drawImage(deadSprite, Math.floor(this.x - 2), Math.floor(this.y));
            } else {
                ctx.fillStyle = '#e80000';
                ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
            }
            return;
        }

        // Invincibility flicker
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 4) % 2 === 0) {
            return;
        }

        const sizeStr = this.power === POWER.SMALL ? 'small' : (this.power === POWER.FIRE ? 'fire' : 'big');
        let stateStr = 'idle';

        if (!this.grounded) {
            stateStr = 'jump';
        } else if (this.isSkidding) {
            stateStr = 'skid';
        } else if (Math.abs(this.vx) > 0.1) {
            stateStr = 'walk';
        }

        let sprite = null;
        if (typeof Sprites !== 'undefined' && Sprites.getMario) {
            sprite = Sprites.getMario(sizeStr, stateStr, this.animFrame);
        }

        ctx.save();
        ctx.translate(Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2));
        if (this.facing === -1) ctx.scale(-1, 1);

        // Rainbow palette cycling during Star power
        if (this.starTimer > 0) {
            const hue = (Math.floor(Date.now() / 30) % 12) * 30;
            ctx.filter = `hue-rotate(${hue}deg) saturate(200%)`;
        }

        if (sprite) {
            const sprW = sprite.width;
            const sprH = sprite.height;
            ctx.drawImage(sprite, -sprW / 2, this.height / 2 - sprH);
        } else {
            ctx.fillStyle = this.power === POWER.FIRE ? '#fff' : '#e80000';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            // Overalls
            ctx.fillStyle = this.power === POWER.FIRE ? '#e80000' : '#0000e8';
            ctx.fillRect(-this.width / 2 + 1, 2, this.width - 2, this.height / 2 - 2);
        }

        ctx.restore();
    }
}
