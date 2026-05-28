// ════════════════════════════════════════════════════════════
//  DUNGEON CRAWLER — game.js
//  Pure HTML/CSS top-down D&D dungeon crawler.
//  3 levels, each with unique layout, enemies, and pickups.
// ════════════════════════════════════════════════════════════

// ── Tile size in pixels (matches CSS .tile width/height) ──
const TILE_SIZE = 32;

// ── Viewport tile dimensions (must match CSS #game-viewport) ──
const VIEW_TILES_X = 20;   // 20 tiles wide  = 640px
const VIEW_TILES_Y = 18;   // 18 tiles tall  = 576px

// ════════════════════════════════════════════════════════════
//  TILE TYPE CONSTANTS
// ════════════════════════════════════════════════════════════
const T = {
  EMPTY:       0,
  FLOOR:       1,
  WALL:        2,
  WALL_TOP:    3,
  DOOR_LOCKED: 4,
  DOOR_OPEN:   5,
  EXIT:        6,
  TORCH:       7,
  GOLD:        8,
  KEY:         9,
  POTION:      10,
  EQUIPMENT:   11,
};

// ════════════════════════════════════════════════════════════
//  PLAYABLE CHARACTERS
// ════════════════════════════════════════════════════════════
const CHARACTERS = {
  wizard: {
    name:         'Wizard',
    emoji:        '🧙',
    attackDamage: 10,
    rangedDamage: 25,
    hp:           40,
    maxHp:        40,
    speed:        1,
    description:  'Fragile but deadly at range. Fires powerful magic bolts.',
    colour:       '#c084fc',
  },
  warrior: {
    name:         'Warrior',
    emoji:        '⚔️',
    attackDamage: 20,
    rangedDamage: 0,
    hp:           120,
    maxHp:        120,
    speed:        1,
    description:  'Tough and hard-hitting in melee. Cannot fire projectiles.',
    colour:       '#f97316',
  },
};

// ════════════════════════════════════════════════════════════
//  LEVEL DEFINITIONS
// ════════════════════════════════════════════════════════════
const LEVELS = [  

  // ══════════════════════════════════════
  //  LEVEL 1 — The Entrance Hall
  // ══════════════════════════════════════
  {
    name: 'LEVEL 1',
    icon: '🏰',
    subtitle: 'The Entrance Hall',
    playerStart: { x: 2, y: 2 },
    map: [
      // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 7, 1, 1, 8, 1, 1, 1, 8, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 1, 1, 1, 1, 9, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 8, 1, 1, 1,10, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 2 ],
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
    ],
    enemies: [
      { type: 'skeleton', x: 4,  y: 4,  patrolPath: [{ x:2, y:4  }, { x:8, y:4  }] },
      { type: 'skeleton', x: 3,  y: 11, patrolPath: [{ x:2, y:11 }, { x:8, y:11 }] },
      { type: 'skeleton', x: 16, y: 10, patrolPath: [{ x:13,y:10 }, { x:21,y:10 }] },
      { type: 'skeleton', x: 18, y: 14, patrolPath: [{ x:13,y:14 }, { x:21,y:14 }] },
    ],
  },

  // ══════════════════════════════════════
  //  LEVEL 2 — The Orc Barracks
  // ══════════════════════════════════════
  {
    name: 'LEVEL 2',
    icon: '⚔️',
    subtitle: 'The Orc Barracks',
    playerStart: { x: 2, y: 2 },
    map: [
      // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 1, 7, 2, 2, 7, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2 ],
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,10, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 1, 2, 8, 2, 2, 2, 1, 1, 8, 1, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 2 ],
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
    ],
    enemies: [
      { type: 'orc', x: 3,  y: 4,  patrolPath: [{ x:2,  y:4  }, { x:9,  y:4  }] },
      { type: 'orc', x: 16, y: 4,  patrolPath: [{ x:14, y:4  }, { x:23, y:4  }] },
      { type: 'orc', x: 5,  y: 11, patrolPath: [{ x:2,  y:11 }, { x:9,  y:11 }] },
      { type: 'orc', x: 18, y: 11, patrolPath: [{ x:15, y:11 }, { x:23, y:11 }] },
      { type: 'orc', x: 5,  y: 17, patrolPath: [{ x:2,  y:17 }, { x:8,  y:17 }] },
      { type: 'orc', x: 20, y: 17, patrolPath: [{ x:16, y:17 }, { x:23, y:17 }] },
      { type: 'orc', x: 11, y: 16, patrolPath: [{ x:11, y:14 }, { x:11, y:19 }] },
    ],
  },

  // ══════════════════════════════════════
  //  LEVEL 3 — The Demon's Sanctum
  // ══════════════════════════════════════
  {
    name: 'LEVEL 3',
    icon: '🔥',
    subtitle: "The Demon's Sanctum",
    playerStart: { x: 2, y: 2 },
    map: [
      // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 7, 2, 2, 2, 2, 2, 2, 2, 7, 1, 1, 9, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2 ],
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 9, 1, 1, 1, 1, 1, 1, 4, 1, 7, 1, 1, 7, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 8, 1, 1,10, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 8, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 7, 2, 2, 2, 2, 2, 2, 2, 2, 7, 1, 1, 1, 1, 1, 1, 6, 7, 2 ],
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
    ],
    enemies: [
      { type: 'demon', x: 4,  y: 4,  patrolPath: [{ x:2,  y:4  }, { x:8,  y:4  }] },
      { type: 'demon', x: 20, y: 4,  patrolPath: [{ x:18, y:4  }, { x:25, y:4  }] },
      { type: 'demon', x: 4,  y: 12, patrolPath: [{ x:2,  y:12 }, { x:8,  y:12 }] },
      { type: 'demon', x: 20, y: 12, patrolPath: [{ x:19, y:12 }, { x:25, y:12 }] },
      { type: 'demon', x: 13, y: 12, patrolPath: [{ x:11, y:12 }, { x:16, y:12 }] },
      { type: 'demon', x: 13, y: 15, patrolPath: [{ x:11, y:15 }, { x:16, y:15 }] },
      { type: 'demon', x: 4,  y: 21, patrolPath: [{ x:2,  y:21 }, { x:8,  y:21 }] },
      { type: 'demon', x: 22, y: 21, patrolPath: [{ x:19, y:21 }, { x:25, y:21 }] },
    ],
  },
];

// ════════════════════════════════════════════════════════════
//  ENTITY STATS
// ════════════════════════════════════════════════════════════
const ENTITY_STATS = {
  player: {
    hp:           100,
    maxHp:        100,
    attackDamage: 35,
    attackRange:  1,
  },
  skeleton: {
    hp:          40,
    attackDamage: 10,
    speed:        600,
    goldReward:   15,
    emoji:        '💀',
    cssClass:     'entity-enemy-skeleton',
  },
  orc: {
    hp:           70,
    attackDamage: 18,
    speed:        800,
    goldReward:   25,
    emoji:        '👹',
    cssClass:     'entity-enemy-orc',
  },
  demon: {
    hp:           100,
    attackDamage: 28,
    speed:        700,
    goldReward:   40,
    emoji:        '😈',
    cssClass:     'entity-enemy-demon',
  },
};

// ════════════════════════════════════════════════════════════
//  PICKUP VALUES
// ════════════════════════════════════════════════════════════
const PICKUP_VALUES = {
  gold:   10,
  potion: 30,
};

// ════════════════════════════════════════════════════════════
//  EQUIPMENT DEFINITIONS
// ════════════════════════════════════════════════════════════
const EQUIPMENT = [
  {
    id:          'wand_oak',
    emoji:       '🪄',
    name:        'Oak Wand',
    tier:        'common',
    atkBonus:    10,
    rangedBonus: 15,
    description: '+10 ATK  +15 Ranged',
  },
  {
    id:          'wand_silver',
    emoji:       '✨',
    name:        'Silver Wand',
    tier:        'rare',
    atkBonus:    20,
    rangedBonus: 25,
    description: '+20 ATK  +25 Ranged',
  },
  {
    id:          'staff_arcane',
    emoji:       '🔮',
    name:        'Arcane Staff',
    tier:        'epic',
    atkBonus:    35,
    rangedBonus: 45,
    description: '+35 ATK  +45 Ranged',
  },
];

const collectedEquipment = new Set();

// ════════════════════════════════════════════════════════════
//  GAME STATE
// ════════════════════════════════════════════════════════════
let state = {
  currentLevel:    0,
  chosenCharacter: 'wizard',
  player: {
    x:             0,
    y:             0,
    hp:            80,
    maxHp:         80,
    gold:          0,
    keys:          0,
    kills:         0,
    attackDamage:  10,
    rangedDamage:  25,
    rangedCooldown: 0,
    facing:        1,
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

const hudLevel  = document.getElementById('hud-level');
const hudHp     = document.getElementById('hp-text');
const hudHpBar  = document.getElementById('health-bar');
const hudGold   = document.getElementById('gold-val');
const hudKeys   = document.getElementById('key-val');
const hudKills  = document.getElementById('kill-val');

const goGold    = document.getElementById('go-gold');
const goKills   = document.getElementById('go-kills');
const winGold   = document.getElementById('win-gold');
const winKills  = document.getElementById('win-kills');

// ════════════════════════════════════════════════════════════
//  INPUT HANDLING
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
  console.log('showCharSelect called from:', new Error().stack);
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('gameover-screen').classList.add('hidden');
  document.getElementById('win-screen').classList.add('hidden');
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('char-select-screen').classList.remove('hidden');
}

// ════════════════════════════════════════════════════════════
//  SELECT CHARACTER
// ════════════════════════════════════════════════════════════
function selectCharacter(type) {
  console.log('selectCharacter called with:', type);
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

  // Clear in-flight projectiles
  state.projectiles.forEach(b => destroyProjectile(b));
  state.projectiles = [];

  // Build enemy objects
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
  document.getElementById('level-icon').textContent     = levelData.icon;
  document.getElementById('level-title').textContent    = levelData.name;
  document.getElementById('level-subtitle').textContent = levelData.subtitle;
  levelScreen.classList.remove('hidden');
  setTimeout(() => {
    levelScreen.classList.add('hidden');
    callback();
  }, 2000);
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
          break;
        case T.WALL:
          div.classList.add('tile-wall');
          break;
        case T.WALL_TOP:
          div.classList.add('tile-wall-top');
          break;
        case T.DOOR_LOCKED:
          div.classList.add('tile-door-locked');
          div.textContent  = '🔒';
          div.dataset.row  = row;
          div.dataset.col  = col;
          div.id           = `door-${row}-${col}`;
          break;
        case T.DOOR_OPEN:
          div.classList.add('tile-door-open');
          div.textContent = '🚪';
          break;
        case T.EXIT:
          div.classList.add('tile-exit');
          div.textContent = '🔽';
          div.id          = `exit-${row}-${col}`;
          break;
        case T.TORCH: {
          const floorUnder = document.createElement('div');
          floorUnder.classList.add('tile', 'tile-floor');
          floorUnder.style.left = (col * TILE_SIZE) + 'px';
          floorUnder.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorUnder);
          div.classList.add('tile-torch');
          div.textContent = '🔦';
          break;
        }
        case T.GOLD: {
          const floorGold = document.createElement('div');
          floorGold.classList.add('tile', 'tile-floor');
          floorGold.style.left = (col * TILE_SIZE) + 'px';
          floorGold.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorGold);
          div.classList.add('tile-gold');
          div.textContent = '🪙';
          div.id          = `pickup-${row}-${col}`;
          break;
        }
        case T.KEY: {
          const floorKey = document.createElement('div');
          floorKey.classList.add('tile', 'tile-floor');
          floorKey.style.left = (col * TILE_SIZE) + 'px';
          floorKey.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorKey);
          div.classList.add('tile-key');
          div.textContent = '🗝️';
          div.id          = `pickup-${row}-${col}`;
          break;
        }
        case T.POTION: {
          const floorPotion = document.createElement('div');
          floorPotion.classList.add('tile', 'tile-floor');
          floorPotion.style.left = (col * TILE_SIZE) + 'px';
          floorPotion.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorPotion);
          div.classList.add('tile-potion');
          div.textContent = '🧪';
          div.id          = `pickup-${row}-${col}`;
          break;
        }
      }

      gameWorld.appendChild(div);
    }
  }

  // Render enemies
  state.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    spawnEnemyElement(enemy);
  });

  // Render player
  const playerEl = document.createElement('div');
  playerEl.classList.add('entity-player');
  playerEl.id          = 'player-entity';
  playerEl.textContent = CHARACTERS[state.chosenCharacter].emoji;
  playerEl.style.left  = (state.player.x * TILE_SIZE) + 'px';
  playerEl.style.top   = (state.player.y * TILE_SIZE) + 'px';
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
  el.textContent = stats.emoji;

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

  const char    = CHARACTERS[state.chosenCharacter];
  const charEl  = document.getElementById('hud-character');
  if (charEl) {
    charEl.textContent = `${char.emoji} ${char.name}`;
    charEl.style.color = char.colour;
  }
}

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

  let boltX = state.player.x + dir;
  let boltY = state.player.y;

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

  // Update enemy HP bar
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
//  Opens locked doors once all enemies are defeated.
// ════════════════════════════════════════════════════════════
function checkLevelClear() {
  const allDead = state.enemies.every(e => !e.alive);
  if (!allDead) return;

  // Convert all locked doors to open doors
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

    // Patrol movement
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
//  ATTACK ANIMATION
// ════════════════════════════════════════════════════════════
function triggerAttackAnim() {
  const playerEl = document.getElementById('player-entity');
  if (!playerEl) return;
  playerEl.classList.add('attacking');
  setTimeout(() => playerEl.classList.remove('attacking'), 260);
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
// ════════════════════════════════════════════════════════════
startScreen.classList.remove('hidden');

