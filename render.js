// ════════════════════════════════════════════════════════════
//  RENDER.JS
//  All rendering logic. Uses images where loaded,
//  falls back to emoji automatically.
// ════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════
//  SPRITE HELPERS
// ════════════════════════════════════════════════════════════

/**
 * Sets the visual content of a DOM div to either an <img>
 * or emoji text, depending on whether the image is loaded.
 *
 * @param {HTMLElement} el    - The tile/entity div to populate
 * @param {string}      key   - IMAGE_MANIFEST key
 * @param {string}      emoji - Fallback emoji string
 */
function setSprite(el, key, emoji) {
  const img = getImage(key);
  if (img) {
    el.textContent = '';
    const imgEl = document.createElement('img');
    imgEl.src    = img.src;
    imgEl.alt    = emoji;
    imgEl.style.width           = '100%';
    imgEl.style.height          = '100%';
    imgEl.style.objectFit       = 'contain';
    imgEl.style.imageRendering  = 'pixelated';
    imgEl.style.display         = 'block';
    imgEl.draggable             = false;
    el.appendChild(imgEl);
  } else {
    el.textContent = emoji;
  }
}

/**
 * Creates a standalone <img> or <span> element for use
 * in UI panels (inventory cards, HUD, etc.)
 *
 * @param {string} key    - IMAGE_MANIFEST key
 * @param {string} emoji  - Fallback emoji string
 * @param {number} sizePx - Width & height in pixels
 * @returns {HTMLElement}
 */
function getSpriteElement(key, emoji, sizePx) {
  const img = getImage(key);
  if (img) {
    const el               = document.createElement('img');
    el.src                 = img.src;
    el.alt                 = emoji;
    el.width               = sizePx;
    el.height              = sizePx;
    el.style.imageRendering = 'pixelated';
    el.style.verticalAlign  = 'middle';
    el.style.objectFit      = 'contain';
    el.draggable            = false;
    return el;
  }
  const span       = document.createElement('span');
  span.textContent = emoji;
  return span;
}


// ════════════════════════════════════════════════════════════
//  RENDER WORLD
// ════════════════════════════════════════════════════════════
function renderWorld() {
  gameWorld.innerHTML = '';

  const map  = state.map;
  const rows = map.length;
  const cols = map[0].length;

  gameWorld.style.width  = (cols * TILE_SIZE) + 'px';
  gameWorld.style.height = (rows * TILE_SIZE) + 'px';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileType = map[row][col];
      if (tileType === T.EMPTY) continue;

      const div = document.createElement('div');
      div.classList.add('tile');
      div.style.left = (col * TILE_SIZE) + 'px';
      div.style.top  = (row * TILE_SIZE) + 'px';

      switch (tileType) {

        case T.FLOOR:
          div.classList.add('tile-floor');
          setSprite(div, 'tile_floor', '');
          break;

        case T.WALL:
          div.classList.add('tile-wall');
          setSprite(div, 'tile_wall', '');
          break;

        case T.WALL_TOP:
          div.classList.add('tile-wall-top');
          setSprite(div, 'tile_wall_top', '');
          break;

        case T.DOOR_LOCKED:
          div.classList.add('tile-door-locked');
          div.dataset.row = row;
          div.dataset.col = col;
          div.id          = `door-${row}-${col}`;
          setSprite(div, 'tile_door_locked', '🔒');
          break;

        case T.DOOR_OPEN:
          div.classList.add('tile-door-open');
          setSprite(div, 'tile_door_open', '🚪');
          break;

        case T.EXIT:
          div.classList.add('tile-exit');
          div.id = `exit-${row}-${col}`;
          setSprite(div, 'tile_exit', '🔽');
          break;

        case T.TORCH: {
          // Floor underneath
          const floorUnder = document.createElement('div');
          floorUnder.classList.add('tile', 'tile-floor');
          floorUnder.style.left = (col * TILE_SIZE) + 'px';
          floorUnder.style.top  = (row * TILE_SIZE) + 'px';
          setSprite(floorUnder, 'tile_floor', '');
          gameWorld.appendChild(floorUnder);

          div.classList.add('tile-torch');
          setSprite(div, 'tile_torch', '🔦');
          break;
        }

        case T.GOLD: {
          const floorGold = document.createElement('div');
          floorGold.classList.add('tile', 'tile-floor');
          floorGold.style.left = (col * TILE_SIZE) + 'px';
          floorGold.style.top  = (row * TILE_SIZE) + 'px';
          setSprite(floorGold, 'tile_floor', '');
          gameWorld.appendChild(floorGold);

          div.classList.add('tile-gold');
          div.id = `pickup-${row}-${col}`;
          setSprite(div, 'tile_gold', '🪙');
          break;
        }

        case T.KEY: {
          const floorKey = document.createElement('div');
          floorKey.classList.add('tile', 'tile-floor');
          floorKey.style.left = (col * TILE_SIZE) + 'px';
          floorKey.style.top  = (row * TILE_SIZE) + 'px';
          setSprite(floorKey, 'tile_floor', '');
          gameWorld.appendChild(floorKey);

          div.classList.add('tile-key');
          div.id = `pickup-${row}-${col}`;
          setSprite(div, 'tile_key', '🗝️');
          break;
        }

        case T.POTION: {
          const floorPotion = document.createElement('div');
          floorPotion.classList.add('tile', 'tile-floor');
          floorPotion.style.left = (col * TILE_SIZE) + 'px';
          floorPotion.style.top  = (row * TILE_SIZE) + 'px';
          setSprite(floorPotion, 'tile_floor', '');
          gameWorld.appendChild(floorPotion);

          div.classList.add('tile-potion');
          div.id = `pickup-${row}-${col}`;
          setSprite(div, 'tile_potion', '🧪');
          break;
        }

        case T.EQUIPMENT: {
          const floorEquip = document.createElement('div');
          floorEquip.classList.add('tile', 'tile-floor');
          floorEquip.style.left = (col * TILE_SIZE) + 'px';
          floorEquip.style.top  = (row * TILE_SIZE) + 'px';
          setSprite(floorEquip, 'tile_floor', '');
          gameWorld.appendChild(floorEquip);

          // Resolve which item to show for this character class
          const levelEquip = LEVELS[state.currentLevel].equipment || [];
          const cfg    = levelEquip.find(e => e.x === col && e.y === row);
          const itemId = cfg
            ? (state.chosenCharacter === 'warrior' ? cfg.warriorId : cfg.wizardId)
            : null;
          const item = itemId ? EQUIPMENT.find(e => e.id === itemId) : null;

          div.classList.add('tile-equipment', `tier-${item ? item.tier : 'common'}`);
          div.id = `pickup-${row}-${col}`;

          // Use item's image key if available, fallback to its emoji
          setSprite(div, item ? item.id : 'tile_equipment', item ? item.emoji : '📦');
          break;
        }
      }

      gameWorld.appendChild(div);
    }
  }

  // ── Enemies ──
  state.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    spawnEnemyElement(enemy);
  });

  // ── Player ──
  const char     = CHARACTERS[state.chosenCharacter];
  const playerEl = document.createElement('div');
  playerEl.classList.add('entity-player');
  playerEl.id         = 'player-entity';
  playerEl.style.left = (state.player.x * TILE_SIZE) + 'px';
  playerEl.style.top  = (state.player.y * TILE_SIZE) + 'px';
  setSprite(playerEl, state.chosenCharacter, char.emoji);
  gameWorld.appendChild(playerEl);

  updateCamera();
}


// ════════════════════════════════════════════════════════════
//  SPAWN ENEMY ELEMENT
// ════════════════════════════════════════════════════════════
function spawnEnemyElement(enemy) {
  const stats = ENTITY_STATS[enemy.type];

  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.width    = TILE_SIZE + 'px';
  wrapper.style.height   = TILE_SIZE + 'px';
  wrapper.style.left     = (enemy.x * TILE_SIZE) + 'px';
  wrapper.style.top      = (enemy.y * TILE_SIZE) + 'px';
  wrapper.style.zIndex   = '9';

  const el = document.createElement('div');
  el.classList.add(stats.cssClass);

  // Image key convention: 'enemy_goblin', 'enemy_orc', 'enemy_boss' etc.
  setSprite(el, `enemy_${enemy.type}`, stats.emoji);

  const hpBg  = document.createElement('div');
  hpBg.classList.add('enemy-hp-bar-bg');
  const hpBar = document.createElement('div');
  hpBar.classList.add('enemy-hp-bar');
  hpBar.style.width = '100%';
  hpBg.appendChild(hpBar);

  wrapper.appendChild(hpBg);
  wrapper.appendChild(el);
  gameWorld.appendChild(wrapper);

  enemy.el      = wrapper;
  enemy.hpBarEl = hpBar;
}


// ════════════════════════════════════════════════════════════
//  CAMERA
// ════════════════════════════════════════════════════════════
function updateCamera() {
  const px = state.player.x * TILE_SIZE + TILE_SIZE / 2;
  const py = state.player.y * TILE_SIZE + TILE_SIZE / 2;

  const mapW = state.map[0].length * TILE_SIZE;
  const mapH = state.map.length    * TILE_SIZE;
  const vpW  = VIEW_TILES_X * TILE_SIZE;
  const vpH  = VIEW_TILES_Y * TILE_SIZE;

  let camX = px - vpW / 2;
  let camY = py - vpH / 2;
  camX = Math.max(0, Math.min(camX, mapW - vpW));
  camY = Math.max(0, Math.min(camY, mapH - vpH));

  gameWorld.style.transform = `translate(${-camX}px, ${-camY}px)`;
}


// ════════════════════════════════════════════════════════════
//  HUD UPDATE
// ════════════════════════════════════════════════════════════
function updateHUD() {
  const p = state.player;

  const hpText = document.getElementById('hp-text');
  if (hpText) hpText.textContent = Math.max(0, p.hp);

  const hpBar = document.getElementById('health-bar');
  if (hpBar) {
    const pct = Math.max(0, (p.hp / p.maxHp) * 100);
    hpBar.style.width = pct + '%';
    if      (pct > 60) hpBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
    else if (pct > 30) hpBar.style.background = 'linear-gradient(90deg, #f39c12, #f1c40f)';
    else               hpBar.style.background = 'linear-gradient(90deg, #c0392b, #e74c3c)';
  }

  const goldEl = document.getElementById('gold-val');
  if (goldEl) goldEl.textContent = p.gold;

  const keyEl = document.getElementById('key-val');
  if (keyEl) keyEl.textContent = p.keys;

  const killEl = document.getElementById('kill-val');
  if (killEl) killEl.textContent = p.kills;

  const atkEl = document.getElementById('atk-val');
  if (atkEl) atkEl.textContent = p.attackDamage;

  const lvlEl = document.getElementById('hud-level');
  if (lvlEl) lvlEl.textContent = state.currentLevel + 1;

  const char   = CHARACTERS[state.chosenCharacter];
  const charEl = document.getElementById('hud-character');
  if (charEl) {
    // Use image in HUD character display if available
    charEl.innerHTML = '';
    const icon = getSpriteElement(state.chosenCharacter, char.emoji, 20);
    charEl.appendChild(icon);
    const nameSpan       = document.createElement('span');
    nameSpan.textContent = ` ${char.name}`;
    nameSpan.style.color = char.colour;
    charEl.appendChild(nameSpan);
  }
}


// ════════════════════════════════════════════════════════════
//  FLOATING TEXT POPUP
// ════════════════════════════════════════════════════════════
function showFloatingText(text, tileX, tileY, type) {
  const el = document.createElement('div');
  el.classList.add('dmg-popup', type);
  el.textContent = text;
  el.style.left  = (tileX * TILE_SIZE + 4) + 'px';
  el.style.top   = (tileY * TILE_SIZE - 4) + 'px';
  gameWorld.appendChild(el);
  setTimeout(() => el.remove(), 900);
}


// ════════════════════════════════════════════════════════════
//  ATTACK ANIMATION
// ════════════════════════════════════════════════════════════
function triggerAttackAnim() {
  const playerEl = document.getElementById('player-entity');
  if (!playerEl) return;
  playerEl.classList.add('attacking');
  setTimeout(() => playerEl.classList.remove('attacking'), 260);
}
