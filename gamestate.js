// ════════════════════════════════════════════════════════════
//  GAME STATE
// ════════════════════════════════════════════════════════════
let state = {
  currentLevel:    0,
  chosenCharacter: 'wizard',
  player: {
    x:              0,
    y:              0,
    hp:             80,
    maxHp:          80,
    gold:           0,
    keys:           0,
    kills:          0,
    attackDamage:   10,
    rangedDamage:   25,
    rangedCooldown: 0,
    facing:         1,
  },
  map:         [],
  enemies:     [],
  projectiles: [],
  gameLoop:    null,
  moveLoop:    null,
  phase:       'start',
};

// ════════════════════════════════════════════════════════════
//  DOM REFERENCES
// ════════════════════════════════════════════════════════════
const gameWorld      = document.getElementById('game-world');
const gameViewport   = document.getElementById('game-viewport');
const startScreen    = document.getElementById('start-screen');
const levelScreen    = document.getElementById('level-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const winScreen      = document.getElementById('win-screen');

const goGold   = document.getElementById('go-gold');
const goKills  = document.getElementById('go-kills');
const winGold  = document.getElementById('win-gold');
const winKills = document.getElementById('win-kills');
