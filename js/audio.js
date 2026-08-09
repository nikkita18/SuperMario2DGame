class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.musicInterval = null;
        this.muted = false;
    }

    init() {
        if (!this.initialized) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } else if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        } else {
            this.init();
            // Resume music for current level if playing
            if (window.game && window.game.state === 2) {
                const track = window.game.currentLevelIndex === 1 ? 'underground' : (window.game.currentLevelIndex === 2 ? 'castle' : 'overworld');
                this.startMusic(track);
            }
        }
    }

    _playTone(freq, type, duration, slide = 0) {
        if (!this.ctx || this.ctx.state === 'closed' || this.muted) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            if (slide !== 0 && freq + slide > 0) {
                osc.frequency.exponentialRampToValueAtTime(freq + slide, this.ctx.currentTime + duration);
            }
            
            // Clean gain envelope to prevent clicking
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Silently swallow AudioContext autoplay policy errors
        }
    }

    playJump() { this._playTone(330, 'square', 0.18, 350); }
    
    playCoin() { 
        this._playTone(987.77, 'square', 0.08); 
        setTimeout(() => this._playTone(1318.51, 'square', 0.18), 80);
    }
    
    playBump() { this._playTone(120, 'triangle', 0.12, -60); }
    
    playStomp() { this._playTone(350, 'square', 0.12, -220); }
    
    playKick() { this._playTone(180, 'triangle', 0.15, -120); }

    playPowerUp() {
        let t = 0;
        [330, 392, 659, 523, 587, 784].forEach(f => {
            setTimeout(() => this._playTone(f, 'square', 0.08), t);
            t += 60;
        });
    }

    playPowerDown() {
        let t = 0;
        [784, 587, 523, 392, 330, 261].forEach(f => {
            setTimeout(() => this._playTone(f, 'square', 0.08), t);
            t += 60;
        });
    }

    playOneUp() {
        let t = 0;
        [330, 392, 659, 523, 587, 784, 1046].forEach(f => {
            setTimeout(() => this._playTone(f, 'square', 0.08), t);
            t += 50;
        });
    }

    playDeath() {
        this.stopMusic();
        let t = 0;
        [494, 466, 440, 0, 349, 392, 261].forEach(f => {
            if (f > 0) {
                setTimeout(() => this._playTone(f, 'square', 0.15), t);
            }
            t += 140;
        });
    }

    playFlagpole() {
        this.stopMusic();
        let t = 0;
        [261, 329, 392, 523, 659, 784, 1046].forEach(f => {
            setTimeout(() => this._playTone(f, 'square', 0.12), t);
            t += 120;
        });
    }

    playBreak() { this._playTone(180, 'triangle', 0.15, -100); }
    playFireball() { this._playTone(550, 'square', 0.08, -350); }
    playPause() { this._playTone(660, 'square', 0.08); }
    
    playGameOver() {
        this.stopMusic();
        let t = 0;
        [440, 349, 293, 220].forEach(f => {
            setTimeout(() => this._playTone(f, 'square', 0.25), t);
            t += 250;
        });
    }

    startMusic(trackType = 'overworld') {
        if (this.muted) return;
        this.init();
        this.stopMusic();
        
        // Track Melodies
        const overworld = [
            659, 659, 0, 659, 0, 523, 659, 0, 784, 0, 0, 0, 392, 0, 0, 0,
            523, 0, 0, 392, 0, 0, 330, 0, 0, 440, 0, 494, 0, 440, 392, 0,
            330, 784, 880, 698, 784, 0, 659, 0, 523, 587, 494, 0, 0, 0
        ];
        const underground = [
            261, 523, 440, 880, 466, 932, 0, 0,
            261, 523, 440, 880, 466, 932, 0, 0,
            196, 392, 330, 659, 349, 698, 0, 0
        ];
        const castle = [
            165, 175, 196, 175, 165, 155, 165, 175,
            196, 220, 196, 175, 165, 155, 165, 0
        ];
        const star = [
            659, 523, 659, 523, 659, 523, 659, 523,
            587, 494, 587, 494, 587, 494, 587, 494
        ];

        let melody = overworld;
        let tempo = 130;
        
        if (trackType === 'underground') {
            melody = underground;
            tempo = 110;
        } else if (trackType === 'castle') {
            melody = castle;
            tempo = 90;
        } else if (trackType === 'star') {
            melody = star;
            tempo = 80;
        }
        
        let index = 0;
        this.musicInterval = setInterval(() => {
            if (window.game && window.game.state === 2) { // 2 = GAME_STATES.PLAYING
                const freq = melody[index];
                if (freq > 0) {
                    this._playTone(freq, trackType === 'castle' ? 'sawtooth' : 'square', 0.08);
                }
                index = (index + 1) % melody.length;
            }
        }, tempo);
    }

    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }
}
const AudioSystem = new AudioManager();
window.AudioSystem = AudioSystem;
