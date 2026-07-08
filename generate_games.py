import json
import os

def create_game_file(game_data, template_content):
    # Get game info
    title = game_data['title']
    frame_url = game_data['frame_url']
    image_path = game_data['image_path']
    
    # Create filename from title
    filename = title.lower().replace(' ', '-') + '.html'
    
    # Replace content in template
    content = template_content
    content = content.replace('1v1.lol', title)
    content = content.replace('https://games.monkeymart.one/projects/1v1.lol/', frame_url)
    content = content.replace('assets/img/1v1-battle.jpg', image_path)
    
    # Write new game file
    with open(f'game/{filename}', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Created {filename}')

def main():
    # Read template file
    with open('game/1v1-lol.html', 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    # Read games data
    with open('game/games.json', 'r', encoding='utf-8') as f:
        games = json.load(f)
    
    # Create directory if not exists
    os.makedirs('game', exist_ok=True)
    
    # Generate game files
    for game in games:
        create_game_file(game, template_content)

if __name__ == '__main__':
    main() 