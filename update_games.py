import os
import re
from bs4 import BeautifulSoup

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
    <iframe src="{game_path}" allowfullscreen id="game-frame" style="display: none;"></iframe>
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
</div>
<div class="game-frame-title">{game_name}</div>'''

def update_game_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Find existing game frame container
    game_frame = soup.find('div', class_='game-frame-container')
    if not game_frame:
        print(f"No game frame found in {file_path}")
        return
    
    # Get game info
    iframe = game_frame.find('iframe')
    if not iframe:
        print(f"No iframe found in {file_path}")
        return
        
    game_path = iframe.get('src', '')
    
    # Get game name from title
    title_tag = soup.find('title')
    game_name = title_tag.text.split('-')[0].strip() if title_tag else os.path.splitext(os.path.basename(file_path))[0].replace('-', ' ').title()
    
    # Get image name from file name
    image_name = os.path.splitext(os.path.basename(file_path))[0]
    
    # Create new game frame HTML
    new_frame_html = get_game_frame_template(game_name, game_path, image_name)
    
    # Replace old frame with new one
    old_frame_section = content.split('<!-- Game Frame Container -->')[1].split('<!-- Related Games -->')[0]
    new_content = content.replace(old_frame_section, '\n' + new_frame_html + '\n\n      <!-- Related Games -->')
    
    # Save updated file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {file_path}")

def main():
    game_dir = 'game'
    for filename in os.listdir(game_dir):
        if filename.endswith('.html'):
            file_path = os.path.join(game_dir, filename)
            update_game_file(file_path)

if __name__ == '__main__':
    main() 