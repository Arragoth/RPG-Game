// ════════════════════════════════════════════════════════════
//  CONSTANTS
// ════════════════════════════════════════════════════════════

const TILE_SIZE    = 32;
const VIEW_TILES_X = 20;
const VIEW_TILES_Y = 18;

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
//  IMAGE REGISTRY
//  Add an entry here when you have an image ready.
//  Key matches the id used in EQUIPMENT, CHARACTERS, or
//  a special tile key like 'tile_wall', 'tile_floor' etc.
//  Leave the object empty {} to use emoji fallback.
// ════════════════════════════════════════════════════════════
const IMAGES = {};

const IMAGE_MANIFEST = {
  // Characters
  wizard:          'assets/images/characters/wizard.png',
  warrior:         'assets/images/characters/warrior.png',

  // Equipment
  wand_oak:        'assets/images/equipment/wand_oak.png',
  sword_iron:      'assets/images/equipment/sword_iron.png',
  axe_battle:      'assets/images/equipment/axe_battle.png',
  sword_legendary: 'assets/images/equipment/sword_legendary.png',

  // Tiles
  tile_wall:       'assets/images/tiles/wall.png',
  tile_floor:      'assets/images/tiles/floor.png',
  tile_door:       'assets/images/tiles/door.png',
  tile_chest:      'assets/images/tiles/chest.png',
  tile_potion:     'assets/images/tiles/potion.png',
  tile_key:        'assets/images/tiles/key.png',
  tile_equipment:  'assets/images/tiles/equipment.png',

  // Enemies
  enemy_goblin:    'assets/images/enemies/goblin.png',
  enemy_orc:       'assets/images/enemies/orc.png',
  enemy_boss:      'assets/images/enemies/boss.png',
};

// ── Pre-load all images that actually exist ──
// Any image that 404s is silently skipped; emoji fallback takes over.
function preloadImages(onComplete) {
  const keys   = Object.keys(IMAGE_MANIFEST);
  let   loaded = 0;

  if (keys.length === 0) { onComplete(); return; }

  keys.forEach(key => {
    const img = new Image();
    img.onload = () => {
      IMAGES[key] = img;
      if (++loaded === keys.length) onComplete();
    };
    img.onerror = () => {
      // File doesn't exist yet — emoji fallback will be used
      if (++loaded === keys.length) onComplete();
    };
    img.src = IMAGE_MANIFEST[key];
  });
}

// ── Helper: get image or null ──
function getImage(key) {
  return IMAGES[key] || null;
}
