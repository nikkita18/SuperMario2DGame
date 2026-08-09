class ParticleSystemManager {
    constructor() {
        this.particles = [];
    }

    spawnBrickDebris(x, y) {
        const velocities = [
            { vx: -2, vy: -4 },
            { vx: 2, vy: -4 },
            { vx: -1.5, vy: -2 },
            { vx: 1.5, vy: -2 }
        ];
        velocities.forEach(v => {
            this.particles.push({
                x: x + 4,
                y: y + 4,
                vx: v.vx,
                vy: v.vy,
                size: 4,
                color: '#c84c0c',
                life: 30,
                type: 'brick'
            });
        });
    }

    spawnCoinPop(x, y) {
        this.particles.push({
            x: x + 4,
            y: y - 8,
            vx: 0,
            vy: -3,
            size: 8,
            color: '#f8d870',
            life: 15,
            type: 'coin'
        });
    }

    spawnStompStar(x, y) {
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                size: 3,
                color: '#fff',
                life: 10,
                type: 'star'
            });
        }
    }

    spawnScorePopup(x, y, text) {
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: -0.5,
            text: text,
            color: '#fff',
            life: 40,
            type: 'score'
        });
    }

    spawnSkidDust(x, y) {
        this.particles.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.3 - Math.random() * 0.4,
            size: 2,
            maxSize: 5,
            color: 'rgba(255, 255, 255, 0.7)',
            life: 16,
            type: 'dust'
        });
    }

    spawnFirework(x, y) {
        const colors = ['#f80000', '#f8d870', '#00f800', '#0088f8', '#f800f8', '#ffffff'];
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const speed = 1.5 + Math.random() * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3,
                color: baseColor,
                life: 25 + Math.floor(Math.random() * 10),
                type: 'fireworks'
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx || 0;
            p.y += p.vy || 0;
            if (p.type === 'brick') p.vy += 0.3; // Gravity for debris
            
            // Expand size for dust
            if (p.type === 'dust' && p.size < p.maxSize) {
                p.size += 0.2;
            }

            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, camX = 0, camY = 0) {
        this.particles.forEach(p => {
            const drawX = Math.floor(p.x - camX);
            const drawY = Math.floor(p.y - camY);

            if (p.type === 'score') {
                ctx.font = '8px "Press Start 2P", monospace';
                ctx.fillStyle = p.color;
                ctx.fillText(p.text, drawX, drawY);
            } else if (p.type === 'dust') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'fireworks') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = p.color;
                ctx.fillRect(drawX, drawY, p.size, p.size);
            }
        });
    }
}

const ParticleSystem = new ParticleSystemManager();
