import os
from bs4 import BeautifulSoup
import re

def get_game_frame_template(game_name, game_path, image_name):
    return f'''<!-- Game Frame Container -->
<div class="game-frame-container">
    <div class="game-thumbnail">
        <img src="../assets/img/img-up/{image_name}.png" alt="{game_name}" />
        <button class="play-frame-button" id="playGameButton">
            <i class="fas fa-play"></i>
            Play Game
        </button>
    </div>
    <iframe data-src="{game_path}" allowfullscreen id="game-frame" style="display: none;"></iframe>
    <div class="game-controls">
        <button class="control-btn" id="share-btn" title="Share">
            <i class="fas fa-share-alt"></i>
        </button>
        <button class="control-btn" id="fullscreen-btn" title="Fullscreen">
            <i class="fas fa-expand"></i>
        </button>
    </div>
    <div class="share-menu" id="share-menu">
        <button class="control-btn" id="copy-link-btn" title="Copy Link">
            <i class="fas fa-link"></i>
        </button>
        <button class="control-btn" id="facebook-btn" title="Share on Facebook">
            <i class="fab fa-facebook-f"></i>
        </button>
        <button class="control-btn" id="twitter-btn" title="Share on Twitter">
            <i class="fab fa-twitter"></i>
        </button>
        <button class="control-btn" id="pinterest-btn" title="Share on Pinterest">
            <i class="fab fa-pinterest-p"></i>
        </button>
    </div>
    <div class="game-frame-title">{game_name}</div>
    <div class="loading-overlay" style="display: none;">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading Game...</div>
    </div>
</div>'''

def get_game_controls_js():
    return '''// Game controls functionality
document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.querySelector('.game-frame-container');
    const gameFrame = document.getElementById('game-frame');
    const playButton = document.getElementById('playGameButton');
    const thumbnail = document.querySelector('.game-thumbnail');
    const shareButton = document.getElementById('share-btn');
    const shareMenu = document.getElementById('share-menu');
    const fullscreenButton = document.getElementById('fullscreen-btn');
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    // Play button click handler
    playButton.addEventListener('click', function() {
        thumbnail.style.display = 'none';
        loadingOverlay.style.display = 'flex';
        
        // Get the game URL from data-src
        const gameUrl = gameFrame.getAttribute('data-src');
        
        // Set the actual src to load the game
        gameFrame.src = gameUrl;
        
        // Show game frame once loaded
        gameFrame.onload = function() {
            loadingOverlay.style.display = 'none';
            gameFrame.style.display = 'block';
        };
    });

    // Share button functionality
    shareButton.addEventListener('click', function(e) {
        e.stopPropagation();
        shareMenu.classList.toggle('active');
    });

    // Close share menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!shareMenu.contains(e.target) && !shareButton.contains(e.target)) {
            shareMenu.classList.remove('active');
        }
    });

    // Share buttons functionality
    document.getElementById('copy-link-btn').addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    });

    document.getElementById('facebook-btn').addEventListener('click', function() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    });

    document.getElementById('twitter-btn').addEventListener('click', function() {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank');
    });

    document.getElementById('pinterest-btn').addEventListener('click', function() {
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    });

    // Fullscreen functionality
    fullscreenButton.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.msRequestFullscreen) {
                gameContainer.msRequestFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });

    // Update fullscreen button icon when exiting fullscreen via Esc key
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
});'''

def get_game_controls_css():
    return '''/* Loading overlay styles */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(28, 30, 44, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #55bbab;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

.loading-text {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}'''

def update_game_page(file_path):
    print(f"Updating {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Get game name from title
    title_tag = soup.find('title')
    game_name = title_tag.text.split('-')[0].strip() if title_tag else os.path.splitext(os.path.basename(file_path))[0].replace('-', ' ').title()
    
    # Get image name from file name
    image_name = os.path.splitext(os.path.basename(file_path))[0]
    
    # Find game path from existing iframe or construct it
    iframe = soup.find('iframe')
    game_path = iframe.get('src', '') if iframe else f"./game/{image_name}/index.html"
    
    # Create new game frame HTML
    new_frame_html = get_game_frame_template(game_name, game_path, image_name)
    
    # Find the main content section
    main_content = soup.find('section', class_='games-grid')
    if not main_content:
        main_content = soup.find('main', class_='main-content')
    
    if main_content:
        # Remove existing game frame if any
        old_frame = main_content.find('div', class_='game-frame-container')
        if old_frame:
            old_frame.decompose()
        
        # Remove old title if any
        old_title = main_content.find('div', class_='game-frame-title')
        if old_title:
            old_title.decompose()
        
        # Insert new frame at the beginning of main content
        new_frame_soup = BeautifulSoup(new_frame_html, 'html.parser')
        if main_content.contents:
            main_content.contents[0].insert_before(new_frame_soup)
        else:
            main_content.append(new_frame_soup)
    
    # Update script and style tags
    head_tag = soup.find('head')
    if head_tag:
        # Remove existing game-controls.js if present
        for script in soup.find_all('script', src=re.compile(r'game-controls\.js$')):
            script.decompose()
        
        # Add game controls JavaScript
        script_tag = soup.new_tag('script')
        script_tag.string = get_game_controls_js()
        head_tag.append(script_tag)
        
        # Add loading styles
        style_tag = soup.find('style')
        if not style_tag:
            style_tag = soup.new_tag('style')
            head_tag.append(style_tag)
        style_tag.string = (style_tag.string or '') + get_game_controls_css()
    
    # Save the updated file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    
    print(f"Updated {file_path}")

def main():
    game_dir = 'game'
    if not os.path.exists(game_dir):
        print(f"Directory {game_dir} not found!")
        return
    
    # Process all HTML files in the game directory
    for filename in os.listdir(game_dir):
        if filename.endswith('.html'):
            file_path = os.path.join(game_dir, filename)
            update_game_page(file_path)

if __name__ == '__main__':
    main() 