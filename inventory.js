// ════════════════════════════════════════════════════════════
//  INVENTORY SYSTEM
//  Tracks collected items, equipped item per slot,
//  and handles the inventory window open/close/equip logic.
//  Uses getSpriteElement() from render.js for all icons —
//  images where loaded, emoji fallback automatically.
// ════════════════════════════════════════════════════════════

// ── Inventory state ──
const inventory = {
  // All items the player has picked up this run
  collected: [],

  // Currently equipped item id per slot (null = empty)
  equipped: {
    weapon: null,
  },
};


// ════════════════════════════════════════════════════════════
//  ADD ITEM TO INVENTORY
//  Called from combat.js checkPickup(). Stats are applied
//  on equip, not on pickup.
// ════════════════════════════════════════════════════════════
function inventoryAddItem(itemId) {
  if (inventory.collected.find(i => i.id === itemId)) return; // no dupes
  const item = EQUIPMENT.find(e => e.id === itemId);
  if (!item) return;
  inventory.collected.push({ ...item });

  // Auto-equip if the weapon slot is empty
  if (inventory.equipped.weapon === null) {
    inventoryEquip('weapon', itemId, /* silent = */ false);
  }
}


// ════════════════════════════════════════════════════════════
//  EQUIP ITEM
// ════════════════════════════════════════════════════════════
function inventoryEquip(slot, itemId, silent = false) {
  const item = inventory.collected.find(i => i.id === itemId);
  if (!item) return;

  // Un-apply the old equipped item's bonuses
  const oldId = inventory.equipped[slot];
  if (oldId) {
    const old = inventory.collected.find(i => i.id === oldId);
    if (old) {
      state.player.attackDamage -= old.atkBonus;
      state.player.rangedDamage -= old.rangedBonus;
    }
  }

  // Apply new item bonuses
  inventory.equipped[slot] = itemId;
  state.player.attackDamage += item.atkBonus;
  state.player.rangedDamage += item.rangedBonus;

  updateHUD();

  if (!silent) {
    showFloatingText(`${item.emoji} Equipped!`, state.player.x, state.player.y, 'enemy-dmg');
  }

  // Refresh the window if it's open
  if (!document.getElementById('inventory-screen').classList.contains('hidden')) {
    renderInventoryWindow();
  }
}


// ════════════════════════════════════════════════════════════
//  OPEN / CLOSE INVENTORY
// ════════════════════════════════════════════════════════════
function openInventory() {
  if (state.phase !== 'playing') return;
  state.phase = 'inventory';
  renderInventoryWindow();
  document.getElementById('inventory-screen').classList.remove('hidden');
}

function closeInventory() {
  state.phase = 'playing';
  document.getElementById('inventory-screen').classList.add('hidden');
}

function toggleInventory() {
  const screen = document.getElementById('inventory-screen');
  if (screen.classList.contains('hidden')) {
    openInventory();
  } else {
    closeInventory();
  }
}


// ════════════════════════════════════════════════════════════
//  RENDER INVENTORY WINDOW
// ════════════════════════════════════════════════════════════
function renderInventoryWindow() {
  const p    = state.player;
  const char = CHARACTERS[state.chosenCharacter];

  // ── Header — character icon ──
  const charIconEl = document.getElementById('inv-char-emoji');
  charIconEl.innerHTML = '';
  charIconEl.appendChild(getSpriteElement(state.chosenCharacter, char.emoji, 44));

  document.getElementById('inv-char-name').textContent = char.name;
  document.getElementById('inv-gold-val').textContent  = p.gold;

  // ── Stats ──
  document.getElementById('inv-hp').textContent     = `${Math.max(0, p.hp)} / ${p.maxHp}`;
  document.getElementById('inv-atk').textContent    = p.attackDamage;
  document.getElementById('inv-ranged').textContent = p.rangedDamage > 0 ? p.rangedDamage : '—';

  // ── Weapon slot ──
  renderEquipSlot('weapon');

  // ── Backpack item list ──
  const list = document.getElementById('inv-item-list');
  list.innerHTML = '';

  if (inventory.collected.length === 0) {
    const empty = document.createElement('div');
    empty.classList.add('inv-empty-msg');
    empty.textContent = 'No items collected yet.';
    list.appendChild(empty);
    return;
  }

  inventory.collected.forEach(item => {
    const isEquipped = Object.values(inventory.equipped).includes(item.id);

    const card = document.createElement('div');
    card.classList.add('inv-item-card');
    if (isEquipped) card.classList.add('equipped');

    // ── Icon — image or emoji ──
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('inv-card-emoji');
    iconWrapper.appendChild(getSpriteElement(item.id, item.emoji, 32));

    // ── Item info ──
    const info = document.createElement('div');
    info.classList.add('inv-card-info');

    const name = document.createElement('div');
    name.classList.add('inv-card-name');
    name.textContent = item.name;

    const tier = document.createElement('div');
    tier.classList.add('inv-card-tier', `tier-${item.tier}`);
    tier.textContent = item.tier;

    info.appendChild(name);
    info.appendChild(tier);

    // ── Bonus ──
    const bonus = document.createElement('div');
    bonus.classList.add('inv-card-bonus');
    bonus.textContent = item.description;

    card.appendChild(iconWrapper);
    card.appendChild(info);
    card.appendChild(bonus);

    // ── Equipped badge ──
    if (isEquipped) {
      const badge = document.createElement('div');
      badge.classList.add('inv-card-equipped-badge');
      badge.textContent = 'EQUIPPED';
      card.appendChild(badge);
    }

    // ── Click to equip ──
    if (!isEquipped) {
      card.addEventListener('click', () => inventoryEquip('weapon', item.id));
    }

    list.appendChild(card);
  });
}


// ════════════════════════════════════════════════════════════
//  RENDER A SINGLE EQUIPMENT SLOT
// ════════════════════════════════════════════════════════════
function renderEquipSlot(slot) {
  const slotEl     = document.getElementById(`slot-${slot}`);
  const slotItemEl = document.getElementById(`slot-${slot}-item`);
  const equippedId = inventory.equipped[slot];

  if (!equippedId) {
    slotItemEl.innerHTML = '<span class="inv-slot-empty">— empty —</span>';
    slotEl.classList.remove('active-slot');
    return;
  }

  const item = inventory.collected.find(i => i.id === equippedId);
  if (!item) return;

  slotEl.classList.add('active-slot');
  slotItemEl.innerHTML = '';

  // ── Icon — image or emoji ──
  const iconEl = getSpriteElement(item.id, item.emoji, 28);
  iconEl.classList.add('inv-slot-emoji');

  const name = document.createElement('span');
  name.classList.add('inv-slot-name');
  name.textContent = item.name;

  const bonus = document.createElement('span');
  bonus.classList.add('inv-slot-bonus');
  bonus.textContent = item.description;

  slotItemEl.appendChild(iconEl);
  slotItemEl.appendChild(name);
  slotItemEl.appendChild(bonus);
}


// ════════════════════════════════════════════════════════════
//  RESET INVENTORY (called on new game)
// ════════════════════════════════════════════════════════════
function resetInventory() {
  inventory.collected    = [];
  inventory.equipped.weapon = null;
}


// ════════════════════════════════════════════════════════════
//  CLOSE BUTTON
// ════════════════════════════════════════════════════════════
document.getElementById('inv-close-btn').addEventListener('click', closeInventory);
