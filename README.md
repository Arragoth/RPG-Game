# RPG-Game🗡️ 
A browser-based dungeon crawler built with vanilla HTML, CSS, and JavaScript.
Explore procedurally arranged levels, fight enemies, collect gold and keys,
and descend deeper into the dungeon — if you survive.

📋 Table of Contents
Getting Started
How to Play
Controls
Combat
Items & Pickups
Enemies
Levels & Progression
HUD Guide
Tips & Strategy
Known Issues
Credits

🚀 Getting Started
No installation required. The game runs entirely in the browser.

Download or clone this repository.
Open index.html in any modern browser (Chrome, Firefox, Edge).
Press Start Game on the title screen.
⚠️ Do not open the file through a live-server extension if you experience audio issues — opening index.html directly works best.

🎮 How to Play
You are a lone adventurer descending through a dangerous dungeon.
Each level is filled with enemies standing between you and the stairs down.

Defeat all enemies to unlock doors and progress.
Collect gold to track your score.
Find keys to open locked doors early.
Reach the stairs to descend to the next level.
Don't die — there is no respawn.

🕹️ Controls
Key	Action
Arrow Keys	Move player (Up / Down / Left / Right)
Space or E	Melee attack (hits adjacent tile in facing direction)
F or X	Fire ranged projectile (travels until it hits a wall or enemy)
Escape	Pause / unpause the game
🔁 Movement is tile-based — each keypress moves exactly one tile.

⚔️ Combat
Melee Attack
Press Space or E to swing at the tile directly in front of you.
Melee hits instantly and deals full attack damage.
Use it for enemies directly beside you.

Ranged Attack
Press F or X to fire a magic bolt in your current facing direction.
The bolt travels tile by tile across the map until it either:

Hits an enemy — deals ranged damage and bursts.
Hits a wall — bursts with no effect.
Leaves the map bounds — disappears.
⏱️ Ranged attacks have a short cooldown — you cannot spam bolts.
Use ranged attacks to pick off enemies from a safe distance before closing in.

💰 Items & Pickups
Tile	Name	Effect
💰	Gold Coin	Increases your gold count
🗝️	Key	Adds a key to your inventory — use it to open locked doors
❤️	Health Potion	Restores HP
🪜	Stairs Down	Descends to the next level (only after all enemies are defeated)

👾 Enemies
Enemies take their turn after every player move.
Plan your movement carefully — getting surrounded is usually fatal.

Enemy	Behaviour	Notes
Skeleton	Moves toward player each turn	Fast and aggressive
Goblin	Patrols a fixed path	Easy to dodge
Troll	Stays still, high HP	Tank — use ranged to wear down

🏰 Levels & Progression
Each level is larger and more dangerous than the last.
Locked doors 🚪 block certain paths — find a key or clear all enemies to open them.
All enemies must be defeated before the stairs become usable.
Enemy HP and count scale with dungeon depth.

📊 HUD Guide
Element	Meaning
❤️ HP bar	Your current and maximum health
💰 Gold	Total gold collected this run
🗝️ Keys	Number of keys currently held
⚔️ Kills	Total enemies defeated
🏰 Level	Current dungeon depth

💡 Tips & Strategy
Face your target before firing — the bolt travels in the direction you are currently facing, not where your cursor is.
Kite enemies — fire a bolt, back up one tile, fire again. Most enemies can be defeated without taking a single hit this way.
Clear rooms before entering — fire bolts through doorways to soften enemies before stepping in.
Keys are rare — don't waste them on doors you can unlock by clearing enemies.
Watch your cooldown — if a bolt didn't fire, you pressed the key too fast. Wait a beat and try again.
Corners are dangerous — enemies can box you in. Always keep an escape tile open.

🐛 Known Issues
The "A listener indicated an asynchronous response" error occasionally visible in the browser console is caused by a browser extension (commonly an ad blocker or password manager) and does not affect gameplay. It can be safely ignored.
Projectiles fired at the exact edge of the map disappear immediately — this is intended behaviour.

🛠️ Credits
Design & Development: Marc McRae

Engine: Vanilla HTML5 / CSS3 / JavaScript — no frameworks or libraries used.

Inspiration: Rogue, Brogue, Dungeon Crawl Stone Soup