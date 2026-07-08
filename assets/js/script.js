// App State Management
const AppState = {
  games: [],
  categories: [],
  currentCategory: null,
  searchTerm: '',
  isLoading: false,
  error: null,
  initialized: false
};

// UI Components
class UI {
  static elements = {
    searchInput: document.getElementById('searchInput'),
    featuredGames: document.getElementById('featuredGames'),
    newGames: document.getElementById('newGames'),
    heroGames: document.querySelector('.hero-games'),
    gamesGrid: document.querySelector('.games-grid')
  };

  static init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
  }

  static setupEventListeners() {
    // Search Input
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', this.debounce((e) => {
        AppState.searchTerm = e.target.value.toLowerCase();
        GameManager.filterGames();
      }, 300));
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  static setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe game cards and category cards
    document.querySelectorAll('.game-card, .category-card').forEach(el => {
      observer.observe(el);
    });
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static showLoading() {
    AppState.isLoading = true;
    // Add loading UI logic
  }

  static hideLoading() {
    AppState.isLoading = false;
    // Remove loading UI logic
  }

  static showError(message) {
    AppState.error = message;
    // Show error UI logic
  }
}

// Game Management
class GameManager {
  static async init() {
    if (AppState.initialized) {
      return;
    }

    try {
      UI.showLoading();
      await this.loadGames();
      this.setupGameItems();
      UI.hideLoading();
      AppState.initialized = true;
    } catch (error) {
      UI.showError('Failed to load games');
      console.error('Error initializing games:', error);
    }
  }

  static async loadGames() {
    // Get games from the DOM
    const gameItems = document.querySelectorAll('.game-item');
    AppState.games = Array.from(gameItems).map(item => ({
      id: item.getAttribute('href'),
      title: item.querySelector('span').textContent,
      image: item.querySelector('img').getAttribute('src'),
      href: item.getAttribute('href')
    }));

    // Cache the games in localStorage
    try {
      localStorage.setItem('cachedGames', JSON.stringify(AppState.games));
    } catch (e) {
      console.warn('Failed to cache games:', e);
    }
  }

  static setupGameItems() {
    const gameItems = document.querySelectorAll('.game-item');
    gameItems.forEach(item => {
      // Remove existing click listeners
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      // Add click listener
      newItem.addEventListener('click', (e) => {
        const href = newItem.getAttribute('href');
        if (href) {
          e.preventDefault();
          window.location.href = href;
        }
      });
    });
  }

  static renderGames(games = AppState.games) {
    if (!UI.elements.gamesGrid) return;

    const gameElements = games.map(game => `
      <a class="game-item" href="${game.href}">
        <img src="${game.image}" alt="${game.title}" />
        <span>${game.title}</span>
      </a>
    `).join('');

    // Find the position to insert games (after game-frame-container)
    const gameFrame = UI.elements.gamesGrid.querySelector('.game-frame-container');
    if (gameFrame) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = gameElements;
      
      // Insert each game element after the game frame
      Array.from(tempDiv.children).reverse().forEach(element => {
        gameFrame.insertAdjacentElement('afterend', element);
      });
    }
  }

  static filterGames() {
    if (!AppState.searchTerm) {
      this.renderGames(AppState.games);
      return;
    }

    const filtered = AppState.games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(AppState.searchTerm);
      const matchesCategory = !AppState.currentCategory || game.category === AppState.currentCategory;
      return matchesSearch && matchesCategory;
    });

    this.renderGames(filtered);
  }

  static restoreFromCache() {
    try {
      const cached = localStorage.getItem('cachedGames');
      if (cached) {
        AppState.games = JSON.parse(cached);
        return true;
      }
    } catch (e) {
      console.warn('Failed to restore from cache:', e);
    }
    return false;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  
  // Try to restore from cache first
  if (GameManager.restoreFromCache()) {
    GameManager.renderGames();
  }
  
  // Then initialize fresh data
  GameManager.init();
});
