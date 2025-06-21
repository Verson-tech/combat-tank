#!/bin/bash

# Simple Screenshot Capture Script for Combat Tank Game
# Uses macOS built-in screencapture tool

echo "Combat Tank Game - Simple Screenshot Capture"
echo "============================================="

# Create screenshots directory
SCREENSHOTS_DIR="screenshots"
mkdir -p "$SCREENSHOTS_DIR/gameplay"
mkdir -p "$SCREENSHOTS_DIR/mobile"
mkdir -p "$SCREENSHOTS_DIR/ui_elements"

echo "Created screenshot directories"

# Function to open game and wait for user
open_game_and_wait() {
    echo "Opening game in browser..."
    open "file://$(pwd)/index.html"
    echo "Game should now be open in your browser."
    echo "Press ENTER when you're ready to take screenshots..."
    read
}

# Function to take a screenshot with delay
take_screenshot() {
    local filename=$1
    local description=$2
    local delay=${3:-3}
    
    echo "Get ready to capture: $description"
    echo "Screenshot will be taken in $delay seconds..."
    
    for i in $(seq $delay -1 1); do
        echo "$i..."
        sleep 1
    done
    
    screencapture -x "$SCREENSHOTS_DIR/$filename"
    echo "✓ Screenshot saved: $filename"
    echo ""
}

# Function to take interactive screenshot
interactive_screenshot() {
    local filename=$1
    local description=$2
    
    echo "Prepare for: $description"
    echo "Press SPACE when ready, then click and drag to select area (or just click for full screen)"
    screencapture -i "$SCREENSHOTS_DIR/$filename"
    echo "✓ Screenshot saved: $filename"
    echo ""
}

echo "Starting screenshot capture process..."
echo ""

# Open the game
open_game_and_wait

echo "Now we'll capture various screenshots. Follow the prompts:"
echo ""

# Capture loading screen
echo "1. LOADING SCREEN"
echo "   Make sure the game is showing the loading screen"
interactive_screenshot "ui_elements/loading_screen.png" "Loading Screen"

# Capture game start
echo "2. GAME START"
echo "   Click to start the game, then get ready for screenshot"
interactive_screenshot "gameplay/game_start.png" "Game Start Screen"

# Capture gameplay moments
echo "3. TANK MOVEMENT"
echo "   Move your tank around, then capture"
interactive_screenshot "gameplay/tank_movement.png" "Tank Movement"

echo "4. TANK SHOOTING"
echo "   Fire some shots, then capture the action"
interactive_screenshot "gameplay/tank_shooting.png" "Tank Shooting"

echo "5. ENEMY COMBAT"
echo "   Engage with enemy tanks, then capture"
interactive_screenshot "gameplay/enemy_combat.png" "Enemy Combat"

echo "6. GAME UI"
echo "   Capture the score and lives display"
interactive_screenshot "ui_elements/game_ui.png" "Game UI Elements"

# Mobile version
echo "7. MOBILE VERSION"
echo "   Now let's capture mobile version. Resize your browser window to mobile size"
echo "   (narrow and tall) or use browser dev tools mobile emulation"
echo "   Press ENTER when ready..."
read

interactive_screenshot "mobile/mobile_gameplay.png" "Mobile Gameplay"
interactive_screenshot "mobile/touch_controls.png" "Mobile Touch Controls"

# Victory/Game Over screens
echo "8. GAME STATES"
echo "   Try to trigger victory or game over, then capture"
interactive_screenshot "ui_elements/victory_screen.png" "Victory Screen (if available)"
interactive_screenshot "ui_elements/game_over_screen.png" "Game Over Screen (if available)"

# Create a simple HTML gallery
create_gallery() {
    cat > "$SCREENSHOTS_DIR/gallery.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Combat Tank Game - Screenshots</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot { border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
        .screenshot img { max-width: 100%; height: auto; }
        .screenshot h3 { margin-top: 0; color: #0057b7; }
    </style>
</head>
<body>
    <h1>Combat Tank Game - Screenshot Gallery</h1>
    <div class="gallery">
EOF

    # Add screenshots to gallery
    find "$SCREENSHOTS_DIR" -name "*.png" | sort | while read -r img; do
        filename=$(basename "$img")
        relative_path=$(echo "$img" | sed "s|$SCREENSHOTS_DIR/||")
        title=$(echo "$filename" | sed 's/_/ /g' | sed 's/.png//' | sed 's/\b\w/\U&/g')
        
        cat >> "$SCREENSHOTS_DIR/gallery.html" << EOF
        <div class="screenshot">
            <h3>$title</h3>
            <img src="$relative_path" alt="$title">
        </div>
EOF
    done

    cat >> "$SCREENSHOTS_DIR/gallery.html" << EOF
    </div>
</body>
</html>
EOF
}

# Generate gallery
create_gallery
echo "✓ Screenshot gallery created: $SCREENSHOTS_DIR/gallery.html"

# Create markdown report
create_markdown_report() {
    cat > "$SCREENSHOTS_DIR/README.md" << EOF
# Combat Tank Game - Screenshots

This directory contains all screenshots captured for the development article.

## Directory Structure

- \`gameplay/\` - Screenshots of game action and mechanics
- \`mobile/\` - Mobile version screenshots
- \`ui_elements/\` - User interface components

## Screenshots

EOF

    find "$SCREENSHOTS_DIR" -name "*.png" | sort | while read -r img; do
        filename=$(basename "$img")
        relative_path=$(echo "$img" | sed "s|$SCREENSHOTS_DIR/||")
        title=$(echo "$filename" | sed 's/_/ /g' | sed 's/.png//' | sed 's/\b\w/\U&/g')
        
        echo "### $title" >> "$SCREENSHOTS_DIR/README.md"
        echo "![${title}](${relative_path})" >> "$SCREENSHOTS_DIR/README.md"
        echo "" >> "$SCREENSHOTS_DIR/README.md"
    done

    cat >> "$SCREENSHOTS_DIR/README.md" << EOF

## Usage in Article

These screenshots can be embedded in your development article using the markdown syntax shown above.

For web use, you can open \`gallery.html\` in a browser to view all screenshots in a grid layout.
EOF
}

create_markdown_report
echo "✓ Markdown report created: $SCREENSHOTS_DIR/README.md"

echo ""
echo "============================================="
echo "Screenshot capture complete!"
echo ""
echo "Files created:"
echo "- Screenshots saved in: $SCREENSHOTS_DIR/"
echo "- View gallery: open $SCREENSHOTS_DIR/gallery.html"
echo "- Markdown report: $SCREENSHOTS_DIR/README.md"
echo ""
echo "You can now use these screenshots in your article!"
