class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.width = 16;
        this.height = 16;
        this.type = type; // 'mushroom', 'fireflower', 'star', 'coin'
        this.vx = (type === 'mushroom' || type === 'star' || type === 'oneup') ? 1 : 0;
        this.vy = type === 'coin' ? -4 : -1;
        this.active = true;
        this.emerging = type !== 'coin';
        this.emergeY = y - 16;
    }

    update(dt, level) {
        if (!this.active) return;

        // Coin: just pop up and disappear
        if (this.type === 'coin') {
            this.vy += GRAVITY;
            this.y += this.vy;
            if (this.y > this.startY) this.active = false;
            return;
        }

        // Emerging from block
        if (this.emerging) {
            this.y -= 1;
            if (this.y <= this.emergeY) {
                this.y = this.emergeY;
                this.emerging = false;
                this.vy = 0;
            }
            return;
        }

        // Fire flower stays still
        if (this.type === 'fireflower') return;

        // Gravity + movement
        this.vy += GRAVITY;
        if (this.vy > TERMINAL_VELOCITY) this.vy = TERMINAL_VELOCITY;

        // Horizontal
        this.x += this.vx;
        const leftCol = Math.floor(this.x / TILE_SIZE);
        const rightCol = Math.floor((this.x + this.width - 0.01) / TILE_SIZE);
        const topRow = Math.floor(this.y / TILE_SIZE);
        const bottomRow = Math.floor((this.y + this.height - 0.01) / TILE_SIZE);

        for (let r = topRow; r <= bottomRow; r++) {
            if (this.vx > 0 && level.isSolid(rightCol, r)) {
                this.x = rightCol * TILE_SIZE - this.width;
                this.vx = -this.vx;
            } else if (this.vx < 0 && level.isSolid(leftCol, r)) {
                this.x = (leftCol + 1) * TILE_SIZE;
                this.vx = -this.vx;
            }
        }

        // Vertical
        this.y += this.vy;
        const bRow = Math.floor((this.y + this.height - 0.01) / TILE_SIZE);
        const tRow = Math.floor(this.y / TILE_SIZE);
        const lCol = Math.floor(this.x / TILE_SIZE);
        const rCol = Math.floor((this.x + this.width - 0.01) / TILE_SIZE);

        for (let c = lCol; c <= rCol; c++) {
            if (this.vy > 0 && level.isSolid(c, bRow)) {
                this.y = bRow * TILE_SIZE - this.height;
                this.vy = this.type === 'star' ? -4 : 0;
            }
        }

        if (this.y > CANVAS_HEIGHT) this.active = false;
    }

    draw(ctx) {
        if (!this.active) return;

        let sprite = null;
        if (typeof Sprites !== 'undefined' && Sprites.getItem) {
            sprite = Sprites.getItem(this.type, 0);
        }

        if (sprite) {
            ctx.drawImage(sprite, Math.floor(this.x), Math.floor(this.y));
        } else {
            const colors = { mushroom: '#e80000', fireflower: '#ff8800', star: '#f8d870', coin: '#f8d870', oneup: '#00a800' };
            ctx.fillStyle = colors[this.type] || '#fff';
            ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
        }
    }
}

class Fireball {
    constructor(x, y, dir, isEnemy = false) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 6;
        this.vx = dir * (isEnemy ? 2.5 : 4);
        this.vy = isEnemy ? 0 : 2;
        this.active = true;
        this.bounces = 0;
        this.isEnemy = isEnemy;
    }

    update(dt, level) {
        if (!this.active) return;

        this.vy += GRAVITY;
        this.x += this.vx;

        // Horizontal wall check
        const col = this.vx > 0 ? Math.floor((this.x + this.width) / TILE_SIZE) : Math.floor(this.x / TILE_SIZE);
        const row = Math.floor((this.y + this.height / 2) / TILE_SIZE);
        if (level.isSolid(col, row)) {
            this.active = false;
            return;
        }

        // Vertical
        this.y += this.vy;
        const bRow = Math.floor((this.y + this.height) / TILE_SIZE);
        const bCol = Math.floor((this.x + this.width / 2) / TILE_SIZE);
        if (this.vy > 0 && level.isSolid(bCol, bRow)) {
            this.y = bRow * TILE_SIZE - this.height;
            this.vy = -3;
            this.bounces++;
            if (this.bounces > 1) this.active = false;
        }

        if (this.y > CANVAS_HEIGHT) this.active = false;
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2), 3, 0, Math.PI * 2);
        ctx.fill();
        // Trail
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.arc(Math.floor(this.x + this.width / 2 - this.vx * 0.3), Math.floor(this.y + this.height / 2), 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
