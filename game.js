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
//  These numbers are used in the level maps below.
//  Change what each number means here if you redesign levels.
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
  EQUIPMENT:   11,   // ← NEW: equipment pickup tile
};


// ════════════════════════════════════════════════════════════
//  LEVEL DEFINITIONS
//  ────────────────────────────────────────────────────────
//  Each level has:
//    name        — display name on splash screen
//    icon        — emoji for splash screen
//    subtitle    — flavour text
//    map         — 2D array of tile type numbers (T.*)
//                  Each row = one row of tiles top-to-bottom.
//                  Each column = one tile left-to-right.
//    enemies     — array of enemy spawn configs
//    playerStart — { x, y } tile coordinates for player spawn
//
//  MAP KEY:
//    0 = empty/void   1 = floor        2 = wall
//    3 = wall top     4 = locked door  5 = open door
//    6 = exit         7 = torch        8 = gold coin
//    9 = key         10 = potion
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
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 0  outer wall
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 1  top room floor
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 2
      [  2, 7, 1, 1, 8, 1, 1, 1, 8, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 3  torches + coins
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 4
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 5
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 6  corridor at col 5
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 7  corridor continues
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 8  wide room top floor
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 9
      [  2, 7, 1, 1, 1, 1, 1, 1, 9, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ], // row 10 key at col 8
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 8, 1, 1, 1,10, 1, 1, 1, 1, 2 ], // row 11 coin+potion
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 12 locked door 10-11
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 13
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ], // row 14 torches + coin
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 15
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 16
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 17
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 2 ], // row 18 exit at col 22
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 19 outer wall
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
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 0  outer wall
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 1  two top rooms
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 2
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 1, 7, 2, 2, 7, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 7, 2 ], // row 3  key at col 17
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 4
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 5  locked door 11-12
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 6
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2 ], // row 7  corridors col 5 + 20
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2 ], // row 8
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 9  large central room
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 10
      [  2, 7, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ], // row 11 key at col 3
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 12
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 13 inner wall segment
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,10, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 14 potion at col 11
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 15 locked doors 10+12
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 16
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 1, 2, 8, 2, 2, 2, 1, 1, 8, 1, 1, 1, 1, 1, 1, 7, 2 ], // row 17 coins
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 18
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 19
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 2 ], // row 20 exit at col 24
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 21 outer wall
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
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 0  outer wall
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 1  two top rooms
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 2
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 7, 2, 2, 2, 2, 2, 2, 2, 7, 1, 1, 9, 1, 1, 1, 1, 1, 7, 2 ], // row 3  key at col 20
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 4
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 5  open corridor
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 6
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2 ], // row 7  corridors col 5+21
      [  2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2 ], // row 8
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 9  large mid room
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 10
      [  2, 7, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ], // row 11 boss chamber walls
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 12
      [  2, 1, 1, 9, 1, 1, 1, 1, 1, 1, 4, 1, 7, 1, 1, 7, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 13 boss doors + key col 3
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 14
      [  2, 7, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2 ], // row 15
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 16
      [  2, 1, 1, 8, 1, 1,10, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 8, 1, 1, 1, 1, 1, 2 ], // row 17 coins + potion
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 18 open corridor
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 19
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 20
      [  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ], // row 21
      [  2, 7, 1, 1, 8, 1, 1, 1, 1, 7, 2, 2, 2, 2, 2, 2, 2, 2, 7, 1, 1, 1, 1, 1, 1, 6, 7, 2 ], // row 22 exit at col 25
      [  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], // row 23 outer wall
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
//  Adjust HP, damage, speed, and XP reward per enemy type here.
// ════════════════════════════════════════════════════════════
const ENTITY_STATS = {
  player: {
    hp: 100,
    maxHp: 100,
    attackDamage: 35,      // damage dealt per attack
    attackRange: 1,        // tiles reach (1 = adjacent only)
  },
  skeleton: {
    hp: 40,
    attackDamage: 10,
    speed: 600,            // ms between moves (lower = faster)
    goldReward: 15,
    emoji: '💀',
    cssClass: 'entity-enemy-skeleton',
  },
  orc: {
    hp: 70,
    attackDamage: 18,
    speed: 800,
    goldReward: 25,
    emoji: '👹',
    cssClass: 'entity-enemy-orc',
  },
  demon: {
    hp: 100,
    attackDamage: 28,
    speed: 700,
    goldReward: 40,
    emoji: '😈',
    cssClass: 'entity-enemy-demon',
  },
};

// ════════════════════════════════════════════════════════════
//  PICKUP VALUES
//  Change gold coin value and potion heal amount here.
// ════════════════════════════════════════════════════════════
const PICKUP_VALUES = {
  gold:   10,   // gold gained per coin
  potion: 30,   // HP restored per potion
};

// ════════════════════════════════════════════════════════════
//  GAME STATE
// ════════════════════════════════════════════════════════════
let state = {
  currentLevel: 0,
  player: {
    x: 0, y: 0,
    hp: ENTITY_STATS.player.hp,
    maxHp: ENTITY_STATS.player.maxHp,
    gold: 0,
    keys: 0,
    kills: 0,
  },
  map: [],
  enemies: [],
  gameLoop: null,
  phase: 'start',   // 'start' | 'playing' | 'dead' | 'win'
};

// ════════════════════════════════════════════════════════════
//  EQUIPMENT DEFINITIONS
//  Each entry defines a wand / staff upgrade.
//  ── TO ADD NEW ITEMS ──
//    Add a new object to this array.
//    tier:       'common' | 'rare' | 'epic'  (controls glow colour)
//    emoji:      the icon shown on the tile and in tooltip
//    name:       display name in the pickup tooltip
//    atkBonus:   flat damage added to player's attackDamage
//    rangedBonus: flat damage added to player's rangedDamage
// ════════════════════════════════════════════════════════════
const EQUIPMENT = [
  {
    id: 'wand_oak',
    emoji: '🪄',
    name: 'Oak Wand',
    tier: 'common',
    atkBonus: 10,
    rangedBonus: 15,
    description: '+10 ATK  +15 Ranged',
  },
  {
    id: 'wand_silver',
    emoji: '✨',
    name: 'Silver Wand',
    tier: 'rare',
    atkBonus: 20,
    rangedBonus: 25,
    description: '+20 ATK  +25 Ranged',
  },
  {
    id: 'staff_arcane',
    emoji: '🔮',
    name: 'Arcane Staff',
    tier: 'epic',
    atkBonus: 35,
    rangedBonus: 45,
    description: '+35 ATK  +45 Ranged',
  },
];

// ── Track which equipment the player has collected ──
// Prevents picking up the same item twice on replay
const collectedEquipment = new Set();

// ════════════════════════════════════════════════════════════
//  DOM REFERENCES
// ════════════════════════════════════════════════════════════
const gameWorld      = document.getElementById('game-world');
const gameViewport   = document.getElementById('game-viewport');
const startScreen    = document.getElementById('start-screen');
const levelScreen    = document.getElementById('level-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const winScreen      = document.getElementById('win-screen');

// HUD elements
const hudLevel  = document.getElementById('hud-level');
const hudHp     = document.getElementById('hp-text');
const hudHpBar  = document.getElementById('health-bar');
const hudGold   = document.getElementById('gold-val');
const hudKeys   = document.getElementById('key-val');
const hudKills  = document.getElementById('kill-val');

// Screen result elements
const goGold    = document.getElementById('go-gold');
const goKills   = document.getElementById('go-kills');
const winGold   = document.getElementById('win-gold');
const winKills  = document.getElementById('win-kills');

// ════════════════════════════════════════════════════════════
//  INPUT HANDLING
//  Tracks which keys are currently held down.
// ════════════════════════════════════════════════════════════
const keys = {};

document.addEventListener('keydown', e => {
  keys[e.code] = true;
  // Prevent page scroll on arrow keys and space
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
    e.preventDefault();
  }
  // Attack on keydown (not held — one press = one attack)
  if ((e.code === 'Space' || e.code === 'KeyE') && state.phase === 'playing') {
    playerAttack();
  }
});

document.addEventListener('keyup', e => { keys[e.code] = false; });

// ════════════════════════════════════════════════════════════
//  BUTTON LISTENERS
// ════════════════════════════════════════════════════════════
document.getElementById('start-btn').addEventListener('click', () => {
  startScreen.classList.add('hidden');
  beginGame();
});

document.getElementById('restart-btn').addEventListener('click', () => {
  gameoverScreen.classList.add('hidden');
  beginGame();
});

document.getElementById('win-btn').addEventListener('click', () => {
  winScreen.classList.add('hidden');
  beginGame();
});

// ════════════════════════════════════════════════════════════
//  GAME INITIALISATION
// ════════════════════════════════════════════════════════════
function beginGame() {
  // Reset all player stats for a fresh run
  state.currentLevel = 0;
  state.player = {
    x: 0, y: 0,
    hp: ENTITY_STATS.player.hp,
    maxHp: ENTITY_STATS.player.maxHp,
    gold: 0,
    keys: 0,
    kills: 0,
  };
  loadLevel(0);
}

// ════════════════════════════════════════════════════════════
//  LOAD LEVEL
//  Builds the map, spawns enemies, places the player,
//  and starts the game loop for the given level index.
// ════════════════════════════════════════════════════════════
function loadLevel(levelIndex) {
  // Stop any existing game loop
  if (state.gameLoop) clearInterval(state.gameLoop);

  const levelData = LEVELS[levelIndex];
  state.phase = 'playing';

  // Deep-copy the map so pickups can be removed without
  // mutating the original LEVELS data
  state.map = levelData.map.map(row => [...row]);

  // Place player at spawn point
  state.player.x = levelData.playerStart.x;
  state.player.y = levelData.playerStart.y;

  // Build enemy objects from spawn configs
  state.enemies = levelData.enemies.map(cfg => ({
    type:        cfg.type,
    x:           cfg.x,
    y:           cfg.y,
    hp:          ENTITY_STATS[cfg.type].hp,
    maxHp:       ENTITY_STATS[cfg.type].hp,
    patrolPath:  cfg.patrolPath,
    patrolIndex: 0,           // which waypoint we're heading to
    moveTimer:   0,           // countdown until next move
    el:          null,        // DOM element (set during render)
    hpBarEl:     null,        // HP bar DOM element
    alive:       true,
  }));

  // Update HUD level number
  hudLevel.textContent = levelIndex + 1;

  // Show level splash screen briefly, then start
  showLevelSplash(levelData, () => {
    renderWorld();
    updateHUD();
    // ── GAME LOOP ──
    // Runs every 100ms — handles enemy AI movement
    state.gameLoop = setInterval(gameStep, 100);
    // Player movement runs on a faster interval (60ms)
    state.moveLoop = setInterval(playerMoveStep, 80);
  });
}

// ════════════════════════════════════════════════════════════
//  LEVEL SPLASH SCREEN
//  Shows the level name/icon for 2 seconds then calls back.
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
//  Clears and rebuilds all tile divs and entity divs.
//  Called once per level load (not every frame).
//  Entity positions are updated by moving their CSS left/top.
// ════════════════════════════════════════════════════════════
function renderWorld() {
  // Clear previous level's DOM
  gameWorld.innerHTML = '';

  const map = state.map;
  const rows = map.length;
  const cols = map[0].length;

  // Size the world div to fit the full map
  gameWorld.style.width  = (cols * TILE_SIZE) + 'px';
  gameWorld.style.height = (rows * TILE_SIZE) + 'px';

  // ── Render all tiles ──
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileType = map[row][col];
      if (tileType === T.EMPTY) continue;

      const div = document.createElement('div');
      div.classList.add('tile');
      div.style.left = (col * TILE_SIZE) + 'px';
      div.style.top  = (row * TILE_SIZE) + 'px';

      // Assign tile-specific class and content
      // ── TO ADD NEW TILE TYPES: add a case here and in style.css ──
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
          div.textContent = '🔒';
          div.dataset.row = row;
          div.dataset.col = col;
          div.id = `door-${row}-${col}`;
          break;
        case T.DOOR_OPEN:
          div.classList.add('tile-door-open');
          div.textContent = '🚪';
          break;
        case T.EXIT:
          div.classList.add('tile-exit');
          div.textContent = '🔽';
          div.id = `exit-${row}-${col}`;
          break;
        case T.TORCH:
          // Torches sit on top of the floor — render floor first
          const floorUnder = document.createElement('div');
          floorUnder.classList.add('tile', 'tile-floor');
          floorUnder.style.left = (col * TILE_SIZE) + 'px';
          floorUnder.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorUnder);
          div.classList.add('tile-torch');
          div.textContent = '🔦';
          break;
        case T.GOLD:
          // Floor under the coin
          const floorGold = document.createElement('div');
          floorGold.classList.add('tile', 'tile-floor');
          floorGold.style.left = (col * TILE_SIZE) + 'px';
          floorGold.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorGold);
          div.classList.add('tile-gold');
          div.textContent = '🪙';
          div.id = `pickup-${row}-${col}`;
          break;
        case T.KEY:
          const floorKey = document.createElement('div');
          floorKey.classList.add('tile', 'tile-floor');
          floorKey.style.left = (col * TILE_SIZE) + 'px';
          floorKey.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorKey);
          div.classList.add('tile-key');
          div.textContent = '🗝️';
          div.id = `pickup-${row}-${col}`;
          break;
        case T.POTION:
          const floorPotion = document.createElement('div');
          floorPotion.classList.add('tile', 'tile-floor');
          floorPotion.style.left = (col * TILE_SIZE) + 'px';
          floorPotion.style.top  = (row * TILE_SIZE) + 'px';
          gameWorld.appendChild(floorPotion);
          div.classList.add('tile-potion');
          div.textContent = '🧪';
          div.id = `pickup-${row}-${col}`;
          break;
      }

      gameWorld.appendChild(div);
    }
  }

  // ── Render enemies ──
  state.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    spawnEnemyElement(enemy);
  });

  // ── Render player ──
  const playerEl = document.createElement('div');
  playerEl.classList.add('entity-player');
  playerEl.id = 'player-entity';
  playerEl.textContent = '🧙';   // ← change player emoji here
  playerEl.style.left = (state.player.x * TILE_SIZE) + 'px';
  playerEl.style.top  = (state.player.y * TILE_SIZE) + 'px';
  gameWorld.appendChild(playerEl);

  // Initial camera position
  updateCamera();
}

// ════════════════════════════════════════════════════════════
//  SPAWN ENEMY ELEMENT
//  Creates the DOM element for a single enemy and attaches
//  it to the game world.
// ════════════════════════════════════════════════════════════
function spawnEnemyElement(enemy) {
  const stats = ENTITY_STATS[enemy.type];

  // Wrapper holds both the sprite and HP bar
  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.width    = TILE_SIZE + 'px';
  wrapper.style.height   = TILE_SIZE + 'px';
  wrapper.style.left     = (enemy.x * TILE_SIZE) + 'px';
  wrapper.style.top      = (enemy.y * TILE_SIZE) + 'px';
  wrapper.style.zIndex   = '9';

  // Enemy sprite div
  const el = document.createElement('div');
  el.classList.add(stats.cssClass);
  el.textContent = stats.emoji;

  // HP bar background
  const hpBg = document.createElement('div');
  hpBg.classList.add('enemy-hp-bar-bg');
  const hpBar = document.createElement('div');
  hpBar.classList.add('enemy-hp-bar');
  hpBar.style.width = '100%';
  hpBg.appendChild(hpBar);

  wrapper.appendChild(hpBg);
  wrapper.appendChild(el);
  gameWorld.appendChild(wrapper);

  // Store references on the enemy object for later updates
  enemy.el        = wrapper;
  enemy.hpBarEl   = hpBar;
}

// ════════════════════════════════════════════════════════════
//  CAMERA — centres viewport on the player
// ════════════════════════════════════════════════════════════
function updateCamera() {
  const px = state.player.x * TILE_SIZE + TILE_SIZE / 2;
  const py = state.player.y * TILE_SIZE + TILE_SIZE / 2;

  const mapW = state.map[0].length * TILE_SIZE;
  const mapH = state.map.length    * TILE_SIZE;
  const vpW  = VIEW_TILES_X * TILE_SIZE;
  const vpH  = VIEW_TILES_Y * TILE_SIZE;

  // Clamp so we never show void beyond the map edges
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
  hudHp.textContent   = p.hp;
  hudGold.textContent = p.gold;
  hudKeys.textContent = p.keys;
  hudKills.textContent = p.kills;
  // Health bar width as percentage
  const pct = Math.max(0, (p.hp / p.maxHp) * 100);
  hudHpBar.style.width = pct + '%';
  // Colour shifts red → yellow → green based on HP
  if      (pct > 60) hudHpBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
  else if (pct > 30) hudHpBar.style.background = 'linear-gradient(90deg, #f39c12, #f1c40f)';
  else               hudHpBar.style.background = 'linear-gradient(90deg, #c0392b, #e74c3c)';
}

// ════════════════════════════════════════════════════════════
//  WALKABILITY CHECK
//  Returns true if the tile at (x, y) can be stepped onto.
//  ── TO ALLOW a new tile type to be walked on:
//     add it to the return statement below ──
// ════════════════════════════════════════════════════════════
function isWalkable(x, y) {
  const map = state.map;
  if (y < 0 || y >= map.length)    return false;
  if (x < 0 || x >= map[0].length) return false;

  const t = map[y][x];
  return t === T.FLOOR      ||
         t === T.WALL_TOP   ||
         t === T.TORCH      ||
         t === T.GOLD       ||
         t === T.KEY        ||
         t === T.POTION     ||
         t === T.EQUIPMENT  ||   // ← equipment tiles are walkable (to collect them)
         t === T.EXIT       ||
         t === T.DOOR_OPEN;
}

// ════════════════════════════════════════════════════════════
//  PLAYER MOVEMENT STEP
//  Called every 80ms by state.moveLoop interval.
//  Reads held keys, moves player one tile, checks pickups.
//  ── TO CHANGE MOVE SPEED: adjust playerMoveCooldown value ──
//    Lower number = faster movement between tiles.
// ════════════════════════════════════════════════════════════
let playerMoveCooldown = 0;

function playerMoveStep() {
  if (state.phase !== 'playing') return;

  // ── Tick ranged cooldown every frame regardless of movement ──
  if (state.player.rangedCooldown > 0) state.player.rangedCooldown--;

  // ── Tick move cooldown ──
  if (playerMoveCooldown > 0) {
    playerMoveCooldown--;
    return;
  }

  // ── Read directional input ──
  let dx = 0, dy = 0;
  if      (keys['ArrowUp']    || keys['KeyW']) dy = -1;
  else if (keys['ArrowDown']  || keys['KeyS']) dy =  1;
  else if (keys['ArrowLeft']  || keys['KeyA']) dx = -1;
  else if (keys['ArrowRight'] || keys['KeyD']) dx =  1;
  else return; // no key held — nothing to do

  // ── Update facing direction for ranged attack ──
  if (dx !== 0) state.player.facing = dx; // 1 = right, -1 = left

  const nx = state.player.x + dx;
  const ny = state.player.y + dy;

  // ── Bounds check ──
  if (ny < 0 || ny >= state.map.length ||
      nx < 0 || nx >= state.map[0].length) return;

  const targetTile = state.map[ny][nx];

  // ── Locked door — try to unlock ──
  if (targetTile === T.DOOR_LOCKED) {
    if (state.player.keys > 0) {
      unlockDoor(nx, ny);
    } else {
      showFloatingText('🔒 Need a key!', nx, ny, 'player-dmg');
    }
    playerMoveCooldown = 3;
    return;
  }

  // ── Solid tile — blocked ──
  if (!isWalkable(nx, ny)) return;

  // ── Enemy on target tile — bump attack ──
  const enemyOnTile = state.enemies.find(
    e => e.alive && e.x === nx && e.y === ny
  );
  if (enemyOnTile) {
    dealDamageToEnemy(enemyOnTile, state.player.attackDamage);
    playerMoveCooldown = 4;
    triggerAttackAnim();
    return;
  }

  // ── Move the player ──
  state.player.x = nx;
  state.player.y = ny;

  // Move the player's DOM element
  const playerEl = document.getElementById('player-entity');
  if (playerEl) {
    playerEl.style.left = (nx * TILE_SIZE) + 'px';
    playerEl.style.top  = (ny * TILE_SIZE) + 'px';
  }

  // ── Check for pickups on the new tile ──
  checkPickup(nx, ny);

  // ── Check for exit tile ──
  if (state.map[ny][nx] === T.EXIT) {
    advanceLevel();
    return;
  }

  // ── Pan camera to follow player ──
  updateCamera();

  // ── Reset move cooldown ──
  // Adjust this value to change how fast the player moves:
  // 2 = very fast  |  3 = normal  |  5 = slow
  playerMoveCooldown = 3;
}

// ════════════════════════════════════════════════════════════
//  PLAYER ATTACK (SPACE / E key)
//  Attacks all enemies in the 4 adjacent tiles.
// ════════════════════════════════════════════════════════════
function playerAttack() {
  if (state.phase !== 'playing') return;

  const px = state.player.x;
  const py = state.player.y;

  // Check all 4 cardinal directions for enemies
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
      dealDamageToEnemy(enemy, ENTITY_STATS.player.attackDamage);
      hit = true;
    }
  });

  triggerAttackAnim();

  // Miss feedback
  if (!hit) {
    showFloatingText('miss', px, py, 'player-dmg');
  }
}

// ════════════════════════════════════════════════════════════
//  DEAL DAMAGE TO ENEMY
// ════════════════════════════════════════════════════════════
function dealDamageToEnemy(enemy, damage) {
  enemy.hp -= damage;
  showFloatingText(`-${damage}`, enemy.x, enemy.y, 'enemy-dmg');

  // Update enemy HP bar
  if (enemy.hpBarEl) {
    const pct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
    enemy.hpBarEl.style.width = pct + '%';
  }

  if (enemy.hp <= 0) {
    killEnemy(enemy);
  }
}

// ════════════════════════════════════════════════════════════
//  KILL ENEMY
// ════════════════════════════════════════════════════════════
function killEnemy(enemy) {
  enemy.alive = false;
  state.player.kills++;
  state.player.gold += ENTITY_STATS[enemy.type].goldReward;

  // Remove enemy DOM element with a fade
  if (enemy.el) {
    enemy.el.style.transition = 'opacity 0.4s';
    enemy.el.style.opacity    = '0';
    setTimeout(() => { if (enemy.el) enemy.el.remove(); }, 400);
  }

  showFloatingText(
    `+${ENTITY_STATS[enemy.type].goldReward}🪙`,
    enemy.x, enemy.y, 'enemy-dmg'
  );
  updateHUD();
}

// ════════════════════════════════════════════════════════════
//  PICKUP COLLECTION
//  Called when the player steps onto a pickup tile.
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

// ── Remove a pickup tile from the map and DOM ──
function removeTilePickup(x, y) {
  state.map[y][x] = T.FLOOR;   // replace with plain floor in the data
  const el = document.getElementById(`pickup-${y}-${x}`);
  if (el) el.remove();
}

// ════════════════════════════════════════════════════════════
//  UNLOCK DOOR
//  Consumes one key and opens a locked door tile.
// ════════════════════════════════════════════════════════════
function unlockDoor(x, y) {
  state.player.keys--;
  state.map[y][x] = T.FLOOR;   // make walkable in data

  // Update the door's DOM element
  const doorEl = document.getElementById(`door-${y}-${x}`);
  if (doorEl) {
    doorEl.className = 'tile tile-door-open';
    doorEl.textContent = '🚪';
    // After a moment, replace with plain floor
    setTimeout(() => {
      doorEl.className = 'tile tile-floor';
      doorEl.textContent = '';
    }, 600);
  }

  showFloatingText('🔓 Unlocked!', x, y, 'enemy-dmg');
  updateHUD();
}

// ════════════════════════════════════════════════════════════
//  ENEMY AI — GAME STEP
//  Called every 100ms. Moves each enemy one step along
//  their patrol path, and attacks the player if adjacent.
// ════════════════════════════════════════════════════════════
function gameStep() {
  if (state.phase !== 'playing') return;

  state.enemies.forEach(enemy => {
    if (!enemy.alive) return;

    const stats = ENTITY_STATS[enemy.type];

    // Increment move timer
    enemy.moveTimer += 100;
    if (enemy.moveTimer < stats.speed) return;
    enemy.moveTimer = 0;

    // ── Check if player is adjacent — attack if so ──
    const dx = Math.abs(enemy.x - state.player.x);
    const dy = Math.abs(enemy.y - state.player.y);

    if (dx + dy === 1) {
      // Adjacent — attack player
      state.player.hp -= stats.attackDamage;
      showFloatingText(`-${stats.attackDamage}`, state.player.x, state.player.y, 'player-dmg');
      updateHUD();

      if (state.player.hp <= 0) {
        triggerGameOver();
        return;
      }
      return; // don't move if attacking
    }

    // ── Patrol movement ──
    const target = enemy.patrolPath[enemy.patrolIndex];
    let moveX = 0, moveY = 0;

    if      (enemy.x < target.x) moveX =  1;
    else if (enemy.x > target.x) moveX = -1;
    else if (enemy.y < target.y) moveY =  1;
    else if (enemy.y > target.y) moveY = -1;
    else {
      // Reached waypoint — advance to next
      enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPath.length;
      return;
    }

    const nx = enemy.x + moveX;
    const ny = enemy.y + moveY;

    // Don't walk into walls, other enemies, or the player
    if (!isWalkable(nx, ny)) return;
    const blocked = state.enemies.some(
      e => e.alive && e !== enemy && e.x === nx && e.y === ny
    );
    if (blocked) return;
    if (nx === state.player.x && ny === state.player.y) return;

    // Move enemy
    enemy.x = nx;
    enemy.y = ny;

    // Update enemy DOM element position
    if (enemy.el) {
      enemy.el.style.left = (nx * TILE_SIZE) + 'px';
      enemy.el.style.top  = (ny * TILE_SIZE) + 'px';
    }
  });
}

// ════════════════════════════════════════════════════════════
//  ADVANCE LEVEL
//  Called when the player steps on the exit tile.
// ════════════════════════════════════════════════════════════
function advanceLevel() {
  if (state.gameLoop)  clearInterval(state.gameLoop);
  if (state.moveLoop)  clearInterval(state.moveLoop);

  state.currentLevel++;

  if (state.currentLevel >= LEVELS.length) {
    // All levels complete — victory!
    triggerWin();
  } else {
    // Fade out, load next level
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
//  Briefly adds the .attacking CSS class to the player div.
// ════════════════════════════════════════════════════════════
function triggerAttackAnim() {
  const playerEl = document.getElementById('player-entity');
  if (!playerEl) return;
  playerEl.classList.add('attacking');
  setTimeout(() => playerEl.classList.remove('attacking'), 260);
}

// ════════════════════════════════════════════════════════════
//  FLOATING DAMAGE / TEXT POPUP
//  Creates a temporary floating text element at a tile position.
//  type: 'player-dmg' (red) | 'enemy-dmg' (yellow)
// ════════════════════════════════════════════════════════════
function showFloatingText(text, tileX, tileY, type) {
  const el = document.createElement('div');
  el.classList.add('dmg-popup', type);
  el.textContent = text;
  // Position at the tile, slightly offset upward
  el.style.left = (tileX * TILE_SIZE + 4) + 'px';
  el.style.top  = (tileY * TILE_SIZE - 4) + 'px';
  gameWorld.appendChild(el);
  // Remove after animation completes
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
  winGold.textContent  = state.player.gold;
  winKills.textContent = state.player.kills;

  setTimeout(() => {
    winScreen.classList.remove('hidden');
  }, 600);
}

// ════════════════════════════════════════════════════════════
//  READY — show start screen on page load
// ════════════════════════════════════════════════════════════
startScreen.classList.remove('hidden');
