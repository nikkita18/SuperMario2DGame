class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.width = type === 'bowser' ? 32 : 16;
        this.height = type === 'koopa' ? 24 : (type === 'bowser' ? 32 : (type === 'piranha' ? 24 : 16));
        this.type = type;
        this.vx = type === 'goomba' ? -GOOMBA_SPEED : (type === 'bowser' ? -0.4 : -KOOPA_SPEED);
        this.vy = 0;
        this.state = 'walk'; // walk, dead, shell, shell-moving, flipped
        this.animFrame = 0;
        this.animTimer = 0;
        this.active = true;
        this.deadTimer = 0;
        this.hp = type === 'bowser' ? 5 : 1;
        this.fireTimer = 0;
    }

    update(dt, level) {
        if (!this.active) return;

        // Camera activation range
        if (window.game && this.state !== 'shell-moving' && this.state !== 'flipped' && this.type !== 'bowser') {
            const cam = window.game.camera;
            if (this.x > cam.x + CANVAS_WIDTH + 64 || this.x < cam.x - 64) {
                return;
            }
        }

        // Piranha Plant movement
        if (this.type === 'piranha') {
            const playerX = window.game ? window.game.player.x : 0;
            const dist = Math.abs(playerX - this.x);
            if (dist > 32) {
                if (this.y > this.startY - 20) this.y -= 0.4;
            } else {
                if (this.y < this.startY) this.y += 0.4;
            }
            return;
        }

        // Bowser Boss movement & attacks
        if (this.type === 'bowser') {
            this.x += this.vx;
            if (this.x < 125 * TILE_SIZE || this.x > 132 * TILE_SIZE) {
                this.vx = -this.vx;
            }
            this.fireTimer++;
            if (this.fireTimer > 120 && window.game) {
                this.fireTimer = 0;
                window.game.spawnFireball(this.x - 8, this.y + 8, -1);
            }
            this.vy += GRAVITY;
            this.y += this.vy;
            const bRow = Math.floor((this.y + this.height) / TILE_SIZE);
            const bCol = Math.floor((this.x + this.width / 2) / TILE_SIZE);
            if (level.isSolid(bCol, bRow)) {
                this.y = bRow * TILE_SIZE - this.height;
                this.vy = 0;
            }
            if (this.y > CANVAS_HEIGHT + 32) this.active = false;
            return;
        }

        // Flipped/falling death animation
        if (this.state === 'flipped') {
            this.vy += GRAVITY;
            this.x += this.vx;
            this.y += this.vy;
            if (this.y > CANVAS_HEIGHT + 32) this.active = false;
            return;
        }

        if (this.state === 'dead') {
            this.deadTimer++;
            if (this.deadTimer > 30) this.active = false;
            return;
        }

        // Animation
        this.animTimer++;
        if (this.animTimer > 15) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }

        // Gravity
        this.vy += GRAVITY;
        if (this.vy > TERMINAL_VELOCITY) this.vy = TERMINAL_VELOCITY;

        // Horizontal movement + collision
        this.x += this.vx;
        let leftCol = Math.floor(this.x / TILE_SIZE);
        let rightCol = Math.floor((this.x + this.width - 0.01) / TILE_SIZE);
        let topRow = Math.floor(this.y / TILE_SIZE);
        let bottomRow = Math.floor((this.y + this.height - 0.01) / TILE_SIZE);

        for (let r = topRow; r <= bottomRow; r++) {
            if (this.vx > 0 && level.isSolid(rightCol, r)) {
                this.x = rightCol * TILE_SIZE - this.width;
                this.vx = -this.vx;
            } else if (this.vx < 0 && level.isSolid(leftCol, r)) {
                this.x = (leftCol + 1) * TILE_SIZE;
                this.vx = -this.vx;
            }
        }

        // Vertical movement + collision
        this.y += this.vy;
        topRow = Math.floor(this.y / TILE_SIZE);
        bottomRow = Math.floor((this.y + this.height - 0.01) / TILE_SIZE);
        leftCol = Math.floor(this.x / TILE_SIZE);
        rightCol = Math.floor((this.x + this.width - 0.01) / TILE_SIZE);

        for (let c = leftCol; c <= rightCol; c++) {
            if (this.vy > 0 && level.isSolid(c, bottomRow)) {
                this.y = bottomRow * TILE_SIZE - this.height;
                this.vy = 0;
            }
        }

        // Fall off screen
        if (this.y > CANVAS_HEIGHT + 32) this.active = false;
    }

    stomp(game) {
        if (this.type === 'goomba') {
            this.state = 'dead';
            this.vx = 0;
            this.height = 8;
            this.y += 8;
            if (typeof AudioSystem !== 'undefined') AudioSystem.playStomp();
            if (typeof ParticleSystem !== 'undefined') ParticleSystem.spawnStompStar(this.x + this.width / 2, this.y);
        } else if (this.type === 'koopa') {
            if (this.state === 'walk') {
                this.state = 'shell';
                this.height = 16;
                this.y += 8;
                this.vx = 0;
            } else if (this.state === 'shell') {
                this.state = 'shell-moving';
                this.vx = game.player.x < this.x ? SHELL_SPEED : -SHELL_SPEED;
                if (typeof AudioSystem !== 'undefined') AudioSystem.playKick();
            } else if (this.state === 'shell-moving') {
                this.state = 'shell';
                this.vx = 0;
                if (typeof AudioSystem !== 'undefined') AudioSystem.playStomp();
            }
        }
    }

    hitByShell(game) {
        this.state = 'flipped';
        this.vy = -4.5;
        this.vx = (game.player ? Math.sign(this.x - game.player.x) : 1) * 1.5;
        if (this.vx === 0) this.vx = 1.5;
        if (typeof AudioSystem !== 'undefined') AudioSystem.playStomp();
    }

    draw(ctx) {
        if (!this.active) return;

        let sprite = null;
        if (typeof Sprites !== 'undefined' && Sprites.getEnemy) {
            const sprState = this.state === 'dead' ? 'squashed' :
                             (this.state === 'shell' || this.state === 'shell-moving' || this.state === 'flipped') ? 'shell' : 'walk';
            sprite = Sprites.getEnemy(this.type, sprState, this.animFrame);
        }

        ctx.save();
        ctx.translate(Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2));
        
        // Flip horizontally if moving right
        if (this.vx > 0) {
            ctx.scale(-1, 1);
        }

        // Flip vertically if in flipped state
        if (this.state === 'flipped') {
            ctx.scale(1, -1);
        }

        if (sprite) {
            ctx.drawImage(sprite, -this.width / 2, this.height / 2 - sprite.height);
        } else {
            // Fallback colored rectangles
            ctx.fillStyle = this.type === 'goomba' ? '#a84400' : '#00a800';
            if (this.state === 'dead') {
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, 8);
            } else if (this.state === 'shell' || this.state === 'shell-moving' || this.state === 'flipped') {
                ctx.fillStyle = '#006600';
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            } else {
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                // Eyes
                ctx.fillStyle = '#fff';
                ctx.fillRect(-4, -5, 3, 3);
                ctx.fillRect(1, -5, 3, 3);
                ctx.fillStyle = '#000';
                ctx.fillRect(-3, -4, 2, 2);
                ctx.fillRect(2, -4, 2, 2);
            }
        }
        ctx.restore();
    }
}
