// Danh sách trò chơi
const games = [
  {
    id: '2048',
    name: '2048',
    image: '../assets/img/img-up/2048.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: '9007199254740992',
    name: '9007199254740992',
    image: '../assets/img/img-up/9007199254740992.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'a-small-world-cup',
    name: 'A Small World Cup',
    image: '../assets/img/img-up/a-small-world-cup.png',
    categories: ['sports', 'arcade']
  },
  {
    id: 'ages-of-conflict',
    name: 'Ages of Conflict',
    image: '../assets/img/img-up/ages-of-conflict.png',
    categories: ['strategy', 'action']
  },
  {
    id: 'among-us',
    name: 'Among Us',
    image: '../assets/img/img-up/among-us.png',
    categories: ['multiplayer', 'strategy']
  },
  {
    id: 'baldis-basics',
    name: 'Baldis Basics',
    image: '../assets/img/img-up/baldis-basics.png',
    categories: ['horror', 'adventure']
  },
  {
    id: 'ball-puzzle',
    name: 'Ball Puzzle',
    image: '../assets/img/img-up/ball-puzzle.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'ball-sort-puzzle',
    name: 'Ball Sort Puzzle',
    image: '../assets/img/img-up/ball-sort-puzzle.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'basket-and-ball',
    name: 'Basket and Ball',
    image: '../assets/img/img-up/basket-and-ball.png',
    categories: ['sports', 'arcade']
  },
  {
    id: 'basket-random',
    name: 'Basket Random',
    image: '../assets/img/img-up/basket-random.png',
    categories: ['sports', 'arcade']
  },
  {
    id: 'bitlife',
    name: 'Bitlife',
    image: '../assets/img/img-up/bitlife.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    image: '../assets/img/img-up/blackjack.png',
    categories: ['board', 'casual']
  },
  {
    id: 'block-blast',
    name: 'Block Blast',
    image: '../assets/img/img-up/block-blast.png',
    categories: ['puzzle', 'arcade']
  },
  {
    id: 'block-the-pig',
    name: 'Block the Pig',
    image: '../assets/img/img-up/block-the-pig.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'bloons-td',
    name: 'Bloons TD',
    image: '../assets/img/img-up/bloons-td.png',
    categories: ['tower-defense', 'strategy']
  },
  {
    id: 'bloons-td-2',
    name: 'Bloons TD 2',
    image: '../assets/img/img-up/bloons-td-2.png',
    categories: ['tower-defense', 'strategy']
  },
  {
    id: 'bloons-td-3',
    name: 'Bloons TD 3',
    image: '../assets/img/img-up/bloons-td-3.png',
    categories: ['tower-defense', 'strategy']
  },
  {
    id: 'bloons-td-4',
    name: 'Bloons TD 4',
    image: '../assets/img/img-up/bloons-td-4.png',
    categories: ['tower-defense', 'strategy']
  },
  {
    id: 'boxing-random',
    name: 'Boxing Random',
    image: '../assets/img/img-up/boxing-random.png',
    categories: ['sports', 'action']
  },
  {
    id: 'cell-machine',
    name: 'Cell Machine',
    image: '../assets/img/img-up/cell-machine.png',
    categories: ['puzzle', 'simulation']
  },
  {
    id: 'chrome-dino',
    name: 'Chrome Dino',
    image: '../assets/img/img-up/chrome-dino.png',
    categories: ['arcade', 'runner']
  },
  {
    id: 'circlo',
    name: 'Circlo',
    image: '../assets/img/img-up/circlo.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'cookie-clicker',
    name: 'Cookie Clicker',
    image: '../assets/img/img-up/cookie-clicker.png',
    categories: ['idle', 'casual']
  },
  {
    id: 'core-ball',
    name: 'Core Ball',
    image: '../assets/img/img-up/core-ball.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'ctr-time-travel',
    name: 'CTR Time Travel',
    image: '../assets/img/img-up/ctr-time-travel.png',
    categories: ['adventure', 'puzzle']
  },
  {
    id: 'death-run-3d',
    name: 'Death Run 3D',
    image: '../assets/img/img-up/death-run-3d.png',
    categories: ['runner', 'action']
  },
  {
    id: 'doodle-jump',
    name: 'Doodle Jump',
    image: '../assets/img/img-up/doodle-jump.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'drift-boss',
    name: 'Drift Boss',
    image: '../assets/img/img-up/drift-boss.png',
    categories: ['racing', 'arcade']
  },
  {
    id: 'drift-hunters',
    name: 'Drift Hunters',
    image: '../assets/img/img-up/drift-hunters.png',
    categories: ['racing', 'simulation']
  },
  {
    id: 'duck-life-4',
    name: 'Duck Life 4',
    image: '../assets/img/img-up/duck-life-4.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'eaglercraft',
    name: 'Eaglercraft',
    image: '../assets/img/img-up/eaglercraft.png',
    categories: ['sandbox', 'survival']
  },
  {
    id: 'edge-surf',
    name: 'Edge Surf',
    image: '../assets/img/img-up/edge-surf.png',
    categories: ['arcade', 'runner']
  },
  {
    id: 'fireboy-and-watergirl-1',
    name: 'Fireboy and Watergirl 1',
    image: '../assets/img/img-up/fireboy-and-watergirl-1.png',
    categories: ['puzzle', 'multiplayer']
  },
  {
    id: 'fireboy-and-watergirl-2',
    name: 'Fireboy and Watergirl 2',
    image: '../assets/img/img-up/fireboy-and-watergirl-2.png',
    categories: ['puzzle', 'multiplayer']
  },
  {
    id: 'fireboy-and-watergirl-3',
    name: 'Fireboy and Watergirl 3',
    image: '../assets/img/img-up/fireboy-and-watergirl-3.png',
    categories: ['puzzle', 'multiplayer']
  },
  {
    id: 'fireboy-and-watergirl-4',
    name: 'Fireboy and Watergirl 4',
    image: '../assets/img/img-up/fireboy-and-watergirl-4.png',
    categories: ['puzzle', 'multiplayer']
  },
  {
    id: 'fireboy-and-watergirl-5',
    name: 'Fireboy and Watergirl 5',
    image: '../assets/img/img-up/fireboy-and-watergirl-5.png',
    categories: ['puzzle', 'multiplayer']
  },
  {
    id: 'fireboy-and-watergirl-6',
    name: 'Fireboy and Watergirl 6',
    image: '../assets/img/img-up/fireboy-and-watergirl-6.png',
    categories: ['puzzle', 'multiplayer']
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    image: '../assets/img/img-up/flappy-bird.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'fnaf-1',
    name: 'FNAF 1',
    image: '../assets/img/img-up/fnaf-1.png',
    categories: ['horror', 'strategy']
  },
  {
    id: 'fnaf-2',
    name: 'FNAF 2',
    image: '../assets/img/img-up/fnaf-2.png',
    categories: ['horror', 'strategy']
  },
  {
    id: 'fnaf-3',
    name: 'FNAF 3',
    image: '../assets/img/img-up/fnaf-3.png',
    categories: ['horror', 'strategy']
  },
  {
    id: 'fnaf-4',
    name: 'FNAF 4',
    image: '../assets/img/img-up/fnaf-4.png',
    categories: ['horror', 'strategy']
  },
  {
    id: 'fnaf-5',
    name: 'FNAF 5',
    image: '../assets/img/img-up/fnaf-5.png',
    categories: ['horror', 'strategy']
  },
  {
    id: 'fnaf-ucn',
    name: 'FNAF UCN',
    image: '../assets/img/img-up/fnaf-ucn.png',
    categories: ['horror', 'strategy']
  },
  {
    id: 'friday-night-funkin',
    name: "Friday Night Funkin'",
    image: '../assets/img/img-up/friday-night-funkin.png',
    categories: ['music', 'rhythm']
  },
  {
    id: 'fruit-ninja',
    name: 'Fruit Ninja',
    image: '../assets/img/img-up/fruit-ninja.png',
    categories: ['arcade', 'action']
  },
  {
    id: 'geodash',
    name: 'Geodash',
    image: '../assets/img/img-up/geodash.png',
    categories: ['arcade', 'music']
  },
  {
    id: 'geodash-subzero',
    name: 'Geodash Subzero',
    image: '../assets/img/img-up/geodash-subzero.png',
    categories: ['arcade', 'music']
  },
  {
    id: 'geometry-dash-lite',
    name: 'Geometry Dash Lite',
    image: '../assets/img/img-up/geometry-dash-lite.png',
    categories: ['arcade', 'music']
  },
  {
    id: 'google-feud',
    name: 'Google Feud',
    image: '../assets/img/img-up/google-feud.png',
    categories: ['puzzle', 'word']
  },
  {
    id: 'google-snake',
    name: 'Google Snake',
    image: '../assets/img/img-up/google-snake.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'gta-advance',
    name: 'GTA Advance',
    image: '../assets/img/img-up/gta-advance.png',
    categories: ['action', 'adventure']
  },
  {
    id: 'hextris',
    name: 'Hextris',
    image: '../assets/img/img-up/hextris.png',
    categories: ['puzzle', 'arcade']
  },
  {
    id: 'idle-breakout',
    name: 'Idle Breakout',
    image: '../assets/img/img-up/idle-breakout.png',
    categories: ['idle', 'casual']
  },
  {
    id: 'infinite-craft',
    name: 'Infinite Craft',
    image: '../assets/img/img-up/infinite-craft.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'legend-of-zelda-link-to-the-past',
    name: 'Legend of Zelda: A Link to the Past',
    image: '../assets/img/img-up/legend-of-zelda-link-to-the-past.png',
    categories: ['action', 'adventure', 'rpg']
  },
  {
    id: 'legend-of-zelda-minish-cap',
    name: 'Legend of Zelda: Minish Cap',
    image: '../assets/img/img-up/legend-of-zelda-minish-cap.png',
    categories: ['action', 'adventure', 'rpg']
  },
  {
    id: 'little-alchemy',
    name: 'Little Alchemy',
    image: '../assets/img/img-up/little-alchemy.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'madalin-stunt-cars-2',
    name: 'Madalin Stunt Cars 2',
    image: '../assets/img/img-up/madalin-stunt-cars-2.png',
    categories: ['racing', 'sports']
  },
  {
    id: 'madalin-stunt-cars-3',
    name: 'Madalin Stunt Cars 3',
    image: '../assets/img/img-up/madalin-stunt-cars-3.jpg',
    categories: ['racing', 'sports']
  },
  {
    id: 'mario',
    name: 'Super Mario Bros',
    image: '../assets/img/img-up/mario.png',
    categories: ['platformer', 'action']
  },
  {
    id: 'mario-party',
    name: 'Mario Party',
    image: '../assets/img/img-up/mario-party.png',
    categories: ['party', 'multiplayer']
  },
  {
    id: 'mario-party-2',
    name: 'Mario Party 2',
    image: '../assets/img/img-up/mario-party-2.png',
    categories: ['party', 'multiplayer']
  },
  {
    id: 'mario-party-3',
    name: 'Mario Party 3',
    image: '../assets/img/img-up/mario-party-3.png',
    categories: ['party', 'multiplayer']
  },
  {
    id: 'minecraft',
    name: 'Minecraft Classic',
    image: '../assets/img/img-up/minecraft.png',
    categories: ['sandbox', 'survival']
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    image: '../assets/img/img-up/minesweeper.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'moto-x3m',
    name: 'Moto X3M',
    image: '../assets/img/img-up/moto-x3m.png',
    categories: ['racing', 'sports']
  },
  {
    id: 'moto-x3m-2',
    name: 'Moto X3M 2',
    image: '../assets/img/img-up/moto-x3m-2.png',
    categories: ['racing', 'sports']
  },
  {
    id: 'moto-x3m-pool-party',
    name: 'Moto X3M Pool Party',
    image: '../assets/img/img-up/moto-x3m-pool-party.png',
    categories: ['racing', 'sports']
  },
  {
    id: 'moto-x3m-spooky-land',
    name: 'Moto X3M Spooky Land',
    image: '../assets/img/img-up/moto-x3m-spooky-land.png',
    categories: ['racing', 'sports']
  },
  {
    id: 'moto-x3m-winter',
    name: 'Moto X3M Winter',
    image: '../assets/img/img-up/moto-x3m-winter.png',
    categories: ['racing', 'sports']
  },
  {
    id: 'ms-solitaire',
    name: 'Microsoft Solitaire',
    image: '../assets/img/img-up/ms-solitaire.png',
    categories: ['card', 'casual']
  },
  {
    id: 'ocarina-of-time',
    name: 'Legend of Zelda: Ocarina of Time',
    image: '../assets/img/img-up/ocarina-of-time.png',
    categories: ['action', 'adventure', 'rpg']
  },
  {
    id: 'pacman',
    name: 'Pac-Man',
    image: '../assets/img/img-up/pacman.png',
    categories: ['arcade', 'classic']
  },
  {
    id: 'papas-burgeria',
    name: 'Papas Burgeria',
    image: '../assets/img/img-up/papas-burgeria.png',
    categories: ['simulation', 'management']
  },
  {
    id: 'papas-freezeria',
    name: 'Papas Freezeria',
    image: '../assets/img/img-up/papas-freezeria.png',
    categories: ['simulation', 'management']
  },
  {
    id: 'papas-pancakeria',
    name: 'Papas Pancakeria',
    image: '../assets/img/img-up/papas-pancakeria.png',
    categories: ['simulation', 'management']
  },
  {
    id: 'papas-pizzeria',
    name: 'Papas Pizzeria',
    image: '../assets/img/img-up/papas-pizzeria.png',
    categories: ['simulation', 'management']
  },
  {
    id: 'paperio2',
    name: 'Paper.io 2',
    image: '../assets/img/img-up/paperio2.png',
    categories: ['io', 'strategy']
  },
  {
    id: 'papery-planes',
    name: 'Papery Planes',
    image: '../assets/img/img-up/papery-planes.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'pokemon-black',
    name: 'Pokemon Black',
    image: '../assets/img/img-up/pokemon-black.png',
    categories: ['rpg', 'adventure']
  },
  {
    id: 'pokemon-emerald',
    name: 'Pokemon Emerald',
    image: '../assets/img/img-up/pokemon-emerald.png',
    categories: ['rpg', 'adventure']
  },
  {
    id: 'pokemon-fire-red',
    name: 'Pokemon Fire Red',
    image: '../assets/img/img-up/pokemon-fire-red.png',
    categories: ['rpg', 'adventure']
  },
  {
    id: 'pokemon-leaf-green',
    name: 'Pokemon Leaf Green',
    image: '../assets/img/img-up/pokemon-leaf-green.png',
    categories: ['rpg', 'adventure']
  },
  {
    id: 'pokemon-ruby',
    name: 'Pokemon Ruby',
    image: '../assets/img/img-up/pokemon-ruby.png',
    categories: ['rpg', 'adventure']
  },
  {
    id: 'pokemon-sapphire',
    name: 'Pokemon Sapphire',
    image: '../assets/img/img-up/pokemon-sapphire.png',
    categories: ['rpg', 'adventure']
  },
  {
    id: 'pokemon-white',
    name: 'Pokemon White',
    image: '../assets/img/img-up/pokemon-white.png',
    categories: ['rpg', 'adventure']
  },
  {
    id: 'poker',
    name: 'Poker',
    image: '../assets/img/img-up/poker.png',
    categories: ['card', 'casino']
  },
  {
    id: 'poptropica',
    name: 'Poptropica',
    image: '../assets/img/img-up/poptropica.png',
    categories: ['adventure', 'rpg']
  },
  {
    id: 'project-sand',
    name: 'Project Sand',
    image: '../assets/img/img-up/project-sand.png',
    categories: ['simulation', 'sandbox']
  },
  {
    id: 'retro-bowl',
    name: 'Retro Bowl',
    image: '../assets/img/img-up/retro-bowl.png',
    categories: ['sports', 'arcade']
  },
  {
    id: 'retro-bowl-college',
    name: 'Retro Bowl College',
    image: '../assets/img/img-up/retro-bowl-college.png',
    categories: ['sports', 'arcade']
  },
  {
    id: '8-ball-pool',
    name: "8 Ball Pool",
    image: '../assets/img/img-up/8-ball-pool.png',
    categories: ['arcade', 'casual']
  },
  {
    id: '3d-bowling',
    name: "3 D Bowling",
    image: '../assets/img/img-up/3d-bowling.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'awesome-tanks-2',
    name: "Awesome Tanks 2",
    image: '../assets/img/img-up/awesome-tanks-2.png',
    categories: ['action', 'casual']
  },
  {
    id: '3-pandas-in-japan',
    name: "3 Pandas In Japan",
    image: '../assets/img/img-up/3-pandas-in-japan.png',
    categories: ['arcade', 'casual']
  },
  {
    id: '1-on-1-soccer',
    name: "1 On 1 Soccer",
    image: '../assets/img/img-up/1-on-1-soccer.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'adam-and-eve-6',
    name: "Adam And Eve 6",
    image: '../assets/img/img-up/adam-and-eve-6.png',
    categories: ['arcade', 'casual']
  },
  {
    id: '1010-color-match',
    name: "1010 Color Match",
    image: '../assets/img/img-up/1010-color-match.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'apple-shooter',
    name: "Apple Shooter",
    image: '../assets/img/img-up/apple-shooter.png',
    categories: ['action', 'casual']
  },
  {
    id: 'arcane-archer',
    name: "Arcane Archer",
    image: '../assets/img/img-up/arcane-archer.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'ball-sort-halloween',
    name: "Ball Sort Halloween",
    image: '../assets/img/img-up/ball-sort-halloween.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: '8-ball-billiards-classic',
    name: "8 Ball Billiards Classic",
    image: '../assets/img/img-up/8-ball-billiards-classic.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'adam-and-eve-51',
    name: "Adam And Eve 51",
    image: '../assets/img/img-up/adam-and-eve-51.png',
    categories: ['arcade', 'casual']
  },
  {
    id: '1010-deluxe',
    name: "1010 Deluxe",
    image: '../assets/img/img-up/1010-deluxe.png',
    categories: ['arcade', 'casual']
  },
  {
    id: '2048-hexa-merge-block',
    name: "2048 Hexa Merge Block",
    image: '../assets/img/img-up/2048-hexa-merge-block.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'adam-and-eve-7',
    name: "Adam And Eve 7",
    image: '../assets/img/img-up/adam-and-eve-7.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'adam-and-eve-52',
    name: "Adam And Eve 52",
    image: '../assets/img/img-up/adam-and-eve-52.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'basketball-stars',
    name: "Basketball Stars",
    image: '../assets/img/img-up/basketball-stars.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'basketball-line',
    name: "Basketball Line",
    image: '../assets/img/img-up/basketball-line.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'basket-champs',
    name: "Basket Champs",
    image: '../assets/img/img-up/basket-champs.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'ballistic',
    name: "Ballistic",
    image: '../assets/img/img-up/ballistic.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'big-tower-tiny-square',
    name: "Big Tower Tiny Square",
    image: '../assets/img/img-up/big-tower-tiny-square.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'biker-street',
    name: "Biker Street",
    image: '../assets/img/img-up/biker-street.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'bubble-pop-adventures',
    name: "Bubble Pop Adventures",
    image: '../assets/img/img-up/bubble-pop-adventures.png',
    categories: ['adventure', 'casual']
  },
  {
    id: 'basketball-legends-2020',
    name: "Basketball Legends 2020",
    image: '../assets/img/img-up/basketball-legends-2020.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'bottle-flip',
    name: "Bottle Flip",
    image: '../assets/img/img-up/bottle-flip.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'bomb-it-6',
    name: "Bomb It 6",
    image: '../assets/img/img-up/bomb-it-6.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'bubble-tower-3-d',
    name: "Bubble Tower 3 D",
    image: '../assets/img/img-up/bubble-tower-3-d.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'blumgi-slime',
    name: "Blumgi Slime",
    image: '../assets/img/img-up/blumgi-slime.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'car-rush',
    name: "Car Rush",
    image: '../assets/img/img-up/car-rush.png',
    categories: ['racing', 'casual']
  },
  {
    id: 'checkers-legend',
    name: "Checkers Legend",
    image: '../assets/img/img-up/checkers-legend.png',
    categories: ['board', 'casual']
  },
  {
    id: 'bouncy-woods',
    name: "Bouncy Woods",
    image: '../assets/img/img-up/bouncy-woods.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'chicken-merge',
    name: "Chicken Merge",
    image: '../assets/img/img-up/chicken-merge.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'circlo-o',
    name: "Circlo O",
    image: '../assets/img/img-up/circlo-o.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'clicker-heroes',
    name: "Clicker Heroes",
    image: '../assets/img/img-up/clicker-heroes.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'clash-of-tanks',
    name: "Clash Of Tanks",
    image: '../assets/img/img-up/clash-of-tanks.png',
    categories: ['action', 'casual']
  },
  {
    id: 'circlo-o-2',
    name: "Circlo O 2",
    image: '../assets/img/img-up/circlo-o-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'climb-over-it',
    name: "Climb Over It",
    image: '../assets/img/img-up/climb-over-it.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'dinosaurs-merge-master',
    name: "Dinosaurs Merge Master",
    image: '../assets/img/img-up/dinosaurs-merge-master.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'crazy-cars',
    name: "Crazy Cars",
    image: '../assets/img/img-up/crazy-cars.png',
    categories: ['racing', 'casual']
  },
  {
    id: 'cursed-treasure-2',
    name: "Cursed Treasure 2",
    image: '../assets/img/img-up/cursed-treasure-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'crossy-road',
    name: "Crossy Road",
    image: '../assets/img/img-up/crossy-road.png',
    categories: ['racing', 'casual']
  },
  {
    id: 'cubefield',
    name: "Cubefield",
    image: '../assets/img/img-up/cubefield.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'dead-again',
    name: "Dead Again",
    image: '../assets/img/img-up/dead-again.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'dino-bros',
    name: "Dino Bros",
    image: '../assets/img/img-up/dino-bros.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'down-the-hill',
    name: "Down The Hill",
    image: '../assets/img/img-up/down-the-hill.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'eggy-car',
    name: "Eggy Car",
    image: '../assets/img/img-up/eggy-car.png',
    categories: ['racing', 'casual']
  },
  {
    id: 'endless-truck',
    name: "Endless Truck",
    image: '../assets/img/img-up/endless-truck.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'fnaf',
    name: "FNAF",
    image: '../assets/img/img-up/fnaf.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'farm-match-seasons',
    name: "Farm Match Seasons",
    image: '../assets/img/img-up/farm-match-seasons.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'fishing-and-lines',
    name: "Fishing And Lines",
    image: '../assets/img/img-up/fishing-and-lines.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'fishing-frenzy',
    name: "Fishing Frenzy",
    image: '../assets/img/img-up/fishing-frenzy.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'g-switch',
    name: "G Switch",
    image: '../assets/img/img-up/g-switch.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'football-brawl',
    name: "Football Brawl",
    image: '../assets/img/img-up/football-brawl.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'football-legends',
    name: "Football Legends",
    image: '../assets/img/img-up/football-legends.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'football-strike',
    name: "Football Strike",
    image: '../assets/img/img-up/football-strike.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'g-switch-2',
    name: "G Switch 2",
    image: '../assets/img/img-up/g-switch-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'football-masters',
    name: "Football Masters",
    image: '../assets/img/img-up/football-masters.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'fruita-crush',
    name: "Fruita Crush",
    image: '../assets/img/img-up/fruita-crush.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'geometry-dash',
    name: "Geometry Dash",
    image: '../assets/img/img-up/geometry-dash.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'g-switch-4',
    name: "G Switch 4",
    image: '../assets/img/img-up/g-switch-4.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'g-switch-3',
    name: "G Switch 3",
    image: '../assets/img/img-up/g-switch-3.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'geometry-jump',
    name: "Geometry Jump",
    image: '../assets/img/img-up/geometry-jump.png',
    categories: ['adventure', 'casual']
  },
  {
    id: 'get-on-top',
    name: "Get On Top",
    image: '../assets/img/img-up/get-on-top.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'cookie-clicker-2',
    name: "Cookie Clicker 2",
    image: '../assets/img/img-up/cookie-clicker-2.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'getting-over-it',
    name: "Getting Over It",
    image: '../assets/img/img-up/getting-over-it.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'head-soccer-2023',
    name: "Head Soccer 2023",
    image: '../assets/img/img-up/head-soccer-2023.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'gobdun',
    name: "Gobdun",
    image: '../assets/img/img-up/gobdun.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'hanger',
    name: "Hanger",
    image: '../assets/img/img-up/hanger.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'guess-the-kitty',
    name: "Guess The Kitty",
    image: '../assets/img/img-up/guess-the-kitty.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'groovy-ski',
    name: "Groovy Ski",
    image: '../assets/img/img-up/groovy-ski.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'happy-fishing',
    name: "Happy Fishing",
    image: '../assets/img/img-up/happy-fishing.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'hoop-royale',
    name: "Hoop Royale",
    image: '../assets/img/img-up/hoop-royale.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'hide-and-smash',
    name: "Hide And Smash",
    image: '../assets/img/img-up/hide-and-smash.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'heads-arena-soccer-all-stars',
    name: "Heads Arena Soccer All Stars",
    image: '../assets/img/img-up/heads-arena-soccer-all-stars.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'icy-purple-head-3',
    name: "Icy Purple Head 3",
    image: '../assets/img/img-up/icy-purple-head-3.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'icy-purple-head-2',
    name: "Icy Purple Head 2",
    image: '../assets/img/img-up/icy-purple-head-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'idle-mining-empire',
    name: "Idle Mining Empire",
    image: '../assets/img/img-up/idle-mining-empire.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'hop-pop-it',
    name: "Hop Pop It",
    image: '../assets/img/img-up/hop-pop-it.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'idle-restaurants',
    name: "Idle Restaurants",
    image: '../assets/img/img-up/idle-restaurants.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'infinite-soccer',
    name: "Infinite Soccer",
    image: '../assets/img/img-up/infinite-soccer.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'jewels-blitz-5',
    name: "Jewels Blitz 5",
    image: '../assets/img/img-up/jewels-blitz-5.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'iron-snout',
    name: "Iron Snout",
    image: '../assets/img/img-up/iron-snout.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'linebacker-alley-2',
    name: "Linebacker Alley 2",
    image: '../assets/img/img-up/linebacker-alley-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'marbles-sorting',
    name: "Marbles Sorting",
    image: '../assets/img/img-up/marbles-sorting.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'minecraft-case-simulator',
    name: "Minecraft Case Simulator",
    image: '../assets/img/img-up/minecraft-case-simulator.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'little-alchemy-2',
    name: "Little Alchemy 2",
    image: '../assets/img/img-up/little-alchemy-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'money-movers',
    name: "Money Movers",
    image: '../assets/img/img-up/money-movers.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'mr-bullet',
    name: "Mr Bullet",
    image: '../assets/img/img-up/mr-bullet.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'money-movers-3',
    name: "Money Movers 3",
    image: '../assets/img/img-up/money-movers-3.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'mergest-kingdom',
    name: "Mergest Kingdom",
    image: '../assets/img/img-up/mergest-kingdom.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'money-movers-2',
    name: "Money Movers 2",
    image: '../assets/img/img-up/money-movers-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'mr-bullet-3-d',
    name: "Mr Bullet 3 D",
    image: '../assets/img/img-up/mr-bullet-3-d.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'moving-truck',
    name: "Moving Truck",
    image: '../assets/img/img-up/moving-truck.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'mutazone',
    name: "Mutazone",
    image: '../assets/img/img-up/mutazone.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'ninja-cat-exploit',
    name: "Ninja Cat Exploit",
    image: '../assets/img/img-up/ninja-cat-exploit.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'ov-o',
    name: "Ov O",
    image: '../assets/img/img-up/ov-o.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'parking-fury',
    name: "Parking Fury",
    image: '../assets/img/img-up/parking-fury.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'ov-o-2',
    name: "Ov O 2",
    image: '../assets/img/img-up/ov-o-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'papa-cherry-saga',
    name: "Papa Cherry Saga",
    image: '../assets/img/img-up/papa-cherry-saga.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'park-out',
    name: "Park Out",
    image: '../assets/img/img-up/park-out.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'parking-fury-3',
    name: "Parking Fury 3",
    image: '../assets/img/img-up/parking-fury-3.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'parking-fury-2',
    name: "Parking Fury 2",
    image: '../assets/img/img-up/parking-fury-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'pizza-tower',
    name: "Pizza Tower",
    image: '../assets/img/img-up/pizza-tower.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'pou',
    name: "Pou",
    image: '../assets/img/img-up/pou.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'penalty-kick-online',
    name: "Penalty Kick Online",
    image: '../assets/img/img-up/penalty-kick-online.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'penalty-shooters-3',
    name: "Penalty Shooters 3",
    image: '../assets/img/img-up/penalty-shooters-3.png',
    categories: ['action', 'casual']
  },
  {
    id: 'pixel-smash-duel',
    name: "Pixel Smash Duel",
    image: '../assets/img/img-up/pixel-smash-duel.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'rabbit-samurai-2',
    name: "Rabbit Samurai 2",
    image: '../assets/img/img-up/rabbit-samurai-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'pudding-monsters',
    name: "Pudding Monsters",
    image: '../assets/img/img-up/pudding-monsters.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'poly-art-3-d',
    name: "Poly Art 3 D",
    image: '../assets/img/img-up/poly-art-3-d.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'racing-monster-trucks',
    name: "Racing Monster Trucks",
    image: '../assets/img/img-up/racing-monster-trucks.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'raft-wars',
    name: "Raft Wars",
    image: '../assets/img/img-up/raft-wars.png',
    categories: ['action', 'casual']
  },
  {
    id: 'slope-game',
    name: "Slope Game",
    image: '../assets/img/img-up/slope-game.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'roper',
    name: "Roper",
    image: '../assets/img/img-up/roper.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'run-3-space',
    name: "Run 3 Space",
    image: '../assets/img/img-up/run-3-space.png',
    categories: ['adventure', 'casual']
  },
  {
    id: 'scary-maze',
    name: "Scary Maze",
    image: '../assets/img/img-up/scary-maze.png',
    categories: ['racing', 'horror', 'casual']
  },
  {
    id: 'rusher-crusher',
    name: "Rusher Crusher",
    image: '../assets/img/img-up/rusher-crusher.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'soccer-heads',
    name: "Soccer Heads",
    image: '../assets/img/img-up/soccer-heads.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'sling-tomb',
    name: "Sling Tomb",
    image: '../assets/img/img-up/sling-tomb.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'space-bar-clicker',
    name: "Space Bar Clicker",
    image: '../assets/img/img-up/space-bar-clicker.png',
    categories: ['simulation', 'casual']
  },
  {
    id: 'solitaire-classic',
    name: "Solitaire Classic",
    image: '../assets/img/img-up/solitaire-classic.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'soccer-masters-euro-2020',
    name: "Soccer Masters Euro 2020",
    image: '../assets/img/img-up/soccer-masters-euro-2020.png',
    categories: ['sports', 'casual']
  },
  {
    id: 'spider-solitaire',
    name: "Spider Solitaire",
    image: '../assets/img/img-up/spider-solitaire.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'stick-merge',
    name: "Stick Merge",
    image: '../assets/img/img-up/stick-merge.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'stick-merge-2',
    name: "Stick Merge 2",
    image: '../assets/img/img-up/stick-merge-2.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'subway-surfers',
    name: "Subway Surfers",
    image: '../assets/img/img-up/subway-surfers.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'sudoku',
    name: "Sudoku",
    image: '../assets/img/img-up/sudoku.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'super-mario-wonder',
    name: "Super Mario Wonder",
    image: '../assets/img/img-up/super-mario-wonder.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'swingo',
    name: "Swingo",
    image: '../assets/img/img-up/swingo.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'tag',
    name: "Tag",
    image: '../assets/img/img-up/tag.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'tap-tap-shots',
    name: "Tap Tap Shots",
    image: '../assets/img/img-up/tap-tap-shots.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'tank-trouble',
    name: "Tank Trouble",
    image: '../assets/img/img-up/tank-trouble.png',
    categories: ['action', 'casual']
  },
  {
    id: 'tiny-fishing',
    name: "Tiny Fishing",
    image: '../assets/img/img-up/tiny-fishing.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'timber-guy',
    name: "Timber Guy",
    image: '../assets/img/img-up/timber-guy.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'tunnel-rush-2',
    name: "Tunnel Rush 2",
    image: '../assets/img/img-up/tunnel-rush-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'traffic-control',
    name: "Traffic Control",
    image: '../assets/img/img-up/traffic-control.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'turn-turn',
    name: "Turn Turn",
    image: '../assets/img/img-up/turn-turn.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'tower-crash-3-d',
    name: "Tower Crash 3 D",
    image: '../assets/img/img-up/tower-crash-3-d.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'vex-8',
    name: "Vex 8",
    image: '../assets/img/img-up/vex-8.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'vex-7',
    name: "Vex 7",
    image: '../assets/img/img-up/vex-7.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'tropical-merge',
    name: "Tropical Merge",
    image: '../assets/img/img-up/tropical-merge.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'wheelie-bike',
    name: "Wheelie Bike",
    image: '../assets/img/img-up/wheelie-bike.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wheelie-bike-2',
    name: "Wheelie Bike 2",
    image: '../assets/img/img-up/wheelie-bike-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wheely-2',
    name: "Wheely 2",
    image: '../assets/img/img-up/wheely-2.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wheely-6',
    name: "Wheely 6",
    image: '../assets/img/img-up/wheely-6.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wheely-3',
    name: "Wheely 3",
    image: '../assets/img/img-up/wheely-3.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wheely-4',
    name: "Wheely 4",
    image: '../assets/img/img-up/wheely-4.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wheely-5',
    name: "Wheely 5",
    image: '../assets/img/img-up/wheely-5.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wheely-7',
    name: "Wheely 7",
    image: '../assets/img/img-up/wheely-7.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wiggle',
    name: "Wiggle",
    image: '../assets/img/img-up/wiggle.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'woodventure',
    name: "Woodventure",
    image: '../assets/img/img-up/woodventure.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'word-slide',
    name: "Word Slide",
    image: '../assets/img/img-up/word-slide.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'wood-block-puzzle',
    name: "Wood Block Puzzle",
    image: '../assets/img/img-up/wood-block-puzzle.png',
    categories: ['puzzle', 'casual']
  },
  {
    id: 'wordle-unlimited',
    name: "Wordle Unlimited",
    image: '../assets/img/img-up/wordle-unlimited.png',
    categories: ['arcade', 'casual']
  },
  {
    id: 'worlds-hardest-game',
    name: "Worlds Hardest Game",
    image: '../assets/img/img-up/worlds-hardest-game.png',
    categories: ['arcade', 'casual']
  }
];

// Hàm tạo HTML cho một trò chơi
function createGameElement(game) {
  const href = game.url || `../game/${game.id}.html`;
  const img = game.image || '';
  return `
    <a class="game-item" href="${href}">
      <img src="${img}" alt="${game.name}" loading="lazy" />
      <span>${game.name}</span>
    </a>
  `;
}

// Catalog pagination — full rows based on grid width
const CATALOG_ROWS = 8;
let _catalogList = null;
let _catalogPage = 1;

function columnsInCatalogGrid() {
  const el = document.getElementById('game-list');
  if (!el || !el.clientWidth) return 6;
  const min = 100;
  const gap = 10;
  return Math.max(4, Math.floor((el.clientWidth + gap) / (min + gap)));
}

function catalogPerPage() {
  return columnsInCatalogGrid() * CATALOG_ROWS;
}

function isCatalogPage() {
  return !!document.querySelector('.mm-catalog-section[data-mm-catalog]');
}

// Hàm hiển thị danh sách trò chơi với phân trang
function displayGames(gameList = games, page = 1, gamesPerPage) {
  const gameListContainer = document.getElementById('game-list');
  if (!gameListContainer) return;

  if (gamesPerPage == null) {
    gamesPerPage = isCatalogPage() ? catalogPerPage() : 24;
  }

  if (document.querySelector('.mm-catalog-section')) {
    gameListContainer.classList.add('games-grid--compact');
  }

  const startIndex = (page - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const paginatedGames = gameList.slice(startIndex, endIndex);

  gameListContainer.innerHTML = paginatedGames.map(game => createGameElement(game)).join('');

  createPagination(gameList.length, page, gamesPerPage);
}

// Hàm tạo phân trang
function createPagination(totalGames, currentPage, gamesPerPage) {
  const totalPages = Math.ceil(totalGames / gamesPerPage);
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;

  let paginationHTML = '';
  
  // Nút Previous
  paginationHTML += `
    <button class="pagination-btn" 
            ${currentPage === 1 ? 'disabled' : ''} 
            onclick="changePage(${currentPage - 1})">
      <i class="fas fa-chevron-left"></i>
    </button>
  `;

  // Các nút số trang
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `
      <button class="pagination-btn" onclick="changePage(1)">1</button>
      ${startPage > 2 ? '<span class="pagination-dots">...</span>' : ''}
    `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
              onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    paginationHTML += `
      ${endPage < totalPages - 1 ? '<span class="pagination-dots">...</span>' : ''}
      <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
    `;
  }

  // Nút Next
  paginationHTML += `
    <button class="pagination-btn" 
            ${currentPage === totalPages ? 'disabled' : ''} 
            onclick="changePage(${currentPage + 1})">
      <i class="fas fa-chevron-right"></i>
    </button>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

// Hàm chuyển trang
function changePage(page) {
  applyFilters(page);
}

// WG category list (matches footer chips)
const WG_CATEGORIES = [
  'Puzzles', 'Casual', 'Arcade', 'Action', 'Simulation', 'Card & Board',
  'Adventure', 'Dress-up and Fashion', 'Art', 'Beauty', 'Cars', '2Players',
  'Strategy', 'Sports', 'Platformer', 'Educational', 'Multiplayer',
  'Military & War', 'Horror', 'Cooking & Food', 'Quiz & Trivia', 'Fantasy',
  'Role-Playing (RPG)', 'Mystery', 'Sandbox', 'Airplane', 'Real-Time Tactics',
  'Rhythm (Dance & Music)', 'Pet & Animal', 'Social', 'Politics & Government',
];

const CAT_ICONS = {
  Puzzles: 'fa-puzzle-piece', Casual: 'fa-dice', Arcade: 'fa-gamepad', Action: 'fa-person-running',
  Simulation: 'fa-vr-cardboard', 'Card & Board': 'fa-chess-board', Adventure: 'fa-mountain-sun',
  'Dress-up and Fashion': 'fa-shirt', Art: 'fa-palette', Beauty: 'fa-wand-magic-sparkles',
  Cars: 'fa-car-side', '2Players': 'fa-user-group', Strategy: 'fa-chess', Sports: 'fa-futbol',
  Platformer: 'fa-shoe-prints', Educational: 'fa-graduation-cap', Multiplayer: 'fa-users',
  'Military & War': 'fa-jet-fighter', Horror: 'fa-ghost', 'Cooking & Food': 'fa-utensils',
  'Quiz & Trivia': 'fa-circle-question', Fantasy: 'fa-hat-wizard', 'Role-Playing (RPG)': 'fa-dragon',
  Mystery: 'fa-magnifying-glass', Sandbox: 'fa-cubes', Airplane: 'fa-plane',
  'Real-Time Tactics': 'fa-chess-knight', 'Rhythm (Dance & Music)': 'fa-music',
  'Pet & Animal': 'fa-paw', Social: 'fa-comments', 'Politics & Government': 'fa-landmark',
};

function getPopularityRank() {
  const rank = {};
  let i = 0;
  const featured = (typeof window !== 'undefined' && window.MM_FEATURED) || {};
  ['trending', 'new', 'topRated', 'picks'].forEach((key) => {
    (featured[key] || []).forEach((id) => {
      if (id && rank[id] === undefined) rank[id] = i++;
    });
  });
  if (i > 0) return rank;

  const data = window.__WG_GRIDS_HOME__ || {};
  ['trending', 'new', 'topRated'].forEach((key) => {
    (data[key] || []).forEach((g) => {
      if (g.id && rank[g.id] === undefined) rank[g.id] = i++;
    });
  });
  return rank;
}

function matchesCategory(game, category) {
  if (!category || category === 'all') return true;
  const catLower = category.toLowerCase();
  if ((game.wgCategories || []).some((c) => c.toLowerCase() === catLower)) return true;
  if ((game.categories || []).some((c) => c.toLowerCase() === catLower)) return true;
  return false;
}

function renderCategoryChips(activeCat = 'all') {
  const container = document.getElementById('category-filters');
  if (!container || container.dataset.dynamic !== '1') return;

  let html = `<button type="button" class="mm-cat-chip category-btn${activeCat === 'all' ? ' active' : ''}" data-category="all"><i class="fas fa-border-all"></i>All</button>`;
  WG_CATEGORIES.forEach((cat) => {
    const active = activeCat.toLowerCase() === cat.toLowerCase() ? ' active' : '';
    const icon = CAT_ICONS[cat] || 'fa-tag';
    html += `<button type="button" class="mm-cat-chip category-btn${active}" data-category="${cat.replace(/"/g, '&quot;')}"><i class="fas ${icon}"></i>${cat}</button>`;
  });
  container.innerHTML = html;
}

function setCategoryInUrl(cat) {
  const url = new URL(window.location.href);
  if (!cat || cat === 'all') url.searchParams.delete('cat');
  else url.searchParams.set('cat', cat);
  window.history.replaceState({}, '', url);
}

function getActiveCategoryFromUI() {
  const btn = document.querySelector('.category-btn.active');
  return btn ? btn.dataset.category : 'all';
}

function applyFilters(page = 1) {
  const searchTerm = document.getElementById('game-search')?.value?.trim() || '';
  const category = getActiveCategoryFromUI();
  const sortValue = document.getElementById('sort-select')?.value || 'popular';
  let filteredGames = filterGames(searchTerm, category);
  filteredGames = sortGames(filteredGames, sortValue);
  if (isCatalogPage()) {
    _catalogList = filteredGames;
    _catalogPage = page;
  }
  displayGames(filteredGames, page);
}

function bindCatalogResize() {
  if (!isCatalogPage()) return;
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (_catalogList) applyFilters(_catalogPage);
    }, 200);
  });
}

function getAllGames() {
  const hidden = new Set(
    (typeof window !== 'undefined' && Array.isArray(window.MM_HIDDEN))
      ? window.MM_HIDDEN
      : []
  );
  if (typeof window !== 'undefined' && window.MM_CLASSIC_ONLY && window.MM_CLASSIC_GAMES) {
    return window.MM_CLASSIC_GAMES
      .filter((g) => g && g.id && !hidden.has(g.id))
      .map((g) => ({
        ...g,
        image: g.image && g.image.indexOf('/') === 0 ? '..' + g.image : g.image,
        url: g.url || '../game/' + g.id + '.html',
      }));
  }
  const wg = (typeof window !== 'undefined' && window.WG_GAMES) ? window.WG_GAMES : [];
  return games.concat(wg).filter((g) => g && g.id && !hidden.has(g.id));
}

// Hàm lọc game theo từ khóa và danh mục
function filterGames(searchTerm = '', category = 'all') {
  let filtered = getAllGames();

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((game) =>
      game.name.toLowerCase().includes(term) ||
      (game.categories || []).some((cat) => cat.toLowerCase().includes(term)) ||
      (game.wgCategories || []).some((cat) => cat.toLowerCase().includes(term))
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((game) => matchesCategory(game, category));
  }

  return filtered;
}

function sortGames(gameList, sortValue = 'popular') {
  if (sortValue === 'popular') {
    const rank = getPopularityRank();
    return [...gameList].sort((a, b) => {
      const ra = rank[a.id] !== undefined ? rank[a.id] : 9999;
      const rb = rank[b.id] !== undefined ? rank[b.id] : 9999;
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name);
    });
  }

  if (sortValue === 'category') {
    return [...gameList].sort((a, b) => {
      const ca = (a.wgCategories && a.wgCategories[0]) || (a.categories && a.categories[0]) || '';
      const cb = (b.wgCategories && b.wgCategories[0]) || (b.categories && b.categories[0]) || '';
      return ca.localeCompare(cb) || a.name.localeCompare(b.name);
    });
  }

  const parts = sortValue.split('-');
  const sortBy = parts[0];
  const order = parts[1] || 'asc';

  return [...gameList].sort((a, b) => {
    let compareA = a[sortBy]?.toLowerCase?.() || a[sortBy] || '';
    let compareB = b[sortBy]?.toLowerCase?.() || b[sortBy] || '';

    if (order === 'desc') {
      [compareA, compareB] = [compareB, compareA];
    }

    return String(compareA).localeCompare(String(compareB));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const wgCat = params.get('cat');
  const qParam = params.get('q') || '';
  let initialCat = wgCat || 'all';

  if (window.MM_CLASSIC_ONLY && window.MM_CLASSIC_GAMES) {
    const initialList = window.MM_CLASSIC_GAMES.map((g) => ({
      ...g,
      image: g.image && g.image.indexOf('/') === 0 ? '..' + g.image : g.image,
    }));
    const title = document.querySelector('.page-title');
    if (title) title.textContent = 'Classic Browser Games';
    displayGames(initialList);
    bindGameListControls();
    return;
  }

  renderCategoryChips(initialCat);

  const searchInputEarly = document.getElementById('game-search');
  if (searchInputEarly && qParam) {
    searchInputEarly.value = qParam;
  }

  let initialList = getAllGames();
  if (wgCat) {
    initialList = initialList.filter((game) => matchesCategory(game, wgCat));
    const title = document.querySelector('.page-title');
    if (title) title.textContent = `${wgCat} Games`;
  }
  if (qParam) {
    initialList = filterGames(qParam, wgCat || 'all');
    const title = document.querySelector('.page-title, .mm-catalog-hero h1, h1');
    if (title && !wgCat) title.textContent = `Search: ${qParam}`;
  }

  const sortSelect = document.getElementById('sort-select');
  const sortValue = sortSelect ? sortSelect.value : 'popular';
  initialList = sortGames(initialList, sortValue);
  if (isCatalogPage()) {
    _catalogList = initialList;
    _catalogPage = 1;
  }
  displayGames(initialList);

  bindGameListControls();
  bindCatalogResize();
});

function bindGameListControls() {
  const searchInput = document.getElementById('game-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => applyFilters(1), 300);
    });
  }

  const categoryContainer = document.getElementById('category-filters');
  if (categoryContainer) {
    categoryContainer.addEventListener('click', (e) => {
      const button = e.target.closest('.category-btn');
      if (!button) return;
      categoryContainer.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const category = button.dataset.category;
      setCategoryInUrl(category);
      const title = document.querySelector('.page-title');
      if (title && categoryContainer.dataset.dynamic === '1') {
        title.textContent = category === 'all' ? 'All Games' : `${category} Games`;
      }
      applyFilters(1);
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => applyFilters(1));
  }

  const surpriseBtn = document.getElementById('mm-surprise-btn');
  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = getActiveCategoryFromUI();
      if (typeof window.MM_SURPRISE_ME === 'function') {
        window.MM_SURPRISE_ME(cat === 'all' ? null : cat);
      }
    });
  }
}

// Export classic games for homepage rails and /category/classic.html
if (typeof window !== 'undefined') {
  window.MM_CLASSIC_GAMES = games.map((g) => ({
    id: g.id,
    name: g.name,
    image: (g.image || '').replace(/^\.\.\//, '/'),
    url: '/game/' + g.id + '.html',
    categories: g.categories || [],
    c: '#6366f1',
  }));
}