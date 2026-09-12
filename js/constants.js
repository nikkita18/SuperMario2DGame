// Game Constants
const CONSTANTS = {
    // Screen & Rendering
    CANVAS_WIDTH: 256,
    CANVAS_HEIGHT: 240,
    TILE_SIZE: 16,

    // Physics
    GRAVITY: 0.4,
    TERMINAL_VELOCITY: 6,
    FRICTION: 0.85,

    // Player
    PLAYER_ACCEL: 0.15,
    PLAYER_MAX_SPEED: 2.5,
    PLAYER_RUN_MAX_SPEED: 3.5,
    PLAYER_JUMP_FORCE: -7.5,
    PLAYER_MAX_FALL_SPEED: 6,
    PLAYER_SMALL_HEIGHT: 16,
    PLAYER_BIG_HEIGHT: 32,

    // Enemy
    GOOMBA_SPEED: 0.5,
    KOOPA_SPEED: 0.5,
    SHELL_SPEED: 4,

    // Game Rules
    STARTING_LIVES: 3,
    COINS_FOR_LIFE: 100,
    TIME_START: 400,
    INVINCIBLE_FRAMES: 90,

    // Scoring
    SCORE_COIN: 200,
    SCORE_STOMP_BASE: 100,
    SCORE_POWERUP: 1000,
    SCORE_BRICK: 50,
    SCORE_FLAGPOLE: [100, 400, 800, 2000, 5000],

    // Tile IDs
    TILES: {
        EMPTY: 0,
        GROUND: 1,
        BRICK: 2,
        QUESTION_COIN: 3,
        QUESTION_POWERUP: 4,
        USED_BLOCK: 5,
        PIPE_TL: 6,
        PIPE_TR: 7,
        PIPE_BL: 8,
        PIPE_BR: 9,
        FLAGPOLE: 10,
        FLAG_TOP: 11,
        COIN_TILE: 12,
        UNDERGROUND_BRICK: 13,
        CASTLE_BRICK: 14,
        LAVA: 15,
        HARD_BLOCK: 16,
        AXE: 17,
        BRIDGE: 18
    },

    // Game States
    GAME_STATES: {
        TITLE: 0,
        TRANSITION: 1,
        PLAYING: 2,
        DYING: 3,
        LEVEL_COMPLETE: 4,
        GAME_OVER: 5,
        PAUSED: 6,
        VICTORY: 7
    },

    // Power states
    POWER: {
        SMALL: 0,
        SUPER: 1,
        FIRE: 2
    },

    // Levels list
    LEVELS: ['1-1', '1-2', '1-3']
};

// Shorthand aliases for convenience (used throughout the codebase)
const {
    CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE,
    GRAVITY, TERMINAL_VELOCITY, FRICTION,
    PLAYER_ACCEL, PLAYER_MAX_SPEED, PLAYER_RUN_MAX_SPEED,
    PLAYER_JUMP_FORCE, PLAYER_MAX_FALL_SPEED,
    PLAYER_SMALL_HEIGHT, PLAYER_BIG_HEIGHT,
    GOOMBA_SPEED, KOOPA_SPEED, SHELL_SPEED,
    STARTING_LIVES, COINS_FOR_LIFE, TIME_START, INVINCIBLE_FRAMES,
    SCORE_COIN, SCORE_STOMP_BASE, SCORE_POWERUP, SCORE_BRICK, SCORE_FLAGPOLE,
    TILES, GAME_STATES, POWER, LEVELS
} = CONSTANTS;
