#!/usr/bin/env python3
"""Generate / rewrite MonkeyMart Game Guide HTML pages from a shared template.

Usage:
  python3 scripts/new-blog-post.py --list
  python3 scripts/new-blog-post.py --slug slope
  python3 scripts/new-blog-post.py --all-priority
  python3 scripts/new-blog-post.py --name "Slope" --slug slope --game /game/slope.html \\
      --image /assets/img/img-up/slope.png --write
"""
from __future__ import annotations

import argparse
import html
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
TODAY = date.today().isoformat()


def esc(s: str) -> str:
    return html.escape(s or "", quote=True)


PRIORITY_GUIDES: list[dict] = [
    {
        "slug": "slope",
        "name": "Slope",
        "file": "play-slope-online.html",
        "game": "/game/slope.html",
        "image": "/assets/img/img-up/slope.png",
        "category": "Arcade",
        "blurb": "A neon endless runner where you steer a ball down a steep slope that gets faster every second.",
        "why": [
            "Instant browser play with no install.",
            "Simple left/right controls that still reward skill.",
            "Score chasing — each run is a new personal best attempt.",
            "Perfect for short breaks or long focus sessions.",
        ],
        "how": [
            "Open the Slope game page and press Play.",
            "Use A/D or Left/Right to steer the ball.",
            "Stay near the center of the track when speed ramps up.",
            "Lean into turns early — late corrections send you off the edge.",
        ],
        "tips": [
            "Warm up with a few short runs before chasing a high score.",
            "Watch the track ahead, not only the ball.",
            "Avoid red blocks; they end the run on contact.",
            "If you wobble, ease toward the middle instead of oversteering.",
            "Take a break when reactions slow — Slope punishes fatigue.",
        ],
        "controls": "Keyboard: Left/Right or A/D. On mobile, tilt or on-screen controls if available.",
        "faq": [
            ("Is Slope free?", "Yes. Play Slope online free in your browser on Monkey Mart."),
            ("Does Slope work on mobile?", "Yes on modern phones; landscape mode is usually easier."),
            ("Is Slope unblocked?", "You can play Slope on monkeymart.one wherever browser games are allowed."),
        ],
        "related": [
            ("play-snow-rider-3d-online.html", "Snow Rider 3D"),
            ("play-circlo-online.html", "Circlo"),
            ("play-retro-bowl-online.html", "Retro Bowl"),
        ],
    },
    {
        "slug": "monkey-mart",
        "name": "Monkey Mart",
        "file": "play-monkey-mart-online.html",
        "game": "/game/monkey-mart.html",
        "image": "/assets/img/img-up/monkey-mart-2.webp",
        "category": "Simulation",
        "blurb": "An idle supermarket sim where you harvest, stock shelves, hire helper monkeys, and expand your jungle store.",
        "why": [
            "Satisfying loop of gather → stock → sell → upgrade.",
            "Works great for short sessions or AFK progress.",
            "Clear goals: unlock stations, helpers, and new products.",
            "Playable instantly in the browser.",
        ],
        "how": [
            "Start by picking bananas or the first crop near the start area.",
            "Carry goods to empty shelves so customers can buy.",
            "Collect coins and unlock the next station as soon as you can afford it.",
            "Hire helper monkeys so production continues while you explore.",
        ],
        "tips": [
            "Unlock automation early — helpers beat running every shelf yourself.",
            "Keep shelves stocked; empty shelves mean lost sales.",
            "Expand one area at a time instead of spreading coins thin.",
            "Check upgrade costs before buying cosmetic-looking unlocks.",
            "On mobile, use landscape for easier dragging and camera control.",
        ],
        "controls": "Desktop: click/drag to move and interact. Mobile: tap and drag.",
        "faq": [
            ("Is Monkey Mart free?", "Yes — play free online on MonkeyMart.one with no download."),
            ("Is there a Monkey Mart 2?", "Yes. See our comparison guide, then pick the version you like."),
            ("Can I play unblocked?", "Open monkeymart.one in a browser that allows HTML5 games."),
        ],
        "related": [
            ("monkey-mart-upgrades-guide.html", "Upgrades Guide"),
            ("monkey-mart-early-game-strategy.html", "Early Game Strategy"),
            ("../monkey-mart-tips/", "Tips & Tricks"),
        ],
    },
    {
        "slug": "retro-bowl",
        "name": "Retro Bowl",
        "file": "play-retro-bowl-online.html",
        "game": "/game/retro-bowl.html",
        "image": "/assets/img/img-up/retro-bowl.png",
        "category": "Sports",
        "blurb": "Pixel American football that mixes arcade offense with light team management.",
        "why": [
            "Easy to learn passing and running.",
            "Season mode with drafts, morale, and upgrades.",
            "High replay value chasing championships.",
            "Plays well in short lunch-break sessions.",
        ],
        "how": [
            "Call a play, then control the QB after the snap.",
            "Swipe or aim to pass; run when the pocket collapses.",
            "Between games, manage roster, facilities, and staff.",
            "Build around a strong QB and offensive line first.",
        ],
        "tips": [
            "Don't force deep balls into double coverage.",
            "Upgrade training facilities before luxury fluff.",
            "Watch morale — unhappy stars underperform.",
            "On defense, let the CPU work while you focus offense.",
            "Save high draft picks for QB/WR when your roster is thin.",
        ],
        "controls": "Tap/click to pass and steer runners. Menus use simple taps.",
        "faq": [
            ("Is Retro Bowl free online?", "You can play Retro Bowl in your browser on Monkey Mart."),
            ("Is it single player?", "Yes — you manage one team through seasons."),
        ],
        "related": [
            ("play-a-small-world-cup-online.html", "A Small World Cup"),
            ("play-basket-random-online.html", "Basket Random"),
            ("play-slope-online.html", "Slope"),
        ],
    },
    {
        "slug": "2048",
        "name": "2048",
        "file": "play-2048-online.html",
        "game": "/game/2048.html",
        "image": "/assets/img/img-up/2048.png",
        "category": "Puzzle",
        "blurb": "The classic merge puzzle — slide tiles, combine equal numbers, and build toward 2048.",
        "why": [
            "One-minute rules, endless depth.",
            "Works on keyboard and touch.",
            "Great brain-break puzzle.",
            "Free and instant in the browser.",
        ],
        "how": [
            "Swipe or use arrow keys to slide all tiles.",
            "Equal tiles merge into the next power of two.",
            "Keep your highest tile in a corner.",
            "Build descending chains toward that corner.",
        ],
        "tips": [
            "Pick one corner strategy and stick to it.",
            "Avoid random swipes that break your snake.",
            "Don't merge big tiles too early if it creates holes.",
            "When the board clogs, clear small tiles first.",
            "Undo isn't always available — think one move ahead.",
        ],
        "controls": "Arrow keys or WASD on desktop; swipe on mobile.",
        "faq": [
            ("What is the goal of 2048?", "Create a 2048 tile (and keep going for higher scores)."),
            ("Can I play 2048 online free?", "Yes on Monkey Mart."),
        ],
        "related": [
            ("play-block-blast-online.html", "Block Blast"),
            ("play-tetris-online.html", "Tetris"),
            ("play-ball-sort-puzzle-online.html", "Ball Sort Puzzle"),
        ],
    },
    {
        "slug": "among-us",
        "name": "Among Us",
        "file": "play-among-us-online.html",
        "game": "/game/among-us.html",
        "image": "/assets/img/img-up/among-us.png",
        "category": "Multiplayer",
        "blurb": "Crewmates finish tasks while impostors sabotage — then argue it out in emergency meetings.",
        "why": [
            "Social deduction that's easy to jump into.",
            "Short rounds with big plot twists.",
            "Works with friends or quick public lobbies (where available).",
            "Iconic maps and roles.",
        ],
        "how": [
            "Join a lobby and pick a color.",
            "Crew: complete tasks and report bodies.",
            "Impostor: kill carefully, fake tasks, sabotage lights/O2.",
            "Vote wisely in meetings — or skip if unsure.",
        ],
        "tips": [
            "Watch who was near the body without hard-accusing too early.",
            "Clear tasks in groups to build trust as crew.",
            "As impostor, create alibis with visible fake tasks.",
            "Learn vent paths on Skeld before The Airship.",
            "Stay calm in chat — panic votes lose games.",
        ],
        "controls": "WASD/arrows to move; click tasks and UI buttons. Mobile uses touch joysticks.",
        "faq": [
            ("Is Among Us free online?", "Play Among Us-style sessions via the game page on Monkey Mart where available."),
            ("How many players?", "Typically 4–15 depending on lobby settings."),
        ],
        "related": [
            ("play-baldis-basics-online.html", "Baldi's Basics"),
            ("play-fnaf-1-online.html", "FNAF 1"),
            ("play-monkey-mart-online.html", "Monkey Mart"),
        ],
    },
    {
        "slug": "geometry-dash-lite",
        "name": "Geometry Dash Lite",
        "file": "play-geometry-dash-lite-online.html",
        "game": "/game/geometry-dash-lite.html",
        "image": "/assets/img/img-up/geometry-dash-lite.png",
        "category": "Platformer",
        "blurb": "Rhythm platforming — tap to jump, memorize patterns, and ride the beat through spiked levels.",
        "why": [
            "Tight jump timing synced to music.",
            "Practice mode mindset: die, learn, retry.",
            "Short levels with huge skill ceiling.",
            "Free browser access to the Lite experience.",
        ],
        "how": [
            "Press Play and tap/click to jump.",
            "Hold for ship/wave modes when the level switches.",
            "Memorize hazard placements instead of reacting late.",
            "Use practice checkpoints if the build offers them.",
        ],
        "tips": [
            "Listen to the song — jumps often sit on the beat.",
            "Slow your breathing on hard sections; panic mistaps.",
            "Replay early chunks until muscle memory sticks.",
            "Watch orb colors: yellow, pink, and black jump differently.",
            "Take breaks after long fail streaks.",
        ],
        "controls": "Click, tap, or space/up to jump. Some modes need holds.",
        "faq": [
            ("Is Geometry Dash Lite free?", "Yes — play in your browser on Monkey Mart."),
            ("Is it the full game?", "Lite includes a selection of levels; full GD has more content."),
        ],
        "related": [
            ("play-flappy-bird-online.html", "Flappy Bird"),
            ("play-circlo-online.html", "Circlo"),
            ("play-slope-online.html", "Slope"),
        ],
    },
    {
        "slug": "block-blast",
        "name": "Block Blast",
        "file": "play-block-blast-online.html",
        "game": "/game/block-blast.html",
        "image": "/assets/img/img-up/block-blast.png",
        "category": "Puzzle",
        "blurb": "Place block shapes on a grid, clear lines, and chain combos without filling the board.",
        "why": [
            "Relaxing yet strategic puzzle loop.",
            "No time pressure on most modes.",
            "Satisfying clears and combos.",
            "Touch-friendly for mobile play.",
        ],
        "how": [
            "Drag a shape onto the board.",
            "Fill complete rows or columns to clear them.",
            "Plan ahead so the next three pieces still fit.",
            "Chase combos by clearing multiple lines in sequence.",
        ],
        "tips": [
            "Keep the center flexible — don't wall yourself in.",
            "Save awkward pieces for openings you create.",
            "Clear often; a packed board ends runs fast.",
            "Think one piece ahead when scores get high.",
            "Restart early if the opening board is already clogged.",
        ],
        "controls": "Drag and drop pieces with mouse or finger.",
        "faq": [
            ("Is Block Blast free?", "Yes on Monkey Mart in your browser."),
            ("Is there a timer?", "Most sessions are untimed — play at your pace."),
        ],
        "related": [
            ("play-2048-online.html", "2048"),
            ("play-tetris-online.html", "Tetris"),
            ("play-ball-sort-puzzle-online.html", "Ball Sort Puzzle"),
        ],
    },
    {
        "slug": "tetris",
        "name": "Tetris",
        "file": "play-tetris-online.html",
        "game": "/game/tetris.html",
        "image": "/assets/img/img-up/tetris.png",
        "category": "Puzzle",
        "blurb": "Stack falling tetrominoes, clear lines, and survive as the speed increases.",
        "why": [
            "The original endlessly replayable puzzle.",
            "Skill expression through setups and T-spins (where supported).",
            "Quick rounds or marathon mode.",
            "Works on keyboard and many touch builds.",
        ],
        "how": [
            "Move pieces left/right and rotate into place.",
            "Soft drop or hard drop to lock pieces.",
            "Clear 1–4 lines; Tetrises (4 lines) score big.",
            "Keep the stack low as gravity increases.",
        ],
        "tips": [
            "Leave a well for I-pieces when hunting Tetrises.",
            "Don't nest holes under blocks you can't reach.",
            "Hold (if available) to save an I or awkward piece.",
            "Look at the next queue, not only the active piece.",
            "When panicked, clear singles to buy time.",
        ],
        "controls": "Arrows to move/drop; up or X/Z to rotate (varies by build).",
        "faq": [
            ("Can I play Tetris online free?", "Yes via Monkey Mart's browser game page."),
            ("Is it the official EA Tetris?", "Browser builds vary; gameplay is the classic stack-and-clear loop."),
        ],
        "related": [
            ("play-2048-online.html", "2048"),
            ("play-block-blast-online.html", "Block Blast"),
            ("play-wordle-unlimited-online.html", "Wordle Unlimited"),
        ],
    },
    {
        "slug": "wordle-unlimited",
        "name": "Wordle Unlimited",
        "file": "play-wordle-unlimited-online.html",
        "game": "/game/wordle-unlimited.html",
        "image": "/assets/img/img-up/wordle-unlimited.png",
        "category": "Puzzle",
        "blurb": "Guess the five-letter word with color feedback — unlimited rounds instead of one puzzle a day.",
        "why": [
            "Familiar Wordle rules without the daily limit.",
            "Great for vocabulary warm-ups.",
            "Fast rounds you can replay immediately.",
            "No account required in the browser.",
        ],
        "how": [
            "Type a valid five-letter guess and submit.",
            "Green = right letter, right spot; yellow = wrong spot; gray = not in word.",
            "Use feedback to narrow the answer within six tries.",
            "Start a new puzzle anytime in Unlimited mode.",
        ],
        "tips": [
            "Open with a word rich in vowels (ADIEU, AUDIO, etc.).",
            "Avoid reusing gray letters.",
            "Park yellows in new positions.",
            "On turn 3–4, prioritize information if two greens are stuck.",
            "Keep a mental list of common endings: -ING, -ERS, -TED.",
        ],
        "controls": "Keyboard letters + Enter. On mobile, use the on-screen keyboard.",
        "faq": [
            ("Is Wordle Unlimited free?", "Yes on Monkey Mart."),
            ("How is it different from Wordle?", "Unlimited lets you play many puzzles per day."),
        ],
        "related": [
            ("play-2048-online.html", "2048"),
            ("play-tetris-online.html", "Tetris"),
            ("play-infinite-craft-online.html", "Infinite Craft"),
        ],
    },
    {
        "slug": "snow-rider-3d",
        "name": "Snow Rider 3D",
        "file": "play-snow-rider-3d-online.html",
        "game": "/game/snow-rider-3d.html",
        "image": "/assets/img/img-up/snow-rider-3d.png",
        "category": "Racing",
        "blurb": "Ride a sled down an endless snowy slope, dodge trees, and grab gifts for score.",
        "why": [
            "Chill aesthetics with rising speed.",
            "Simple steering, hard mastery.",
            "Collectibles add score goals.",
            "Instant browser play.",
        ],
        "how": [
            "Press Play and steer left/right down the mountain.",
            "Avoid trees, rocks, and snowmen.",
            "Pick up presents for bonus points.",
            "Survive as long as possible as speed increases.",
        ],
        "tips": [
            "Stay flexible in the middle lane until you see openings.",
            "Don't tunnel-vision on gifts near trees.",
            "Small steering inputs beat hard swerves at high speed.",
            "Watch the horizon for cluster obstacles.",
            "Retry quickly — each run teaches spawn patterns.",
        ],
        "controls": "Arrow keys or A/D; touch steers on mobile.",
        "faq": [
            ("Is Snow Rider 3D free?", "Yes — play online on Monkey Mart."),
            ("Does it save scores?", "Depends on the build; local high scores are common."),
        ],
        "related": [
            ("play-slope-online.html", "Slope"),
            ("play-chrome-dino-online.html", "Chrome Dino"),
            ("play-flappy-bird-online.html", "Flappy Bird"),
        ],
    },
    {
        "slug": "flappy-bird",
        "name": "Flappy Bird",
        "file": "play-flappy-bird-online.html",
        "game": "/game/flappy-bird.html",
        "image": "/assets/img/img-up/flappy-bird.png",
        "category": "Arcade",
        "blurb": "Tap to flap through pipe gaps — easy to try, infamous to master.",
        "why": [
            "One-button gameplay.",
            "Addictive 'one more try' loop.",
            "Tiny download footprint (browser).",
            "Perfect for quick high-score hunting.",
        ],
        "how": [
            "Tap/click to flap upward.",
            "Release to fall with gravity.",
            "Thread the bird through each pipe gap.",
            "Score rises with every pipe you clear.",
        ],
        "tips": [
            "Find a steady tap rhythm instead of panic mashing.",
            "Aim for the center of each gap.",
            "Reset focus after a silly early death.",
            "Sit back slightly from the screen — less overcorrection.",
            "Short sessions beat tilting the phone in frustration.",
        ],
        "controls": "Click, tap, or space to flap.",
        "faq": [
            ("Is Flappy Bird free online?", "Yes on Monkey Mart."),
            ("Why is it so hard?", "Tight hitboxes and constant gravity — practice timing."),
        ],
        "related": [
            ("play-geometry-dash-lite-online.html", "Geometry Dash Lite"),
            ("play-circlo-online.html", "Circlo"),
            ("play-chrome-dino-online.html", "Chrome Dino"),
        ],
    },
    {
        "slug": "fnaf-1",
        "name": "FNAF 1",
        "file": "play-fnaf-1-online.html",
        "game": "/game/fnaf.html",
        "image": "/assets/img/img-up/fnaf-1.png",
        "category": "Horror",
        "blurb": "Survive five nights as a security guard — watch cameras, close doors, and manage power.",
        "why": [
            "Atmospheric jump-scare horror classic.",
            "Resource management (power) under pressure.",
            "Memorable animatronic patterns.",
            "Best played with headphones.",
        ],
        "how": [
            "Check cameras to track animatronics.",
            "Close left/right doors when something is at the door.",
            "Conserve power — darkness ends the night badly.",
            "Listen for audio cues between camera checks.",
        ],
        "tips": [
            "Don't stare at cams forever; check doors often.",
            "Freddy is more dangerous in later nights — track him.",
            "If power is low, minimize door time.",
            "Learn each character's movement rules night by night.",
            "Play in a dark room for the full effect (optional!).",
        ],
        "controls": "Mouse to switch cameras and toggle doors/lights.",
        "faq": [
            ("Is FNAF 1 free online?", "Play via the FNAF page on Monkey Mart where offered."),
            ("How many nights?", "Five main nights plus challenges in many versions."),
        ],
        "related": [
            ("play-fnaf-2-online.html", "FNAF 2"),
            ("play-fnaf-3-online.html", "FNAF 3"),
            ("play-baldis-basics-online.html", "Baldi's Basics"),
        ],
    },
    {
        "slug": "8-ball-pool",
        "name": "8 Ball Pool",
        "file": "play-8-ball-pool-online.html",
        "game": "/game/8-ball-pool.html",
        "image": "/assets/img/img-up/8-ball-pool-billiard.png",
        "category": "Sports",
        "blurb": "Aim, set power, and clear your balls before sinking the 8-ball legally.",
        "why": [
            "Classic pool rules in the browser.",
            "Satisfying aiming and bank shots.",
            "Easy matches for casual play.",
            "Works with mouse precision.",
        ],
        "how": [
            "Break from the kitchen, then claim solids or stripes.",
            "Aim with the cue; set power carefully.",
            "Pocket your suit, then the 8-ball in the called pocket (rules vary).",
            "Avoid scratching on the 8.",
        ],
        "tips": [
            "Leave an easy follow-up instead of a flashy low-percentage shot.",
            "Use softer power for thin cuts.",
            "Plan cue-ball position after the contact.",
            "Clear clusters early when you can.",
            "On mobile, zoom your aim if the UI allows.",
        ],
        "controls": "Mouse aim + power slider; touch drag on mobile.",
        "faq": [
            ("Is 8 Ball Pool free?", "Yes — play online on Monkey Mart."),
            ("Can I play vs CPU?", "Many browser builds include practice or bot matches."),
        ],
        "related": [
            ("play-basket-random-online.html", "Basket Random"),
            ("play-retro-bowl-online.html", "Retro Bowl"),
            ("play-blackjack-online.html", "Blackjack"),
        ],
    },
    {
        "slug": "friday-night-funkin",
        "name": "Friday Night Funkin",
        "file": "play-friday-night-funkin-online.html",
        "game": "/game/friday-night-funkin.html",
        "image": "/assets/img/img-up/friday-night-funkin.png",
        "category": "Rhythm",
        "blurb": "Hit arrow notes on beat in story mode rap battles — timing is everything.",
        "why": [
            "Catchy tracks and iconic characters.",
            "Readable charting for beginners.",
            "Harder songs for veterans.",
            "Browser-friendly rhythm action.",
        ],
        "how": [
            "Press arrow keys (or ZFGH) matching the scrolling notes.",
            "Stay on beat to keep your health up.",
            "Misses drain health — too many and you lose.",
            "Clear weeks in Story mode or jump into Freeplay.",
        ],
        "tips": [
            "Focus on the receptor, not the character animations.",
            "Downscroll vs upscroll — pick what your brain likes.",
            "Practice hard songs in sections.",
            "Lower lag in settings if notes feel late/early.",
            "Warm up on easier tracks first.",
        ],
        "controls": "Arrow keys or A-S-W-D / Z-X-C-V depending on bind settings.",
        "faq": [
            ("Is FNF free?", "Yes — play Friday Night Funkin online on Monkey Mart."),
            ("Are mods included?", "Base browser builds vary; many host the original weeks."),
        ],
        "related": [
            ("play-geometry-dash-lite-online.html", "Geometry Dash Lite"),
            ("play-circlo-online.html", "Circlo"),
            ("play-flappy-bird-online.html", "Flappy Bird"),
        ],
    },
    {
        "slug": "circlo",
        "name": "Circlo",
        "file": "play-circlo-online.html",
        "game": "/game/circlo.html",
        "image": "/assets/img/img-up/circlo.png",
        "category": "Arcade",
        "blurb": "Minimal one-button survival — grow, dodge, and last as long as you can in a clean arena.",
        "why": [
            "Zen visuals with sharp difficulty.",
            "One-button simplicity.",
            "Score attack friendly.",
            "Lightweight in the browser.",
        ],
        "how": [
            "Hold/press the action control to move or grow (per version rules).",
            "Avoid hazards as patterns intensify.",
            "Collect score pickups when safe.",
            "Survive escalating waves.",
        ],
        "tips": [
            "Small movements beat panic circles.",
            "Learn safe pockets in each pattern.",
            "Don't greed pickups near spawn bursts.",
            "Mute distractions — audio cues help.",
            "Retry immediately to lock muscle memory.",
        ],
        "controls": "Mouse click / space / tap — follow on-screen prompt.",
        "faq": [
            ("Is Circlo free?", "Yes on Monkey Mart."),
            ("Is there a sequel?", "CircloO / Circlo 2 variants exist on many portals."),
        ],
        "related": [
            ("play-flappy-bird-online.html", "Flappy Bird"),
            ("play-slope-online.html", "Slope"),
            ("play-geometry-dash-lite-online.html", "Geometry Dash Lite"),
        ],
    },
    {
        "slug": "basket-random",
        "name": "Basket Random",
        "file": "play-basket-random-online.html",
        "game": "/game/basket-random.html",
        "image": "/assets/img/img-up/basket-random.png",
        "category": "Sports",
        "blurb": "Physics-chaos basketball where courts, balls, and controls randomize every round.",
        "why": [
            "Hilarious ragdoll physics.",
            "Local multiplayer energy.",
            "Short, spicy rounds.",
            "No deep tutorial needed.",
        ],
        "how": [
            "Jump/shoot with your key when the ball is near.",
            "Adapt when the court or ball type changes.",
            "First to the round score wins the set.",
            "Play 1P vs CPU or 2P on one keyboard.",
        ],
        "tips": [
            "Time jumps — spamming loses contests.",
            "On tiny courts, soft taps beat full power.",
            "Watch the ball bounce after rim hits.",
            "Laugh when physics betray you; reset focus next tip-off.",
            "Learn which randomized modes favor defense.",
        ],
        "controls": "Player 1 and Player 2 use different keys (often W and Up). Check the start screen.",
        "faq": [
            ("Can two players play?", "Yes — local same-keyboard multiplayer is the charm."),
            ("Is Basket Random free?", "Yes in the browser on Monkey Mart."),
        ],
        "related": [
            ("play-boxing-random-online.html", "Boxing Random"),
            ("play-retro-bowl-online.html", "Retro Bowl"),
            ("play-a-small-world-cup-online.html", "A Small World Cup"),
        ],
    },
    {
        "slug": "monkey-mart-upgrades",
        "name": "Monkey Mart Upgrades",
        "file": "monkey-mart-upgrades-guide.html",
        "game": "/game/monkey-mart.html",
        "image": "/assets/img/img-up/monkey-mart.png",
        "category": "Guide",
        "title": "Monkey Mart Upgrades Guide",
        "blurb": "Which unlocks to buy first so your supermarket runs itself while you expand.",
        "why": [
            "Coins are limited early — priority matters.",
            "Helpers multiply income more than vanity unlocks.",
            "Stations unlock new product lines.",
            "A clean upgrade order reduces grinding.",
        ],
        "how": [
            "Earn coins by stocking shelves and serving customers.",
            "Open the upgrade/unlock panel when you have a surplus.",
            "Buy worker/helper upgrades before optional cosmetics.",
            "Unlock the next production booth when shelves stay full.",
        ],
        "tips": [
            "Rule of thumb: automation > new booth > capacity > cosmetics.",
            "If you still carry everything, hire helpers first.",
            "Don't unlock three booths you can't staff.",
            "Reinvest profits immediately after each upgrade.",
            "Check our early-game strategy guide for the first hour plan.",
        ],
        "controls": "Same as Monkey Mart — click/tap UI upgrade buttons.",
        "faq": [
            ("What should I upgrade first?", "Helpers/automation, then the next product station."),
            ("Do upgrades carry over?", "Progress is usually saved locally in the browser build."),
        ],
        "related": [
            ("monkey-mart-early-game-strategy.html", "Early Game Strategy"),
            ("play-monkey-mart-online.html", "Play Monkey Mart"),
            ("monkey-mart-helper-monkeys.html", "Helper Monkeys"),
        ],
    },
    {
        "slug": "monkey-mart-early",
        "name": "Monkey Mart Early Game",
        "file": "monkey-mart-early-game-strategy.html",
        "game": "/game/monkey-mart.html",
        "image": "/assets/img/img-up/monkey-mart.png",
        "category": "Guide",
        "title": "Monkey Mart Early Game Strategy",
        "blurb": "A practical first-hour plan: stock, unlock, automate, then expand without going broke.",
        "why": [
            "Early mistakes slow the whole run.",
            "Focus beats random unlocks.",
            "Automation compounds fast.",
            "Sets you up for mid-game expansion.",
        ],
        "how": [
            "Minutes 0–10: only gather and stock the first product.",
            "Minutes 10–25: unlock one helper path and keep shelves full.",
            "Minutes 25–45: open the second station once the first is automated.",
            "Minutes 45–60: expand floor space only if income is stable.",
        ],
        "tips": [
            "Never leave shelves empty while shopping for unlocks.",
            "One fully working loop > three half-broken loops.",
            "Pickup paths matter — reduce walking distance.",
            "Save a coin buffer before big unlocks.",
            "Read the upgrades guide before dumping cash.",
        ],
        "controls": "Standard Monkey Mart mouse/touch controls.",
        "faq": [
            ("How long is early game?", "Roughly the first hour for most players."),
            ("Should I hire monkeys early?", "Yes — as soon as you can keep paying them productively."),
        ],
        "related": [
            ("monkey-mart-upgrades-guide.html", "Upgrades Guide"),
            ("play-monkey-mart-online.html", "Play Monkey Mart"),
            ("../monkey-mart-tips/", "Tips & Tricks"),
        ],
    },
    {
        "slug": "monkey-mart-mobile",
        "name": "Monkey Mart Mobile",
        "file": "monkey-mart-mobile-guide.html",
        "game": "/game/monkey-mart.html",
        "image": "/assets/img/img-up/monkey-mart.png",
        "category": "Guide",
        "title": "Monkey Mart Mobile Guide",
        "blurb": "How to play Monkey Mart comfortably on phones and tablets with touch controls.",
        "why": [
            "Touch drag feels different from mouse.",
            "Screen size affects camera and UI taps.",
            "Portrait vs landscape changes accuracy.",
            "Same progression goals as desktop.",
        ],
        "how": [
            "Open the game page in mobile Safari/Chrome.",
            "Rotate to landscape for a wider camera.",
            "Drag to move; tap stations and UI buttons.",
            "Use fullscreen if your browser offers it.",
        ],
        "tips": [
            "Landscape reduces mis-taps on shelves.",
            "Zoom/browser reader modes can break the canvas — use a normal tab.",
            "Keep one thumb for movement, one for UI when possible.",
            "On smaller phones, hire helpers sooner to reduce micro-play.",
            "Plug in power for long idle sessions.",
        ],
        "controls": "Touch drag + tap. No keyboard required.",
        "faq": [
            ("Does Monkey Mart work on iPhone?", "Yes in modern mobile browsers."),
            ("Can I play offline?", "You need a connection to load the page; then it runs in-browser."),
        ],
        "related": [
            ("play-monkey-mart-online.html", "Play Monkey Mart"),
            ("monkey-mart-early-game-strategy.html", "Early Game Strategy"),
            ("../monkey-mart-unblocked/", "Unblocked"),
        ],
    },
    {
        "slug": "monkey-mart-vs-2",
        "name": "Monkey Mart vs Monkey Mart 2",
        "file": "monkey-mart-vs-monkey-mart-2.html",
        "game": "/game/monkey-mart.html",
        "image": "/assets/img/img-up/monkey-mart-2.webp",
        "category": "Guide",
        "title": "Monkey Mart vs Monkey Mart 2",
        "blurb": "A quick comparison so you know which supermarket sim to open first.",
        "why": [
            "Both share the gather-stock-sell loop.",
            "Sequels often add polish, maps, or pace changes.",
            "Picking one avoids split progress.",
            "You can always try both free in-browser.",
        ],
        "how": [
            "Play the original if you want the classic layout players know.",
            "Try Monkey Mart 2 if you want a fresher coat of paint / content.",
            "Spend 10 minutes in each, then stick with the one that feels smoother.",
            "Use our upgrades guide once you commit to a save.",
        ],
        "tips": [
            "Judge by controls and clarity of goals, not just graphics.",
            "If one build lags on your device, switch — performance matters.",
            "Don't grind both at once unless you love idle sims.",
            "Bookmark your favorite for one-click return.",
            "Share the quieter game with younger players.",
        ],
        "controls": "Both use click/tap supermarket controls.",
        "faq": [
            ("Which is better?", "Subjective — original is classic; 2 is often more polished. Try both."),
            ("Are saves shared?", "Usually separate per game page/build."),
        ],
        "related": [
            ("play-monkey-mart-online.html", "Play Monkey Mart"),
            ("monkey-mart-upgrades-guide.html", "Upgrades Guide"),
            ("../how-to-play-monkey-mart/", "How to Play"),
        ],
    },
]


def render_list(items: list[str], ordered: bool = False) -> str:
    tag = "ol" if ordered else "ul"
    lis = "\n".join(f"<li>{html.escape(i)}</li>" for i in items)
    return f"<{tag}>\n{lis}\n</{tag}>"


def render_faq(faq: list[tuple[str, str]]) -> str:
    parts = ['<div class="mm-blog-faq">']
    for q, a in faq:
        parts.append(
            f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>"
        )
    parts.append("</div>")
    return "\n".join(parts)


def render_related(related: list[tuple[str, str]]) -> str:
    lis = "\n".join(
        f'<li><a href="{esc(href)}">{html.escape(label)}</a></li>' for href, label in related
    )
    return f'<ul class="related-links">\n{lis}\n</ul>'


def build_article(g: dict) -> str:
    name = g["name"]
    title = g.get("title") or f"Play {name} Online Free"
    lead = g["blurb"]
    game = g["game"]
    image = g["image"]
    file_stem = g["file"]
    canonical = f"https://monkeymart.one/blog/{file_stem}"
    desc = f"{lead} Play {name} free in your browser on Monkey Mart — tips, controls, and FAQ."
    why = render_list(g["why"])
    how = render_list(g["how"], ordered=True)
    tips = render_list(g["tips"], ordered=True)
    faq = render_faq(g["faq"])
    related = render_related(g["related"])
    what_h2 = f"What is {html.escape(name)}?"

    article_ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": desc,
        "datePublished": TODAY,
        "dateModified": TODAY,
        "author": {"@type": "Organization", "name": "Monkey Mart"},
        "publisher": {
            "@type": "Organization",
            "name": "Monkey Mart",
            "url": "https://monkeymart.one/",
        },
        "mainEntityOfPage": canonical,
        "image": f"https://monkeymart.one{image}",
    }
    crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://monkeymart.one/"},
            {"@type": "ListItem", "position": 2, "name": "Game Guides", "item": "https://monkeymart.one/blog/"},
            {"@type": "ListItem", "position": 3, "name": title, "item": canonical},
        ],
    }

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{esc(title)} - Game Guide | Monkey Mart</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{esc(canonical)}">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:image" content="https://monkeymart.one{esc(image)}">
  <meta property="og:url" content="{esc(canonical)}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
  <link rel="stylesheet" href="../assets/css/style.css" />
  <link rel="stylesheet" href="../assets/css/wg-grids.css" />
  <link rel="stylesheet" href="../assets/css/mm-blog.css" />
  <script type="application/ld+json">{json.dumps(article_ld, ensure_ascii=False)}</script>
  <script type="application/ld+json">{json.dumps(crumbs, ensure_ascii=False)}</script>
  <link rel="dns-prefetch" href="https://universal.wgplayer.com"/><script type="text/javascript" async>!function(e,t){{a=e.createElement("script"),m=e.getElementsByTagName("script")[0],a.async=1,a.src=t,a.fetchPriority='high',m.parentNode.insertBefore(a,m)}}(document,"https://universal.wgplayer.com/tag/?lh="+window.location.hostname+"&wp="+window.location.pathname+"&ws="+window.location.search);</script>
</head>
<body class="mm-blog-page">
  <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open menu"><i class="fas fa-bars"></i></button>
  <div class="menu-overlay" id="menu-overlay"></div>
  <div class="main-wrapper">
    <main class="main-content">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="logo"><a href="/"><img src="../assets/img/monkeymart.png" alt="Monkey Mart Logo" width="120" height="56" decoding="async"></a></div>
            <nav class="nav-menu">
              <ul>
                <li><a href="/"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="/category/game.html"><i class="fas fa-gamepad"></i> All Games</a></li>
                <li><a href="/blog/"><i class="fas fa-book"></i> Game Guides</a></li>
                <li><a href="{esc(game)}"><i class="fas fa-play"></i> Play {esc(name)}</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <section class="article-header">
        <div class="container">
          <div class="article-meta">
            <span class="article-date"><i class="fas fa-calendar"></i> {esc(TODAY)}</span>
            <span class="article-category"><i class="fas fa-tag"></i> {esc(g.get("category") or "Game Guide")}</span>
          </div>
          <h1>{esc(title)}</h1>
          <p class="article-lead">{esc(lead)}</p>
        </div>
      </section>

      <section class="article-content">
        <div class="content-wrapper">
          <article class="main-article">
            <div class="article-body">
              <p><strong>{esc(name)}</strong> is a free browser game you can open on Monkey Mart without installing anything. This guide covers what it is, how to start, practical tips, controls, and FAQ — then sends you straight to play.</p>
              <p><a class="mm-blog-cta" href="{esc(game)}"><i class="fas fa-play"></i> Play {esc(name)} Now</a></p>

              <h2>{what_h2}</h2>
              <p>{esc(lead)}</p>

              <h2>Why players like {esc(name)}</h2>
              {why}

              <h2>How to play {esc(name)}</h2>
              {how}

              <h2>Beginner tips</h2>
              {tips}

              <h2>Controls</h2>
              <p>{esc(g["controls"])}</p>

              <h2>FAQ</h2>
              {faq}

              <h2>Where to play</h2>
              <p>Play <a href="{esc(game)}">{esc(name)} online</a> on Monkey Mart. Browse more titles on <a href="/category/game.html">All Games</a> or read other <a href="/blog/">game guides</a>.</p>

              <div class="conclusion">
                <h2>Final thoughts</h2>
                <p>{esc(name)} is easy to start and worth mastering. Bookmark the game page, use the tips above, and jump back in whenever you want a quick session.</p>
                <p><a class="mm-blog-cta" href="{esc(game)}"><i class="fas fa-play"></i> Play {esc(name)} Now</a></p>
              </div>
            </div>
          </article>
          <aside class="article-sidebar">
            <div class="sidebar-widget">
              <h3>Quick links</h3>
              <ul class="related-links">
                <li><a href="{esc(game)}">Play {esc(name)}</a></li>
                <li><a href="/">Play Monkey Mart</a></li>
                <li><a href="/category/game.html">All Games</a></li>
                <li><a href="/blog/">Game Guides</a></li>
              </ul>
            </div>
            <div class="sidebar-widget">
              <h3>Related guides</h3>
              {related}
            </div>
          </aside>
        </div>
      </section>
      <div class="mm-blog-cta-bar"><a class="mm-blog-cta" href="{esc(game)}"><i class="fas fa-play"></i> Play {esc(name)}</a></div>
    </main>
  </div>
  <footer class="mm-footer">
    <div class="mm-footer-inner">
      <div class="mm-footer-top">
        <div class="mm-footer-brand">
          <div class="mm-footer-brand-logo"><a href="/"><img src="/assets/img/monkeymart.png" alt="Monkey Mart"/></a></div>
          <p>Free browser games and guides on MonkeyMart.one.</p>
        </div>
        <div class="mm-footer-col"><h3>Guides</h3><ul><li><a href="/blog/">All Guides</a></li><li><a href="{esc(game)}">Play {esc(name)}</a></li></ul></div>
        <div class="mm-footer-col"><h3>Site</h3><ul><li><a href="/">Home</a></li><li><a href="/category/game.html">All Games</a></li></ul></div>
      </div>
      <div class="mm-footer-bottom"><p>&copy; {date.today().year} Monkey Mart. All rights reserved.</p></div>
    </div>
  </footer>
  <script src="../assets/js/main.js"></script>
</body>
</html>
"""


def write_guide(g: dict) -> Path:
    path = BLOG / g["file"]
    path.write_text(build_article(g), encoding="utf-8")
    return path


def find_guide(slug: str) -> dict | None:
    for g in PRIORITY_GUIDES:
        if g["slug"] == slug or g["file"] == slug or g["file"] == f"play-{slug}-online.html":
            return g
    return None


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate MonkeyMart blog guide HTML")
    ap.add_argument("--list", action="store_true", help="List priority guide slugs")
    ap.add_argument("--slug", help="Write one priority guide by slug")
    ap.add_argument("--all-priority", action="store_true", help="Rewrite all priority guides")
    ap.add_argument("--name", help="Custom guide display name")
    ap.add_argument("--game", help="Custom /game/slug.html path")
    ap.add_argument("--image", help="Custom image path")
    ap.add_argument("--file", help="Output filename under blog/")
    ap.add_argument("--write", action="store_true", help="Write custom guide from flags")
    args = ap.parse_args()

    if args.list:
        for g in PRIORITY_GUIDES:
            print(f"{g['slug']:24} {g['file']}")
        return

    if args.all_priority:
        for g in PRIORITY_GUIDES:
            p = write_guide(g)
            print(f"Wrote {p.relative_to(ROOT)}")
        print(f"Done — {len(PRIORITY_GUIDES)} guides")
        return

    if args.slug:
        g = find_guide(args.slug)
        if not g:
            raise SystemExit(f"Unknown slug: {args.slug}")
        p = write_guide(g)
        print(f"Wrote {p.relative_to(ROOT)}")
        return

    if args.write:
        if not (args.name and args.game and args.file):
            raise SystemExit("--write requires --name --game --file (and ideally --image)")
        name = args.name
        g = {
            "slug": args.file.replace(".html", ""),
            "name": name,
            "file": args.file,
            "game": args.game,
            "image": args.image or "/assets/img/img-up/monkey-mart.png",
            "category": "Game Guide",
            "blurb": f"{name} is a free browser game you can play instantly on Monkey Mart.",
            "why": [
                "Instant play in the browser.",
                "Easy to learn for new players.",
                "Replayable sessions.",
                "Free on Monkey Mart.",
            ],
            "how": [
                f"Open the {name} game page and press Play.",
                "Learn the basic controls from the on-screen prompt.",
                "Complete the main objective of the mode you chose.",
                "Retry to improve your score or progress.",
            ],
            "tips": [
                "Take a practice round first.",
                "Learn timing before rushing.",
                "Watch patterns and react early.",
                "Use short sessions to improve.",
                "Come back later if you get stuck.",
            ],
            "controls": "Follow on-screen keyboard or touch prompts.",
            "faq": [
                (f"Is {name} free?", f"Yes — play {name} online free on Monkey Mart."),
                ("Do I need to download?", "No — it runs in your browser."),
            ],
            "related": [
                ("/blog/", "All Game Guides"),
                ("/category/game.html", "All Games"),
                ("/game/monkey-mart.html", "Play Monkey Mart"),
            ],
        }
        p = write_guide(g)
        print(f"Wrote {p.relative_to(ROOT)}")
        return

    ap.print_help()


if __name__ == "__main__":
    main()
