// ════════════════════════════════════════════════════════════
//  INPUT
// ════════════════════════════════════════════════════════════
const keys = {};

document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
    e.preventDefault();
  }
  if ((e.code === 'Space' || e.code === 'KeyE') && state.phase === 'playing') {
    playerAttack();
  }
  if ((e.code === 'KeyF' || e.code === 'KeyX') && state.phase === 'playing') {
    fireProjectile();
  }
  if (e.code === 'KeyI') {
    toggleInventory();
  }
  if (e.code === 'Escape') {
    if (state.phase === 'inventory') closeInventory();
  }
});

document.addEventListener('keyup', e => { keys[e.code] = false; });


// ════════════════════════════════════════════════════════════
//  BUTTON LISTENERS
// ════════════════════════════════════════════════════════════
document.getElementById('restart-btn').addEventListener('click', () => {
  gameoverScreen.classList.add('hidden');
  showCharSelect();
});

document.getElementById('win-btn').addEventListener('click', () => {
  winScreen.classList.add('hidden');
  showCharSelect();
});


// ════════════════════════════════════════════════════════════
//  SCREEN MANAGEMENT
// ════════════════════════════════════════════════════════════
function showCharSelect() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('gameover-screen').classList.add('hidden');
  document.getElementById('win-screen').classList.add('hidden');
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));

  // ── Populate character card portraits with image or emoji ──
  Object.entries(CHARACTERS).forEach(([id, char]) => {
    const portraitEl = document.getElementById(`card-portrait-${id}`);
    if (!portraitEl) return;
    portraitEl.innerHTML = '';
    portraitEl.appendChild(getSpriteElement(id, char.emoji, 64));
  });

  document.getElementById('char-select-screen').classList.remove('hidden');
}


// ════════════════════════════════════════════════════════════
//  SELECT CHARACTER
// ════════════════════════════════════════════════════════════
function selectCharacter(type) {
  state.chosenCharacter = type;

  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(`card-${type}`).classList.add('selected');

  setTimeout(() => {
    document.getElementById('char-select-screen').classList.add('hidden');
    beginGame();
  }, 400);
}


// ════════════════════════════════════════════════════════════
//  GAME INITIALISATION
// ════════════════════════════════════════════════════════════
function beginGame() {
  const char = CHARACTERS[state.chosenCharacter];

  if (state.gameLoop) clearInterval(state.gameLoop);
  if (state.moveLoop) clearInterval(state.moveLoop);

  state.currentLevel = 0;
  state.player = {
    x:              0,
    y:              0,
    hp:             char.hp,
    maxHp:          char.maxHp,
    attackDamage:   char.attackDamage,
    rangedDamage:   char.rangedDamage,
    rangedCooldown: 0,
    facing:         1,
    gold:           0,
    keys:           0,
    kills:          0,
  };

  collectedEquipment.clear();
  resetInventory();
  loadLevel(0);
}


// ════════════════════════════════════════════════════════════
//  LOAD LEVEL
// ════════════════════════════════════════════════════════════
function loadLevel(levelIndex) {
  if (state.gameLoop) clearInterval(state.gameLoop);
  if (state.moveLoop) clearInterval(state.moveLoop);

  const levelData = LEVELS[levelIndex];
  state.phase = 'playing';
  state.map   = levelData.map.map(row => [...row]);

  state.player.x = levelData.playerStart.x;
  state.player.y = levelData.playerStart.y;

  state.projectiles.forEach(b => destroyProjectile(b));
  state.projectiles = [];

  state.enemies = levelData.enemies.map((cfg, index) => ({
    id:          index,
    type:        cfg.type,
    x:           cfg.x,
    y:           cfg.y,
    hp:          ENTITY_STATS[cfg.type].hp,
    maxHp:       ENTITY_STATS[cfg.type].hp,
    patrolPath:  cfg.patrolPath,
    patrolIndex: 0,
    moveTimer:   0,
    el:          null,
    hpBarEl:     null,
    alive:       true,
  }));

  showLevelSplash(levelData, () => {
    renderWorld();
    updateHUD();
    state.gameLoop = setInterval(gameStep, 100);
    state.moveLoop = setInterval(playerMoveStep, 80);
  });
}


// ════════════════════════════════════════════════════════════
//  LEVEL SPLASH SCREEN
// ════════════════════════════════════════════════════════════
function showLevelSplash(levelData, callback) {
  // ── Icon — image or emoji ──
  // Key convention: 'level_0', 'level_1', etc.
  // If no image is registered the emoji shows as before.
  const iconEl = document.getElementById('level-icon');
  iconEl.innerHTML = '';
  const splashKey = `level_${state.currentLevel}`;
  iconEl.appendChild(getSpriteElement(splashKey, levelData.icon, 64));

  document.getElementById('level-title').textContent    = levelData.name;
  document.getElementById('level-subtitle').textContent = levelData.subtitle;

  levelScreen.classList.remove('hidden');
  setTimeout(() => {
    levelScreen.classList.add('hidden');
    callback();
  }, 2000);
}


// ════════════════════════════════════════════════════════════
//  PLAYER MOVEMENT STEP
// ════════════════════════════════════════════════════════════
let playerMoveCooldown = 0;

function playerMoveStep() {
  if (state.phase !== 'playing') return;

  if (state.player.rangedCooldown > 0) state.player.rangedCooldown--;

  if (playerMoveCooldown > 0) {
    playerMoveCooldown--;
    return;
  }

  let dx = 0, dy = 0;
  if      (keys['ArrowUp']    || keys['KeyW']) dy = -1;
  else if (keys['ArrowDown']  || keys['KeyS']) dy =  1;
  else if (keys['ArrowLeft']  || keys['KeyA']) dx = -1;
  else if (keys['ArrowRight'] || keys['KeyD']) dx =  1;
  else return;

  if (dx !== 0) state.player.facing = dx;

  const nx = state.player.x + dx;
  const ny = state.player.y + dy;

  if (ny < 0 || ny >= state.map.length ||
      nx < 0 || nx >= state.map[0].length) return;

  const targetTile = state.map[ny][nx];

  if (targetTile === T.DOOR_LOCKED) {
    if (state.player.keys > 0) {
      unlockDoor(nx, ny);
    } else {
      showFloatingText('🔒 Need a key!', nx, ny, 'player-dmg');
    }
    playerMoveCooldown = 3;
    return;
  }

  if (!isWalkable(nx, ny)) return;

  const enemyOnTile = state.enemies.find(
    e => e.alive && e.x === nx && e.y === ny
  );
  if (enemyOnTile) {
    dealDamageToEnemy(enemyOnTile, state.player.attackDamage);
    playerMoveCooldown = 4;
    triggerAttackAnim();
    return;
  }

  state.player.x = nx;
  state.player.y = ny;

  const playerEl = document.getElementById('player-entity');
  if (playerEl) {
    playerEl.style.left = (nx * TILE_SIZE) + 'px';
    playerEl.style.top  = (ny * TILE_SIZE) + 'px';
  }

  checkPickup(nx, ny);

  if (state.map[ny][nx] === T.EXIT) {
    advanceLevel();
    return;
  }

  updateCamera();
  playerMoveCooldown = 3;
}


// ════════════════════════════════════════════════════════════
//  ADVANCE LEVEL
// ════════════════════════════════════════════════════════════
function advanceLevel() {
  if (state.gameLoop) clearInterval(state.gameLoop);
  if (state.moveLoop) clearInterval(state.moveLoop);

  state.currentLevel++;

  if (state.currentLevel >= LEVELS.length) {
    triggerWin();
  } else {
    gameViewport.classList.add('fade-out');
    setTimeout(() => {
      gameViewport.classList.remove('fade-out');
      gameViewport.classList.add('fade-in');
      loadLevel(state.currentLevel);
      setTimeout(() => gameViewport.classList.remove('fade-in'), 400);
    }, 400);
  }
}


// ════════════════════════════════════════════════════════════
//  GAME OVER
// ════════════════════════════════════════════════════════════
function triggerGameOver() {
  state.phase = 'dead';
  if (state.gameLoop) clearInterval(state.gameLoop);
  if (state.moveLoop) clearInterval(state.moveLoop);

  goGold.textContent  = state.player.gold;
  goKills.textContent = state.player.kills;

  setTimeout(() => {
    gameoverScreen.classList.remove('hidden');
  }, 600);
}


// ════════════════════════════════════════════════════════════
//  VICTORY
// ════════════════════════════════════════════════════════════
function triggerWin() {
  state.phase = 'win';
  if (state.gameLoop) clearInterval(state.gameLoop);
  if (state.moveLoop) clearInterval(state.moveLoop);

  winGold.textContent  = state.player.gold;
  winKills.textContent = state.player.kills;

  setTimeout(() => {
    winScreen.classList.remove('hidden');
  }, 600);
}


// ════════════════════════════════════════════════════════════
//  STARTUP
//  preloadImages() fires first — any images that exist are
//  cached into IMAGES{}. Missing files are silently skipped
//  and their emoji fallback is used instead.
// ════════════════════════════════════════════════════════════
preloadImages(() => {
  startScreen.classList.remove('hidden');
});
