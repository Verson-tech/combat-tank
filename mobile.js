/**
 * Mobile Touch Controls for Combat Tank Game
 * This file handles all mobile-specific optimizations and touch controls
 */

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800;

// Initialize mobile controls when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    if (isMobile) {
        initMobileControls();
    }
});

function initMobileControls() {
    console.log("Mobile device detected, initializing touch controls");
    
    // Create touch controls container if it doesn't exist
    let touchControls = document.querySelector('.touch-controls');
    if (!touchControls) {
        touchControls = document.createElement('div');
        touchControls.className = 'touch-controls';
        document.getElementById('game-container').appendChild(touchControls);
    }
    
    // Create D-pad and buttons
    createTouchInterface(touchControls);
    
    // Add fullscreen button
    addFullscreenButton();
    
    // Handle loading screen
    setupLoadingScreen();
    
    // Prevent default touch behaviors
    preventDefaultTouchBehaviors();
    
    // Handle orientation changes
    handleOrientationChanges();
}

function createTouchInterface(container) {
    // Clear any existing controls
    container.innerHTML = '';
    
    // Create D-pad
    const dpad = document.createElement('div');
    dpad.className = 'd-pad';
    
    // Create directional buttons
    const upBtn = createButton('up-btn', '↑');
    const downBtn = createButton('down-btn', '↓');
    const leftBtn = createButton('left-btn', '←');
    const rightBtn = createButton('right-btn', '→');
    
    // Add buttons to D-pad
    dpad.appendChild(upBtn);
    dpad.appendChild(downBtn);
    dpad.appendChild(leftBtn);
    dpad.appendChild(rightBtn);
    
    // Create shoot button
    const shootBtn = document.createElement('button');
    shootBtn.id = 'shoot-btn';
    shootBtn.textContent = 'FIRE';
    
    // Add elements to container
    container.appendChild(dpad);
    container.appendChild(shootBtn);
    
    // Add event listeners with proper touch handling
    setupButtonEventListeners();
}

function createButton(id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    return button;
}

function setupButtonEventListeners() {
    // Up button
    const upBtn = document.getElementById('up-btn');
    upBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        window.keys.w = true;
        window.keys.arrowUp = true;
        this.style.opacity = '0.7';
    }, { passive: false });
    
    upBtn.addEventListener('touchend', function() {
        window.keys.w = false;
        window.keys.arrowUp = false;
        this.style.opacity = '1';
    });
    
    // Down button
    const downBtn = document.getElementById('down-btn');
    downBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        window.keys.s = true;
        window.keys.arrowDown = true;
        this.style.opacity = '0.7';
    }, { passive: false });
    
    downBtn.addEventListener('touchend', function() {
        window.keys.s = false;
        window.keys.arrowDown = false;
        this.style.opacity = '1';
    });
    
    // Left button
    const leftBtn = document.getElementById('left-btn');
    leftBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        window.keys.a = true;
        window.keys.arrowLeft = true;
        this.style.opacity = '0.7';
    }, { passive: false });
    
    leftBtn.addEventListener('touchend', function() {
        window.keys.a = false;
        window.keys.arrowLeft = false;
        this.style.opacity = '1';
    });
    
    // Right button
    const rightBtn = document.getElementById('right-btn');
    rightBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        window.keys.d = true;
        window.keys.arrowRight = true;
        this.style.opacity = '0.7';
    }, { passive: false });
    
    rightBtn.addEventListener('touchend', function() {
        window.keys.d = false;
        window.keys.arrowRight = false;
        this.style.opacity = '1';
    });
    
    // Shoot button
    const shootBtn = document.getElementById('shoot-btn');
    shootBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        window.keys.space = true;
        this.style.opacity = '0.7';
    }, { passive: false });
    
    shootBtn.addEventListener('touchend', function() {
        window.keys.space = false;
        this.style.opacity = '1';
    });
    
    // Handle touch move events outside buttons
    document.addEventListener('touchmove', function(e) {
        // Prevent scrolling
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }, { passive: false });
}

function addFullscreenButton() {
    // Create fullscreen button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.id = 'fullscreen-btn';
    fullscreenBtn.textContent = 'Fullscreen';
    fullscreenBtn.style.position = 'absolute';
    fullscreenBtn.style.top = '10px';
    fullscreenBtn.style.right = '10px';
    fullscreenBtn.style.zIndex = '102';
    fullscreenBtn.style.background = 'rgba(0,0,0,0.5)';
    fullscreenBtn.style.color = 'white';
    fullscreenBtn.style.border = 'none';
    fullscreenBtn.style.borderRadius = '5px';
    fullscreenBtn.style.padding = '5px 10px';
    
    document.getElementById('game-container').appendChild(fullscreenBtn);
    
    // Add fullscreen functionality
    fullscreenBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        toggleFullscreen();
    }, { passive: false });
}

function toggleFullscreen() {
    const gameContainer = document.getElementById('game-container');
    
    if (!document.fullscreenElement) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.mozRequestFullScreen) {
            gameContainer.mozRequestFullScreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        }
        
        // Try to lock to landscape if possible
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(e => console.log(e));
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function setupLoadingScreen() {
    // Get or create loading screen
    let loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) {
        loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.innerHTML = `
            <h2>Ukrainian Combat Tank</h2>
            <p>Loading game...</p>
            <p>Tap to start</p>
        `;
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.top = '0';
        loadingScreen.style.left = '0';
        loadingScreen.style.width = '100%';
        loadingScreen.style.height = '100%';
        loadingScreen.style.background = '#1a1a1a';
        loadingScreen.style.color = 'white';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.flexDirection = 'column';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.zIndex = '1000';
        
        document.body.appendChild(loadingScreen);
    }
    
    // Add tap to start functionality
    loadingScreen.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.display = 'none';
        
        // Initialize audio if available
        if (window.gameAudio && typeof window.gameAudio.initAudio === 'function') {
            window.gameAudio.initAudio();
        }
    }, { passive: false });
    
    // Also handle mouse clicks for testing on desktop
    loadingScreen.addEventListener('click', function() {
        this.style.display = 'none';
        
        // Initialize audio if available
        if (window.gameAudio && typeof window.gameAudio.initAudio === 'function') {
            window.gameAudio.initAudio();
        }
    });
}

function preventDefaultTouchBehaviors() {
    // Prevent all default touch behaviors on the game canvas
    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) {
        gameCanvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        gameCanvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        gameCanvas.addEventListener('touchend', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
    
    // Prevent pull-to-refresh and other browser gestures
    document.addEventListener('touchmove', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }, { passive: false });
}

function handleOrientationChanges() {
    window.addEventListener('orientationchange', function() {
        // Adjust layout after orientation change
        setTimeout(function() {
            const isLandscape = window.innerWidth > window.innerHeight;
            const dpad = document.querySelector('.d-pad');
            const shootBtn = document.getElementById('shoot-btn');
            
            if (dpad && shootBtn) {
                if (isLandscape) {
                    // Landscape orientation
                    dpad.style.bottom = '10px';
                    shootBtn.style.bottom = '10px';
                } else {
                    // Portrait orientation
                    dpad.style.bottom = '20px';
                    shootBtn.style.bottom = '30px';
                }
            }
        }, 300); // Small delay to allow orientation to complete
    });
}

// Optimize for mobile performance
function optimizeForMobile() {
    // Reduce canvas size for better performance
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.width = 600;
        canvas.height = 450;
    }
    
    // Reduce enemy count if MAX_ENEMIES is defined
    if (typeof window.MAX_ENEMIES !== 'undefined') {
        window.MAX_ENEMIES = 3;
    }
}

// Call optimization function
if (isMobile) {
    optimizeForMobile();
}
