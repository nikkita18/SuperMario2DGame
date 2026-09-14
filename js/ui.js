class UIManager {
    constructor() {
        this.screens = {
            title: document.getElementById('title-screen'),
            transition: document.getElementById('transition-screen'),
            gameOver: document.getElementById('game-over-screen'),
            pause: document.getElementById('pause-screen'),
            victory: document.getElementById('victory-screen')
        };
        
        this.hud = {
            score: document.getElementById('hud-score'),
            coins: document.getElementById('hud-coins'),
            world: document.getElementById('hud-world'),
            time: document.getElementById('hud-time')
        };
        
        this.msgTimeout = null;
        this.setupTouchControls();
    }
    
    showScreen(name) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        if (this.screens[name]) {
            this.screens[name].classList.add('active');
        }
    }
    
    setupTransition(worldName, lives) {
        const worldEl = document.getElementById('transition-world');
        const livesEl = document.getElementById('transition-lives');
        if (worldEl) worldEl.textContent = `WORLD ${worldName}`;
        if (livesEl) livesEl.textContent = lives;
        this.showScreen('transition');
    }
    
    updateHUD(score, coins, world, time, highScore = 0) {
        if (this.hud.score) this.hud.score.textContent = String(score).padStart(6, '0');
        if (this.hud.coins) this.hud.coins.textContent = String(coins).padStart(2, '0');
        if (this.hud.world) this.hud.world.textContent = world;
        if (this.hud.time) this.hud.time.textContent = String(Math.max(0, Math.ceil(time))).padStart(3, '0');
        const topEl = document.getElementById('hud-top');
        if (topEl) topEl.textContent = String(highScore).padStart(6, '0');
    }
    
    showPause() {
        if (this.screens.pause) this.screens.pause.classList.add('active');
    }
    
    hidePause() {
        if (this.screens.pause) this.screens.pause.classList.remove('active');
    }
    
    setupTouchControls() {
        const bindTouch = (id, key) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            
            const press = (e) => {
                if (e.cancelable) e.preventDefault();
                if (window.AudioSystem) window.AudioSystem.init();
                if (window.Input) window.Input.setKey(key, true);
            };

            const release = (e) => {
                if (e && e.cancelable) e.preventDefault();
                if (window.Input) window.Input.setKey(key, false);
            };

            btn.addEventListener('touchstart', press, { passive: false });
            btn.addEventListener('touchend', release, { passive: false });
            btn.addEventListener('touchcancel', release, { passive: false });

            btn.addEventListener('mousedown', press);
            btn.addEventListener('mouseup', release);
            btn.addEventListener('mouseleave', release);
        };
        
        bindTouch('btn-left', 'ArrowLeft');
        bindTouch('btn-right', 'ArrowRight');
        bindTouch('btn-a', ' ');
        bindTouch('btn-b', 'Shift');
    }
}

const UI = new UIManager();
window.UI = UI;
