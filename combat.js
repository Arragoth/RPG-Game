// ════════════════════════════════════════════════════════════
//  WALKABILITY CHECK
// ════════════════════════════════════════════════════════════
function isWalkable(x, y) {
  const map = state.map;
  if (y < 0 || y >= map.length)    return false;
  if (x < 0 || x >= map[0].length) return false;

  const t = map[y][x];
  return t === T.FLOOR     ||
         t === T.WALL_TOP  ||
         t === T.TORCH     ||
         t === T.GOLD      ||
         t === T.KEY       ||
         t === T.POTION    ||
         t === T.EQUIPMENT ||
         t === T.EXIT      ||
         t === T.DOOR_OPEN;
}

// ════════════════════════════════════════════════════════════
//  PLAYER ATTACK (SPACE / E)
// ════════════════════════════════════════════════════════════
function playerAttack() {
  if (state.phase !== 'playing') return;

  const px = state.player.x;
  const py = state.player.y;

  const adjacent = [
    { x: px,   y: py-1 },
    { x: px,   y: py+1 },
    { x: px-1, y: py   },
    { x: px+1, y: py   },
  ];

  let hit = false;
  adjacent.forEach(pos => {
    const enemy = state.enemies.find(
      e => e.alive && e.x === pos.x && e.y === pos.y
    );
    if (enemy) {
      dealDamageToEnemy(enemy, state.player.attackDamage);
      hit = true;
    }
  });

  triggerAttackAnim();
  if (!hit) showFloatingText('miss', px, py, 'player-dmg');
}

// ════════════════════════════════════════════════════════════
//  FIRE PROJECTILE
// ════════════════════════════════════════════════════════════
const PROJECTILE_SPEED = 80;

function fireProjectile() {
  if (CHARACTERS[state.chosenCharacter].rangedDamage === 0) return;
  if (state.player.rangedCooldown > 0) return;
  if (state.phase !== 'playing') return;

  const dir  = state.player.facing;
  const HALF = Math.floor(TILE_SIZE / 2);

  const boltX = state.player.x + dir;
  const boltY = state.player.y;

  if (!isWalkable(boltX, boltY)) return;

  const el = document.createElement('div');
  el.classList.add('projectile');
  el.style.left = (boltX * TILE_SIZE + HALF - 5) + 'px';
  el.style.top  = (boltY * TILE_SIZE + HALF - 5) + 'px';
  gameWorld.appendChild(el);

  const bolt = {
    x:      boltX,
    y:      boltY,
    dir:    dir,
    damage: state.player.rangedDamage,
    el:     el,
    alive:  true,
    timer:  null,
  };

  state.projectiles.push(bolt);

  const immediateHit = state.enemies.find(
    e => e.alive && e.x === boltX && e.y === boltY
  );
  if (immediateHit) {
    dealDamageToEnemy(immediateHit, bolt.damage);
    destroyProjectile(bolt);
    state.player.rangedCooldown = 5;
    return;
  }

  bolt.timer = setInterval(() => {
    if (!bolt.alive) { clearInterval(bolt.timer); return; }

    const nx = bolt.x + bolt.dir;
    const ny = bolt.y;

    if (ny < 0 || ny >= state.map.length ||
        nx < 0 || nx >= state.map[0].length) {
      destroyProjectile(bolt);
      return;
    }

    if (!isWalkable(nx, ny)) {
      destroyProjectile(bolt);
      return;
    }

    const hitEnemy = state.enemies.find(
      e => e.alive && e.x === nx && e.y === ny
    );
    if (hitEnemy) {
      bolt.el.style.left = (nx * TILE_SIZE + HALF - 5) + 'px';
      dealDamageToEnemy(hitEnemy, bolt.damage);
      destroyProjectile(bolt);
      return;
    }

    bolt.x = nx;
    bolt.el.style.left = (nx * TILE_SIZE + HALF - 5) + 'px';

  }, PROJECTILE_SPEED);

  state.player.rangedCooldown = 5;
}

// ════════════════════════════════════════════════════════════
//  DESTROY PROJECTILE
// ════════════════════════════════════════════════════════════
function destroyProjectile(bolt) {
  bolt.alive = false;
  clearInterval(bolt.timer);
  if (bolt.el) {
    bolt.el.style.transition = 'opacity 0.12s, transform 0.12s';
    bolt.el.style.opacity    = '0';
    bolt.el.style.transform  = 'scale(3)';
    setTimeout(() => { if (bolt.el) bolt.el.remove(); }, 120);
  }
  state.projectiles = state.projectiles.filter(b => b !== bolt);
}

// ════════════════════════════════════════════════════════════
//  DEAL DAMAGE TO ENEMY
// ════════════════════════════════════════════════════════════
function dealDamageToEnemy(enemy, damage) {
  const dmg = (typeof damage === 'number' && !isNaN(damage)) ? damage : 1;

  enemy.hp -= dmg;
  showFloatingText(`-${dmg}`, enemy.x, enemy.y, 'enemy-dmg');

  if (enemy.hpBarEl) {
    const pct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
    enemy.hpBarEl.style.width = pct + '%';
  }

  if (enemy.hp <= 0) {
    enemy.alive = false;
    state.player.kills++;
    state.player.gold += ENTITY_STATS[enemy.type].goldReward;
    updateHUD();

    if (enemy.el) {
      enemy.el.style.transition = 'opacity 0.3s, transform 0.3s';
      enemy.el.style.opacity    = '0';
      enemy.el.style.transform  = 'scale(1.5)';
      setTimeout(() => { if (enemy.el) enemy.el.remove(); }, 300);
    }

    showFloatingText(
      `+${ENTITY_STATS[enemy.type].goldReward}🪙`,
      enemy.x, enemy.y, 'enemy-dmg'
    );

    checkLevelClear();
  }
}

// ════════════════════════════════════════════════════════════
//  CHECK LEVEL CLEAR
// ════════════════════════════════════════════════════════════
function checkLevelClear() {
  const allDead = state.enemies.every(e => !e.alive);
  if (!allDead) return;

  for (let row = 0; row < state.map.length; row++) {
    for (let col = 0; col < state.map[row].length; col++) {
      if (state.map[row][col] === T.DOOR_LOCKED) {
        state.map[row][col] = T.DOOR_OPEN;
        const doorEl = document.getElementById(`door-${row}-${col}`);
        if (doorEl) {
          doorEl.className   = 'tile tile-door-open';
          doorEl.textContent = '🚪';
        }
      }
    }
  }

  showFloatingText('✅ All clear!', state.player.x, state.player.y, 'enemy-dmg');
}

// ════════════════════════════════════════════════════════════
//  PICKUP COLLECTION
// ════════════════════════════════════════════════════════════
function checkPickup(x, y) {
  const tile = state.map[y][x];

  if (tile === T.GOLD) {
    state.player.gold += PICKUP_VALUES.gold;
    showFloatingText(`+${PICKUP_VALUES.gold}🪙`, x, y, 'enemy-dmg');
    removeTilePickup(x, y);
  }
  else if (tile === T.KEY) {
    state.player.keys++;
    showFloatingText('🗝️ Key!', x, y, 'enemy-dmg');
    removeTilePickup(x, y);
  }
  else if (tile === T.POTION) {
    const heal = PICKUP_VALUES.potion;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
    showFloatingText(`+${heal}❤️`, x, y, 'enemy-dmg');
    removeTilePickup(x, y);
  }
    else if (tile === T.EQUIPMENT) {
    const levelEquip = LEVELS[state.currentLevel].equipment || [];
    const cfg    = levelEquip.find(e => e.x === x && e.y === y);
    const itemId = cfg
      ? (state.chosenCharacter === 'warrior' ? cfg.warriorId : cfg.wizardId)
      : null;

    if (itemId && !collectedEquipment.has(itemId)) {
      collectedEquipment.add(itemId);
      inventoryAddItem(itemId);        // ← routes through inventory.js
      removeTilePickup(x, y);
    }
  }


  updateHUD();
}

function removeTilePickup(x, y) {
  state.map[y][x] = T.FLOOR;
  const el = document.getElementById(`pickup-${y}-${x}`);
  if (el) el.remove();
}

// ════════════════════════════════════════════════════════════
//  UNLOCK DOOR
// ════════════════════════════════════════════════════════════
function unlockDoor(x, y) {
  state.player.keys--;
  state.map[y][x] = T.FLOOR;

  const doorEl = document.getElementById(`door-${y}-${x}`);
  if (doorEl) {
    doorEl.className   = 'tile tile-door-open';
    doorEl.textContent = '🚪';
    setTimeout(() => {
      doorEl.className   = 'tile tile-floor';
      doorEl.textContent = '';
    }, 600);
  }

  showFloatingText('🔓 Unlocked!', x, y, 'enemy-dmg');
  updateHUD();
}

// ════════════════════════════════════════════════════════════
//  ENEMY AI — GAME STEP
// ════════════════════════════════════════════════════════════
function gameStep() {
  if (state.phase !== 'playing') return;

  state.enemies.forEach(enemy => {
    if (!enemy.alive) return;

    const stats = ENTITY_STATS[enemy.type];

    enemy.moveTimer += 100;
    if (enemy.moveTimer < stats.speed) return;
    enemy.moveTimer = 0;

    const dx = Math.abs(enemy.x - state.player.x);
    const dy = Math.abs(enemy.y - state.player.y);

    if (dx + dy === 1) {
      state.player.hp -= stats.attackDamage;
      showFloatingText(
        `-${stats.attackDamage}`,
        state.player.x, state.player.y, 'player-dmg'
      );
      updateHUD();
      if (state.player.hp <= 0) {
        triggerGameOver();
        return;
      }
      return;
    }

    const target = enemy.patrolPath[enemy.patrolIndex];
    let moveX = 0, moveY = 0;

    if      (enemy.x < target.x) moveX =  1;
    else if (enemy.x > target.x) moveX = -1;
    else if (enemy.y < target.y) moveY =  1;
    else if (enemy.y > target.y) moveY = -1;
    else {
      enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPath.length;
      return;
    }

    const nx = enemy.x + moveX;
    const ny = enemy.y + moveY;

    if (!isWalkable(nx, ny)) return;

    const blocked = state.enemies.some(
      e => e.alive && e !== enemy && e.x === nx && e.y === ny
    );
    if (blocked) return;
    if (nx === state.player.x && ny === state.player.y) return;

    enemy.x = nx;
    enemy.y = ny;

    if (enemy.el) {
      enemy.el.style.left = (nx * TILE_SIZE) + 'px';
      enemy.el.style.top  = (ny * TILE_SIZE) + 'px';
    }
  });
}
