class InputManager {
    constructor() {
        this.keys = {};
        this.previousKeys = {};

        this.keyMap = {
            'ArrowUp': 'jump',
            'w': 'jump', 'W': 'jump',
            'ArrowDown': 'down',
            's': 'down', 'S': 'down',
            'ArrowLeft': 'left',
            'a': 'left', 'A': 'left',
            'ArrowRight': 'right',
            'd': 'right', 'D': 'right',
            ' ': 'jump',
            'Shift': 'action',
            'z': 'action', 'Z': 'action',
            'x': 'action', 'X': 'action',
            'j': 'jump', 'J': 'jump',
            'k': 'action', 'K': 'action',
            'f': 'fire_cheat', 'F': 'fire_cheat',
            'Enter': 'start',
            'Escape': 'pause',
            'p': 'pause', 'P': 'pause',
            '1': 'level1',
            '2': 'level2',
            '3': 'level3'
        };

        // Prevent default on game keys so page doesn't scroll
        this._gameKeys = new Set(Object.keys(this.keyMap));

        window.addEventListener('keydown', (e) => {
            if (this._gameKeys.has(e.key)) {
                e.preventDefault();
            }
            const mapped = this.keyMap[e.key];
            if (mapped) {
                this.keys[mapped] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const mapped = this.keyMap[e.key];
            if (mapped) {
                this.keys[mapped] = false;
            }
        });
    }

    // Call at END of each frame to snapshot previous state
    latchFrame() {
        this.previousKeys = { ...this.keys };
    }

    isPressed(keyName) {
        return !!this.keys[keyName];
    }

    isJustPressed(keyName) {
        return !!this.keys[keyName] && !this.previousKeys[keyName];
    }

    // For touch controls
    setKey(keyName, state) {
        const mapped = this.keyMap[keyName];
        if (mapped) {
            this.keys[mapped] = state;
        } else {
            this.keys[keyName] = state;
        }
    }
}

const Input = new InputManager();
window.Input = Input;
