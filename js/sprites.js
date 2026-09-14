class SpriteManager {
    constructor() {
        this.cache = {};
        this.init();
    }

    createCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas: c, ctx };
    }

    init() {
        this.generateMarioSprites();
        this.generateEnemySprites();
        this.generateTileSprites();
        this.generateItemSprites();
        this.generateBackgroundSprites();
    }

    generateMarioSprites() {
        this.cache.mario = {
            small: {
                idle: this._drawMarioSmall('idle'),
                walk: [this._drawMarioSmall('walk0'), this._drawMarioSmall('walk1'), this._drawMarioSmall('walk2')],
                jump: this._drawMarioSmall('jump'),
                skid: this._drawMarioSmall('skid'),
                dead: this._drawMarioSmall('dead')
            },
            big: {
                idle: this._drawMarioBig('idle', '#e52521', '#2b37c6'),
                walk: [this._drawMarioBig('walk0', '#e52521', '#2b37c6'), this._drawMarioBig('walk1', '#e52521', '#2b37c6'), this._drawMarioBig('walk2', '#e52521', '#2b37c6')],
                jump: this._drawMarioBig('jump', '#e52521', '#2b37c6'),
                skid: this._drawMarioBig('skid', '#e52521', '#2b37c6')
            },
            fire: {
                idle: this._drawMarioBig('idle', '#ffffff', '#e52521'),
                walk: [this._drawMarioBig('walk0', '#ffffff', '#e52521'), this._drawMarioBig('walk1', '#ffffff', '#e52521'), this._drawMarioBig('walk2', '#ffffff', '#e52521')],
                jump: this._drawMarioBig('jump', '#ffffff', '#e52521'),
                skid: this._drawMarioBig('skid', '#ffffff', '#e52521')
            }
        };
    }

    _drawMarioSmall(pose) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        const red = '#e52521', brown = '#6b4700', skin = '#ffa54c', black = '#000';
        const blue = '#2b37c6';

        if (pose === 'dead') {
            // Flipped upside-down dead pose
            ctx.fillStyle = red; ctx.fillRect(4, 1, 8, 3); // cap
            ctx.fillStyle = skin; ctx.fillRect(4, 4, 8, 4); // face
            ctx.fillStyle = blue; ctx.fillRect(3, 8, 10, 4); // overalls
            ctx.fillStyle = brown; ctx.fillRect(4, 12, 3, 3); ctx.fillRect(9, 12, 3, 3); // shoes
            ctx.fillStyle = black; ctx.fillRect(8, 5, 2, 2); // eye
            return canvas;
        }

        // === Cap ===
        ctx.fillStyle = red;
        ctx.fillRect(5, 0, 7, 1);   // cap top
        ctx.fillRect(3, 1, 10, 2);  // cap brim wide
        ctx.fillRect(4, 3, 3, 1);   // brim overhang

        // === Hair / Sideburn ===
        ctx.fillStyle = brown;
        ctx.fillRect(3, 3, 3, 3);   // sideburn block
        ctx.fillRect(3, 6, 1, 1);   // lower sideburn

        // === Face ===
        ctx.fillStyle = skin;
        ctx.fillRect(6, 3, 7, 4);   // main face
        ctx.fillRect(5, 4, 1, 2);   // cheek

        // === Nose ===
        ctx.fillStyle = skin;
        ctx.fillRect(11, 4, 2, 2);  // protruding nose

        // === Eye ===
        ctx.fillStyle = black;
        ctx.fillRect(9, 3, 2, 2);

        // === Mustache ===
        ctx.fillStyle = brown;
        ctx.fillRect(8, 6, 5, 1);

        // === Body + Overalls ===
        if (pose === 'jump') {
            ctx.fillStyle = red; ctx.fillRect(3, 7, 10, 3);    // shirt
            ctx.fillStyle = blue; ctx.fillRect(4, 9, 8, 3);    // overalls
            ctx.fillStyle = '#f8d870'; ctx.fillRect(5, 9, 1, 1); ctx.fillRect(9, 9, 1, 1); // buttons
            // Jump legs: one up, one down
            ctx.fillStyle = brown;
            ctx.fillRect(2, 11, 4, 3);   // left shoe (high)
            ctx.fillRect(10, 13, 4, 3);  // right shoe (low)
        } else if (pose === 'skid') {
            ctx.fillStyle = red; ctx.fillRect(3, 7, 10, 3);
            ctx.fillStyle = blue; ctx.fillRect(4, 9, 8, 3);
            ctx.fillStyle = '#f8d870'; ctx.fillRect(5, 9, 1, 1); ctx.fillRect(9, 9, 1, 1);
            ctx.fillStyle = brown;
            ctx.fillRect(2, 12, 5, 4);
            ctx.fillRect(9, 12, 5, 4);
        } else if (pose === 'walk1') {
            ctx.fillStyle = red; ctx.fillRect(3, 7, 10, 3);
            ctx.fillStyle = blue; ctx.fillRect(4, 9, 7, 3);
            ctx.fillStyle = '#f8d870'; ctx.fillRect(5, 9, 1, 1); ctx.fillRect(9, 9, 1, 1);
            ctx.fillStyle = brown;
            ctx.fillRect(3, 12, 4, 4);
            ctx.fillRect(9, 11, 4, 4);
        } else if (pose === 'walk2') {
            ctx.fillStyle = red; ctx.fillRect(3, 7, 10, 3);
            ctx.fillStyle = blue; ctx.fillRect(5, 9, 7, 3);
            ctx.fillStyle = '#f8d870'; ctx.fillRect(5, 9, 1, 1); ctx.fillRect(9, 9, 1, 1);
            ctx.fillStyle = brown;
            ctx.fillRect(2, 11, 4, 4);
            ctx.fillRect(10, 12, 4, 4);
        } else {
            // Idle / Walk0
            ctx.fillStyle = red; ctx.fillRect(3, 7, 10, 3);    // shirt
            ctx.fillStyle = blue; ctx.fillRect(4, 9, 7, 3);    // overalls
            ctx.fillStyle = '#f8d870'; ctx.fillRect(5, 9, 1, 1); ctx.fillRect(9, 9, 1, 1); // buttons
            ctx.fillStyle = brown;
            ctx.fillRect(3, 12, 4, 4);  // left shoe
            ctx.fillRect(9, 12, 4, 4);  // right shoe
        }

        return canvas;
    }

    _drawMarioBig(pose, shirtColor, overallsColor) {
        const { canvas, ctx } = this.createCanvas(16, 32);
        const brown = '#6b4700', skin = '#ffa54c', black = '#000';
        const shirtDark = shirtColor === '#ffffff' ? '#dddddd' : '#9a100d';
        const overDark = overallsColor === '#e52521' ? '#9a100d' : '#181f7c';

        // === Cap ===
        ctx.fillStyle = shirtColor;
        ctx.fillRect(5, 0, 7, 1);    // cap peak
        ctx.fillRect(3, 1, 11, 3);   // cap body
        ctx.fillRect(4, 4, 4, 1);    // brim overhang

        // === Hair / Sideburn ===
        ctx.fillStyle = brown;
        ctx.fillRect(3, 4, 3, 4);    // sideburn
        ctx.fillRect(2, 5, 2, 3);    // extra sideburn depth

        // === Face ===
        ctx.fillStyle = skin;
        ctx.fillRect(6, 4, 8, 5);    // main face
        ctx.fillRect(5, 5, 1, 3);    // cheek

        // === Nose ===
        ctx.fillRect(12, 5, 3, 3);   // protruding nose

        // === Eye ===
        ctx.fillStyle = black;
        ctx.fillRect(9, 4, 2, 3);

        // === Mustache ===
        ctx.fillStyle = brown;
        ctx.fillRect(8, 8, 6, 1);

        // === Torso / Shirt ===
        ctx.fillStyle = shirtColor;
        ctx.fillRect(3, 9, 11, 5);    // shirt
        ctx.fillStyle = shirtDark;
        ctx.fillRect(3, 13, 11, 1);   // shirt bottom shadow

        // === Arms (skin tone) ===
        ctx.fillStyle = skin;
        if (pose === 'jump') {
            ctx.fillRect(1, 9, 3, 3);   // left arm up
            ctx.fillRect(13, 9, 3, 3);  // right arm up
        } else if (pose === 'walk1' || pose === 'walk2') {
            ctx.fillRect(1, 10, 3, 4);  // left arm swing
            ctx.fillRect(13, 11, 3, 3); // right arm swing
        } else {
            ctx.fillRect(1, 10, 3, 4);  // left arm
            ctx.fillRect(13, 10, 3, 4); // right arm
        }

        // === Overalls ===
        ctx.fillStyle = overallsColor;
        ctx.fillRect(4, 14, 9, 10);
        ctx.fillStyle = overDark;
        ctx.fillRect(4, 23, 9, 1);    // overalls shadow

        // === Overall straps ===
        ctx.fillStyle = overallsColor;
        ctx.fillRect(5, 10, 2, 4);    // left strap
        ctx.fillRect(10, 10, 2, 4);   // right strap

        // === Buttons ===
        ctx.fillStyle = '#f8d870';
        ctx.fillRect(5, 15, 2, 2);
        ctx.fillRect(10, 15, 2, 2);

        // === Legs / Shoes ===
        ctx.fillStyle = brown;
        if (pose === 'jump') {
            // Jump: legs spread far apart
            ctx.fillRect(1, 24, 5, 5);    // left leg/shoe (up high)
            ctx.fillRect(11, 21, 5, 4);   // right leg/shoe (down)
            ctx.fillStyle = overallsColor;
            ctx.fillRect(4, 22, 3, 3);    // left pant
            ctx.fillRect(10, 19, 3, 3);   // right pant
        } else if (pose === 'skid') {
            ctx.fillRect(2, 27, 5, 5);
            ctx.fillRect(10, 27, 5, 5);
            ctx.fillStyle = overallsColor;
            ctx.fillRect(4, 24, 3, 4);
            ctx.fillRect(10, 24, 3, 4);
        } else if (pose === 'walk1') {
            ctx.fillRect(2, 27, 5, 5);
            ctx.fillRect(10, 25, 5, 7);
            ctx.fillStyle = overallsColor;
            ctx.fillRect(4, 24, 3, 4);
            ctx.fillRect(10, 23, 3, 3);
        } else if (pose === 'walk2') {
            ctx.fillRect(2, 24, 5, 6);
            ctx.fillRect(10, 27, 5, 5);
            ctx.fillStyle = overallsColor;
            ctx.fillRect(4, 23, 3, 2);
            ctx.fillRect(10, 24, 3, 4);
        } else {
            // Idle
            ctx.fillRect(3, 27, 5, 5);
            ctx.fillRect(9, 27, 5, 5);
            ctx.fillStyle = overallsColor;
            ctx.fillRect(4, 24, 4, 4);
            ctx.fillRect(9, 24, 4, 4);
        }

        return canvas;
    }

    generateEnemySprites() {
        this.cache.enemies = {
            goomba: {
                walk: [this._drawGoomba(0), this._drawGoomba(1)],
                squashed: this._drawGoombaSquashed(),
                shell: this._drawGoombaSquashed()
            },
            koopa: {
                walk: [this._drawKoopa(0), this._drawKoopa(1)],
                squashed: this._drawKoopaShell(),
                shell: this._drawKoopaShell()
            },
            piranha: {
                walk: [this._drawPiranha(0), this._drawPiranha(1)],
                squashed: this._drawPiranha(0),
                shell: this._drawPiranha(0)
            },
            bowser: {
                walk: [this._drawBowser(0), this._drawBowser(1)],
                squashed: this._drawBowser(0),
                shell: this._drawBowser(0)
            }
        };
    }

    _drawPiranha(frame) {
        const { canvas, ctx } = this.createCanvas(16, 24);
        ctx.fillStyle = '#008000'; ctx.fillRect(6, 12, 4, 12); // Stem
        ctx.fillStyle = '#50e020'; ctx.fillRect(6, 12, 1, 12); // Stem Highlight
        ctx.fillStyle = '#e80000'; ctx.fillRect(2, 2, 12, 10); // Head
        ctx.fillStyle = '#fff';
        ctx.fillRect(4, 4, 2, 2); ctx.fillRect(10, 4, 2, 2); ctx.fillRect(7, 2, 2, 2); // Polka dots
        // Mouth opening + teeth
        ctx.fillStyle = frame === 0 ? '#000' : '#e80000';
        ctx.fillRect(3, 7, 10, frame === 0 ? 4 : 1);
        ctx.fillStyle = '#fff'; ctx.fillRect(4, 7, 2, 2); ctx.fillRect(10, 7, 2, 2);
        return canvas;
    }

    _drawBowser(frame) {
        const { canvas, ctx } = this.createCanvas(32, 32);
        const green = '#00a800', darkGreen = '#005800', lightGreen = '#50e020';
        const yellow = '#f8d870', orange = '#f87800', red = '#e80000';
        const white = '#ffffff';

        // Shell (Green Body + Spikes)
        ctx.fillStyle = darkGreen; ctx.fillRect(3, 5, 20, 22);
        ctx.fillStyle = green; ctx.fillRect(5, 7, 16, 18);
        ctx.fillStyle = lightGreen; ctx.fillRect(7, 9, 12, 14);

        // Shell Spikes (White + Dark Shadow Base)
        ctx.fillStyle = darkGreen; ctx.fillRect(1, 7, 4, 6); ctx.fillRect(1, 15, 4, 6);
        ctx.fillStyle = white; ctx.fillRect(0, 8, 4, 4); ctx.fillRect(0, 16, 4, 4);

        // Yellow Stomach with Stripes
        ctx.fillStyle = yellow; ctx.fillRect(16, 12, 11, 14);
        ctx.fillStyle = orange; ctx.fillRect(16, 15, 11, 1); ctx.fillRect(16, 19, 11, 1); ctx.fillRect(16, 23, 11, 1);

        // Head / Snout / Fiery Red Hair
        ctx.fillStyle = red; ctx.fillRect(18, 0, 10, 5);
        ctx.fillStyle = '#ff6600'; ctx.fillRect(20, 1, 6, 2);
        ctx.fillStyle = green; ctx.fillRect(20, 4, 11, 11);
        ctx.fillStyle = yellow; ctx.fillRect(24, 9, 7, 5);

        // Fiery Glowing Eye & Sharp Horns/Teeth
        ctx.fillStyle = white; ctx.fillRect(2, 2, 4, 4);
        ctx.fillStyle = red; ctx.fillRect(23, 5, 3, 3);
        ctx.fillStyle = white; ctx.fillRect(24, 6, 1, 1);
        ctx.fillStyle = white; ctx.fillRect(25, 13, 2, 3); ctx.fillRect(29, 13, 2, 3);

        // Animated Claws / Feet
        ctx.fillStyle = yellow;
        if (frame === 0) {
            ctx.fillRect(5, 26, 9, 6); ctx.fillRect(17, 26, 9, 6);
            ctx.fillStyle = white; ctx.fillRect(4, 30, 2, 2); ctx.fillRect(16, 30, 2, 2);
        } else {
            ctx.fillRect(7, 26, 9, 6); ctx.fillRect(19, 26, 9, 6);
            ctx.fillStyle = white; ctx.fillRect(6, 30, 2, 2); ctx.fillRect(18, 30, 2, 2);
        }
        return canvas;
    }

    _drawGoomba(frame) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        const darkBrown = '#703000', lightBrown = '#e87830', black = '#000000', white = '#ffffff';

        // Cap / Head
        ctx.fillStyle = darkBrown;
        ctx.beginPath();
        ctx.moveTo(3, 10); ctx.lineTo(8, 1); ctx.lineTo(13, 10);
        ctx.fill();
        ctx.fillRect(3, 6, 10, 5);
        ctx.fillStyle = '#984000'; ctx.fillRect(5, 2, 6, 2); // Top Highlight

        // Body / Stem
        ctx.fillStyle = lightBrown;
        ctx.fillRect(5, 10, 6, 3);

        // Eyes
        ctx.fillStyle = white;
        ctx.fillRect(4, 6, 2, 4); ctx.fillRect(10, 6, 2, 4);
        ctx.fillStyle = black;
        ctx.fillRect(5, 7, 1, 2); ctx.fillRect(10, 7, 1, 2);

        // Feet
        ctx.fillStyle = black;
        if (frame === 0) {
            ctx.fillRect(1, 12, 6, 4); ctx.fillRect(9, 13, 5, 3);
        } else {
            ctx.fillRect(2, 13, 5, 3); ctx.fillRect(9, 12, 6, 4);
        }
        return canvas;
    }

    _drawGoombaSquashed() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#703000';
        ctx.fillRect(1, 10, 14, 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(3, 11, 3, 2); ctx.fillRect(10, 11, 3, 2);
        return canvas;
    }

    _drawKoopa(frame) {
        const { canvas, ctx } = this.createCanvas(16, 24);
        const green = '#00a800', yellow = '#f8d870', white = '#ffffff', black = '#000000';

        // Head
        ctx.fillStyle = green;
        ctx.fillRect(6, 1, 8, 7);
        ctx.fillStyle = white;
        ctx.fillRect(10, 3, 4, 3);
        ctx.fillStyle = black;
        ctx.fillRect(12, 4, 2, 2);

        // Shell + Hex Pattern
        ctx.fillStyle = green; ctx.fillRect(3, 8, 10, 10);
        ctx.fillStyle = '#005800'; ctx.fillRect(3, 8, 10, 1); ctx.fillRect(3, 17, 10, 1);
        ctx.fillStyle = yellow; ctx.fillRect(2, 10, 2, 6);

        // Feet
        ctx.fillStyle = yellow;
        if (frame === 0) {
            ctx.fillRect(2, 18, 5, 5); ctx.fillRect(9, 19, 5, 4);
        } else {
            ctx.fillRect(2, 19, 5, 4); ctx.fillRect(9, 18, 5, 5);
        }
        return canvas;
    }

    _drawKoopaShell() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#00a800'; ctx.fillRect(2, 3, 12, 11);
        ctx.fillStyle = '#f8d870'; ctx.fillRect(1, 6, 2, 6); ctx.fillRect(3, 12, 10, 2);
        ctx.fillStyle = '#005800'; ctx.fillRect(5, 5, 6, 6);
        return canvas;
    }

    generateTileSprites() {
        this.cache.tiles = {
            ground: this._drawGroundTile('#c84c0c', '#e87830', '#000000'),
            underground_brick: this._drawGroundTile('#0070e8', '#00a8f8', '#000000'),
            castle_brick: this._drawGroundTile('#707070', '#a8a8a8', '#000000'),
            brick: this._drawBrickTile('#c84c0c', '#000000'),
            question: [this._drawQuestionTile(0), this._drawQuestionTile(1), this._drawQuestionTile(2), this._drawQuestionTile(1)],
            used: this._drawUsedTile(),
            pipe_tl: this._drawPipe('tl'),
            pipe_tr: this._drawPipe('tr'),
            pipe_bl: this._drawPipe('bl'),
            pipe_br: this._drawPipe('br'),
            flagpole: this._drawFlagpole(),
            flag: this._drawFlag(),
            coin: [this._drawCoin(0), this._drawCoin(1), this._drawCoin(2), this._drawCoin(1)],
            hard: this._drawHardBlock(),
            lava: [this._drawLava(0), this._drawLava(1), this._drawLava(2), this._drawLava(1)],
            axe: this._drawAxe(),
            bridge: this._drawBridge()
        };
    }

    _drawPipe(part) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        const cOutline = '#003800', cDark = '#005800', cMid = '#00a800', cLight = '#50e020', cHighlight = '#b8f818';

        ctx.fillStyle = cMid; ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = cHighlight; ctx.fillRect(2, 0, 2, 16);
        ctx.fillStyle = cLight; ctx.fillRect(4, 0, 3, 16);
        ctx.fillStyle = cDark; ctx.fillRect(11, 0, 3, 16);
        ctx.fillStyle = cOutline; ctx.fillRect(14, 0, 2, 16);

        if (part === 'tl' || part === 'tr') {
            ctx.fillStyle = cOutline; ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 15, 16, 1);
            if (part === 'tl') ctx.fillRect(0, 0, 1, 16);
            if (part === 'tr') ctx.fillRect(15, 0, 1, 16);
        }
        return canvas;
    }

    _drawAxe() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#f8d870'; ctx.fillRect(6, 2, 4, 12);
        ctx.fillRect(2, 2, 6, 6);
        ctx.fillStyle = '#fff'; ctx.fillRect(2, 2, 2, 6);
        return canvas;
    }

    _drawBridge() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#887000'; ctx.fillRect(0, 4, 16, 4);
        ctx.fillStyle = '#000'; ctx.fillRect(0, 8, 16, 8);
        return canvas;
    }

    _drawGroundTile(bg, light, dark) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = bg; ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = light; ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 0, 1, 16);
        ctx.fillStyle = dark; ctx.fillRect(0, 15, 16, 1); ctx.fillRect(15, 0, 1, 16);
        return canvas;
    }

    _drawBrickTile(bg, border) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        const brickBg = '#b84418', brickLight = '#f87858', brickDark = '#681800';
        ctx.fillStyle = brickBg; ctx.fillRect(0, 0, 16, 16);

        // Mortar Black Lines
        ctx.fillStyle = border;
        ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 7, 16, 1); ctx.fillRect(0, 15, 16, 1);
        ctx.fillRect(7, 0, 1, 8); ctx.fillRect(15, 0, 1, 8);
        ctx.fillRect(3, 8, 1, 8); ctx.fillRect(11, 8, 1, 8);

        // Brick Top Highlights
        ctx.fillStyle = brickLight;
        ctx.fillRect(0, 1, 7, 1); ctx.fillRect(8, 1, 7, 1);
        ctx.fillRect(0, 8, 3, 1); ctx.fillRect(4, 8, 7, 1); ctx.fillRect(12, 8, 3, 1);

        // Brick Bottom Shadows
        ctx.fillStyle = brickDark;
        ctx.fillRect(0, 6, 7, 1); ctx.fillRect(8, 6, 7, 1);
        ctx.fillRect(0, 14, 3, 1); ctx.fillRect(4, 14, 7, 1); ctx.fillRect(12, 14, 3, 1);
        return canvas;
    }

    _drawQuestionTile(frame) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        const gold = frame === 3 ? '#e87830' : '#f8b800';
        const goldLight = '#f8f8a8';
        const goldDark = '#884400';

        ctx.fillStyle = gold; ctx.fillRect(0, 0, 16, 16);
        // Top and Left Bevel Highlights
        ctx.fillStyle = goldLight; ctx.fillRect(1, 1, 14, 1); ctx.fillRect(1, 1, 1, 14);
        // Bottom and Right Shadow Bevels
        ctx.fillStyle = goldDark; ctx.fillRect(1, 14, 14, 1); ctx.fillRect(14, 1, 1, 14);
        // Outer Black Frame
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 0, 1, 16); ctx.fillRect(0, 15, 16, 1); ctx.fillRect(15, 0, 1, 16);
        // Corner Bolts
        ctx.fillStyle = '#000';
        ctx.fillRect(2, 2, 1, 1); ctx.fillRect(13, 2, 1, 1); ctx.fillRect(2, 13, 1, 1); ctx.fillRect(13, 13, 1, 1);
        // 3D Shadowed ? Symbol
        ctx.fillStyle = goldDark;
        ctx.fillRect(6, 4, 6, 2); ctx.fillRect(10, 6, 2, 3); ctx.fillRect(8, 9, 2, 2); ctx.fillRect(8, 12, 2, 2);
        ctx.fillStyle = '#fff';
        ctx.fillRect(5, 3, 6, 2); ctx.fillRect(9, 5, 2, 3); ctx.fillRect(7, 8, 2, 2); ctx.fillRect(7, 11, 2, 2);
        return canvas;
    }

    _drawUsedTile() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#7c7c7c'; ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 0, 1, 16); ctx.fillRect(0, 15, 16, 1); ctx.fillRect(15, 0, 1, 16);
        return canvas;
    }

    _drawFlagpole() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#00a800'; ctx.fillRect(7, 0, 2, 16);
        ctx.fillStyle = '#b8f818'; ctx.fillRect(7, 0, 1, 16); // Highlight
        return canvas;
    }

    _drawFlag() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#00a800';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(14, 8); ctx.lineTo(0, 16);
        ctx.fill();
        ctx.fillStyle = '#b8f818'; ctx.fillRect(1, 2, 10, 2); // Highlight
        return canvas;
    }

    _drawCoin(frame) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        const gold = '#f8d870', darkGold = '#b8860b';
        ctx.fillStyle = gold;
        if (frame === 0) ctx.fillRect(4, 2, 8, 12);
        else if (frame === 1) ctx.fillRect(5, 2, 6, 12);
        else ctx.fillRect(7, 2, 2, 12);
        ctx.fillStyle = darkGold;
        if (frame === 0) ctx.fillRect(6, 4, 4, 8);
        return canvas;
    }

    _drawHardBlock() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#c84c0c'; ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#f87858'; ctx.fillRect(1, 1, 14, 1); ctx.fillRect(1, 1, 1, 14);
        ctx.fillStyle = '#000'; ctx.fillRect(0, 15, 16, 1); ctx.fillRect(15, 0, 1, 16);
        return canvas;
    }

    _drawLava(frame) {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#d80000'; ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#f85800'; ctx.fillRect(0, 2, 16, 12);
        ctx.fillStyle = '#f8d870';
        const yOff = (frame * 3) % 8;
        ctx.fillRect(0, yOff, 16, 2);
        ctx.fillRect((frame * 4) % 16, 6, 4, 2);
        ctx.fillRect(((frame + 2) * 5) % 16, 11, 3, 2);
        return canvas;
    }

    generateItemSprites() {
        this.cache.items = {
            mushroom: this._drawMushroom('#e52521'),
            oneup: this._drawMushroom('#00a800'),
            fireflower: this._drawFireFlower(),
            star: this._drawStar()
        };
    }

    _drawMushroom(capColor = '#e52521') {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = capColor; ctx.fillRect(2, 1, 12, 8);
        ctx.fillStyle = '#fff'; ctx.fillRect(4, 3, 3, 3); ctx.fillRect(9, 3, 3, 3);
        ctx.fillStyle = '#ffcc99'; ctx.fillRect(4, 9, 8, 6);
        ctx.fillStyle = '#000'; ctx.fillRect(5, 10, 2, 3); ctx.fillRect(9, 10, 2, 3); // Eyes
        return canvas;
    }

    _drawFireFlower() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#ff8800'; ctx.fillRect(3, 1, 10, 9);
        ctx.fillStyle = '#fff'; ctx.fillRect(5, 3, 6, 5);
        ctx.fillStyle = '#00a800'; ctx.fillRect(7, 10, 2, 6);
        ctx.fillStyle = '#000'; ctx.fillRect(6, 4, 1, 3); ctx.fillRect(9, 4, 1, 3); // Eyes
        return canvas;
    }

    _drawStar() {
        const { canvas, ctx } = this.createCanvas(16, 16);
        ctx.fillStyle = '#f8d870'; ctx.fillRect(4, 1, 8, 14);
        ctx.fillRect(1, 4, 14, 6);
        ctx.fillStyle = '#000'; ctx.fillRect(5, 5, 2, 3); ctx.fillRect(9, 5, 2, 3); // Eyes
        return canvas;
    }

    generateBackgroundSprites() {
        this.cache.backgrounds = {
            cloud: this._drawCloud(),
            hill: this._drawHill(),
            bush: this._drawBush(),
            castle: this._drawCastle()
        };
    }

    _drawCloud() {
        const { canvas, ctx } = this.createCanvas(48, 24);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(12, 16, 8, 0, Math.PI * 2);
        ctx.arc(24, 12, 12, 0, Math.PI * 2);
        ctx.arc(36, 16, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#80d0f8'; // Subtle blue cloud shadow outline
        ctx.fillRect(4, 20, 40, 2);
        return canvas;
    }

    _drawHill() {
        const { canvas, ctx } = this.createCanvas(96, 48);
        ctx.fillStyle = '#00a800';
        ctx.beginPath();
        ctx.arc(48, 48, 44, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#005800'; // Dark green hill shadow dots
        ctx.fillRect(20, 30, 4, 4); ctx.fillRect(40, 20, 6, 6); ctx.fillRect(68, 28, 4, 4);
        return canvas;
    }

    _drawBush() {
        const { canvas, ctx } = this.createCanvas(48, 16);
        ctx.fillStyle = '#00a800';
        ctx.beginPath();
        ctx.arc(12, 16, 8, Math.PI, 0);
        ctx.arc(24, 16, 12, Math.PI, 0);
        ctx.arc(36, 16, 8, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#005800';
        ctx.fillRect(8, 12, 32, 2);
        return canvas;
    }

    _drawCastle() {
        const { canvas, ctx } = this.createCanvas(80, 80);
        const brickRed = '#c84c0c', black = '#000000';

        // Main Keep Structure
        ctx.fillStyle = brickRed; ctx.fillRect(0, 24, 80, 56);
        ctx.fillRect(16, 0, 48, 24);

        // Crenellations / Battlement Cutouts
        ctx.fillStyle = black;
        ctx.fillRect(0, 24, 8, 6); ctx.fillRect(16, 24, 8, 6); ctx.fillRect(32, 24, 8, 6); ctx.fillRect(48, 24, 8, 6); ctx.fillRect(64, 24, 8, 6);
        ctx.fillRect(16, 0, 6, 6); ctx.fillRect(28, 0, 6, 6); ctx.fillRect(40, 0, 6, 6); ctx.fillRect(52, 0, 6, 6);

        // Archway Door
        ctx.fillRect(32, 48, 16, 32);
        ctx.fillRect(34, 44, 12, 4);

        // Windows
        ctx.fillRect(24, 12, 6, 8); ctx.fillRect(50, 12, 6, 8);
        ctx.fillRect(12, 36, 6, 8); ctx.fillRect(62, 36, 6, 8);

        return canvas;
    }

    getMario(size, state, frame = 0) {
        if (!this.cache.mario || !this.cache.mario[size]) return null;
        const s = this.cache.mario[size][state];
        return Array.isArray(s) ? s[frame % s.length] : s;
    }

    getEnemy(type, state, frame = 0) {
        if (!this.cache.enemies || !this.cache.enemies[type]) return null;
        const s = this.cache.enemies[type][state];
        return Array.isArray(s) ? s[frame % s.length] : s;
    }

    getTile(type, frame = 0) {
        if (!this.cache.tiles) return null;
        const s = this.cache.tiles[type];
        return Array.isArray(s) ? s[frame % s.length] : s;
    }

    getItem(type, frame = 0) {
        if (!this.cache.items) return null;
        return this.cache.items[type] || null;
    }

    getBackground(type) {
        if (!this.cache.backgrounds) return null;
        return this.cache.backgrounds[type] || null;
    }
}

const Sprites = new SpriteManager();
window.Sprites = Sprites;
