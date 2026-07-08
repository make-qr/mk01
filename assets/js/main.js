// Menu functionality - uses nav-menu and existing menu-overlay
class MenuManager {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.menuOverlay = document.getElementById('menu-overlay');
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.navMenu || !this.menuOverlay) {
      console.warn('Menu elements not found');
      return;
    }
    this.setupMenuToggle();
    this.setupOverlayClick();
    this.setupMenuItemsClick();
    this.setupEscapeKey();
    this.setupResizeHandler();
    this.setupTouchEvents();
  }

  toggleMenu(force = null) {
    const isActive = force !== null ? force : !this.navMenu.classList.contains('active');

    this.navMenu.classList.toggle('active', isActive);
    this.menuOverlay.classList.toggle('active', isActive);
    document.body.classList.toggle('menu-open', isActive);

    const icon = this.menuToggle.querySelector('i');
    if (icon) {
      icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
    }

    if (isActive) {
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  setupMenuToggle() {
    this.menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    }, { passive: false });

    this.menuToggle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.toggleMenu();
    }, { passive: false });
  }

  setupOverlayClick() {
    this.menuOverlay.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu(false);
    });

    this.menuOverlay.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.toggleMenu(false);
    }, { passive: false });
  }

  setupMenuItemsClick() {
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.toggleMenu(false);
        }
      });
    });
  }

  setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
        this.toggleMenu(false);
      }
    });
  }

  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768) {
          this.toggleMenu(false);
        }
      }, 100);
    });
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (this.navMenu.classList.contains('active')) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;

      if (swipeDistance < -50 && this.navMenu.classList.contains('active')) {
        this.toggleMenu(false);
      } else if (swipeDistance > 50 && touchStartX < 30 && !this.navMenu.classList.contains('active')) {
        this.toggleMenu(true);
      }
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new MenuManager();
});
