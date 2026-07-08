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

// Hàm hiển thị danh sách trò chơi với phân trang
function displayGames(gameList = games, page = 1, gamesPerPage = 24) {
  const gameListContainer = document.getElementById('game-list');
  if (!gameListContainer) return;

  const startIndex = (page - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const paginatedGames = gameList.slice(startIndex, endIndex);
  
  gameListContainer.innerHTML = paginatedGames.map(game => createGameElement(game)).join('');
  
  // Tạo phân trang
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
  const searchTerm = document.getElementById('game-search')?.value || '';
  const activeCategory = document.querySelector('.category-btn.active')?.dataset.category;
  const sortValue = document.getElementById('sort-select')?.value;
  
  let filteredGames = filterGames(searchTerm, activeCategory);
  filteredGames = sortGames(filteredGames, sortValue);
  
  displayGames(filteredGames, page);
}

// Gộp game legacy + WGPlayground
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
  
  // Lọc theo từ khóa
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(game => 
      game.name.toLowerCase().includes(term) ||
      game.categories.some(cat => cat.toLowerCase().includes(term))
    );
  }
  
  // Lọc theo danh mục
  if (category && category !== 'all') {
    filtered = filtered.filter(game => 
      game.categories.includes(category.toLowerCase())
    );
  }
  
  return filtered;
}

// Hàm sắp xếp game
function sortGames(gameList, sortValue = 'name-asc') {
  const [sortBy, order] = sortValue.split('-');
  
  return [...gameList].sort((a, b) => {
    let compareA = a[sortBy]?.toLowerCase() || '';
    let compareB = b[sortBy]?.toLowerCase() || '';
    
    if (order === 'desc') {
      [compareA, compareB] = [compareB, compareA];
    }
    
    return compareA.localeCompare(compareB);
  });
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const wgCat = params.get('cat');
  let initialList = getAllGames();

  if (window.MM_CLASSIC_ONLY && window.MM_CLASSIC_GAMES) {
    initialList = window.MM_CLASSIC_GAMES.map((g) => ({
      ...g,
      image: g.image && g.image.indexOf('/') === 0 ? '..' + g.image : g.image,
    }));
    const title = document.querySelector('.page-title');
    if (title) title.textContent = 'Classic Browser Games';
    displayGames(initialList);
    bindGameListControls();
    return;
  }

  if (wgCat) {
    initialList = initialList.filter((game) => {
      const wg = game.wgCategories || [];
      return wg.some((c) => c.toLowerCase() === wgCat.toLowerCase());
    });
    const title = document.querySelector('.page-title');
    if (title) title.textContent = `${wgCat} Games`;
  }

  displayGames(initialList);
  
  bindGameListControls();
});

function bindGameListControls() {
  const searchInput = document.getElementById('game-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        const activeCategory = document.querySelector('.category-btn.active')?.dataset.category;
        const sortValue = document.getElementById('sort-select')?.value;
        
        let filteredGames = filterGames(searchTerm, activeCategory);
        filteredGames = sortGames(filteredGames, sortValue);
        
        displayGames(filteredGames, 1);
      }, 300);
    });
  }
  
  // Xử lý lọc theo danh mục
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Xóa active class từ tất cả các nút
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Thêm active class cho nút được click
      button.classList.add('active');
      
      const category = button.dataset.category;
      const searchTerm = document.getElementById('game-search')?.value.trim();
      const sortValue = document.getElementById('sort-select')?.value;
      
      let filteredGames = filterGames(searchTerm, category);
      filteredGames = sortGames(filteredGames, sortValue);
      
      displayGames(filteredGames, 1);
    });
  });
  
  // Xử lý sắp xếp
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const searchTerm = document.getElementById('game-search')?.value.trim();
      const activeCategory = document.querySelector('.category-btn.active')?.dataset.category;
      
      let filteredGames = filterGames(searchTerm, activeCategory);
      filteredGames = sortGames(filteredGames, sortSelect.value);
      
      displayGames(filteredGames, 1);
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