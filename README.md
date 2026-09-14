# 🍄 Super Mario Bros. — NES Edition (2D Platformer)

A retro recreation of the classic **NES Super Mario Bros.** built from the ground up using **HTML5 Canvas**, **Vanilla JavaScript**, and **Web Audio API**. No external game engines or heavy frameworks—just pure web technologies.

![Super Mario Bros Preview](https://img.shields.io/badge/Retro-Pixel%20Art-brightgreen)
![Pure Vanilla JS](https://img.shields.io/badge/Language-Vanilla%20JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML5 Canvas](https://img.shields.io/badge/Graphics-HTML5%20Canvas-E34F26?logo=html5&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Sound-Web%20Audio%20API-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎮 Features

* **3 Recreated Worlds**:
  * **World 1-1 (Overworld)**: Classic outdoor level with warp pipes, brick & question blocks, Goombas, and Koopa Troopas.
  * **World 1-2 (Underground)**: Underground cavern palette, high block ceilings, pits, and pipe navigation.
  * **World 1-3 (Castle)**: Bowser's fiery castle, perilous lava pits, bridge collapse mechanism, axe switch, and Bowser boss battle.
* **Mario Transformations**:
  * **Small Mario**: Baseline form.
  * **Super Mario (Mushroom)**: Grows in size, breaks bricks, and absorbs one hit.
  * **Fire Mario (Fire Flower)**: Shoots bouncing fireballs to defeat enemies.
  * **Starman Mario**: Invincibility with rainbow palette cycling and invulnerability.
* **Physics & Feel**:
  * Responsive acceleration, deceleration, and skidding with ground dust particles.
  * Variable jump height depending on button hold duration.
  * Quality-of-life platforming mechanics including **coyote time** and **jump buffering**.
* **Procedural NES Audio**:
  * Real-time 8-bit sound effects (jumps, power-ups, stomps, coin pops, flagpole slide, death) synthesized using the browser's native **Web Audio API**.
  * Chiptune background melodies for Overworld, Underground, Castle, and Star power modes.
* **Mobile & Touch Friendly**:
  * On-screen arcade touch controls for mobile devices with multi-touch support.
  * Fullscreen toggle and audio mute controls.

---

## 🕹️ Controls

| Action | Primary Keys | Secondary Keys | Touch Controls |
| :--- | :--- | :--- | :--- |
| **Move Left** | `◀ Left Arrow` | `A` | Left Button |
| **Move Right** | `▶ Right Arrow` | `D` | Right Button |
| **Crouch** | `▼ Down Arrow` | `S` | — |
| **Jump** | `Space` / `▲ Up Arrow` | `W` / `J` | **A** Button |
| **Sprint / Shoot Fire** | `Left Shift` | `Z` / `X` / `K` | **B** Button |
| **Pause / Resume** | `P` | `Escape` | — |
| **Quick Level Select** | `1`, `2`, `3` *(on title screen)* | — | Card Buttons |
| **Fire Flower Cheat** | `F` | — | — |

---

## 🚀 Getting Started

Since the project is built with vanilla HTML, CSS, and JavaScript, no build steps, bundlers, or package installations are required!

### Option 1: Direct File Open
Simply double-click [`index.html`](index.html) to launch the game in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run with a Local Web Server
For the best experience (ensuring no local file origin audio policy restrictions):

```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js (npx)
npx serve .
```

Then open your browser to `http://localhost:8000`.

---

## 📁 Project Structure

```text
├── index.html           # Main game markup, HUD overlays, title and menu screens
├── css/
│   └── style.css        # NES arcade styling, responsive canvas layout, CRT effects
├── js/
│   ├── constants.js     # Physics constants, tile IDs, score values, and game states
│   ├── input.js         # Keyboard listener, state latching, and touch mapping
│   ├── sprites.js       # Procedural canvas sprite generation (Mario, enemies, tiles)
│   ├── audio.js         # Web Audio API 8-bit oscillator synthesizer & music sequences
│   ├── particles.js     # Dust, coin popups, brick debris, and firework effects
│   ├── blocks.js        # Block bounce physics and collision handling
│   ├── items.js         # Power-ups (Mushrooms, Fire Flowers, Stars) & Fireballs
│   ├── enemies.js       # Goomba, Koopa, Piranha Plant, and Bowser AI behaviors
│   ├── player.js        # Mario state machine, physics, bounding box, and animations
│   ├── level1.js        # Level 1-1 layout & enemy spawn definitions
│   ├── level2.js        # Level 1-2 layout & enemy spawn definitions
│   ├── level3.js        # Level 1-3 layout & Bowser bridge spawn definitions
│   ├── level.js         # Tilemap renderer, solid collision checks, and parallax
│   ├── ui.js            # HUD manager and screen transitions
│   └── game.js          # Core game loop, state management, and collision dispatch
└── levels/              # Standalone level maps
```

---

## 📜 Credits & License

* Inspired by Nintendo's legendary **Super Mario Bros.** (1985). All Mario characters and likenesses are trademarks of Nintendo.
* Code recreation released under the [MIT License](LICENSE).
