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
  const data = window.__WG_GRIDS_HOME__ || {};
  const rank = {};
  let i = 0;
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
  if (typeof window !== 'undefined' && window.MM_CLASSIC_ONLY && window.MM_CLASSIC_GAMES) {
    return window.MM_CLASSIC_GAMES.map((g) => ({
      ...g,
      image: g.image && g.image.indexOf('/') === 0 ? '..' + g.image : g.image,
      url: g.url || '../game/' + g.id + '.html',
    }));
  }
  const wg = (typeof window !== 'undefined' && window.WG_GAMES) ? window.WG_GAMES : [];
  return games.concat(wg);
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

  let initialList = getAllGames();
  if (wgCat) {
    initialList = initialList.filter((game) => matchesCategory(game, wgCat));
    const title = document.querySelector('.page-title');
    if (title) title.textContent = `${wgCat} Games`;
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