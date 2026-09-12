class BlockManager {
    static createBounce(x, y) {
        return {
            x: x,
            y: y,
            offsetY: 0,
            vy: -2,
            active: true
        };
    }

    static updateBounces(bounces) {
        for (let i = bounces.length - 1; i >= 0; i--) {
            let b = bounces[i];
            b.offsetY += b.vy;
            b.vy += 0.5;
            if (b.offsetY >= 0) {
                b.offsetY = 0;
                b.active = false;
                bounces.splice(i, 1);
            }
        }
    }
}
