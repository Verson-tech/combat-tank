#!/usr/bin/env python3
"""
Screenshot Capture Script for Combat Tank Game
This script automates the process of capturing screenshots and gameplay footage
for documentation purposes.
"""

import os
import time
import subprocess
import webbrowser
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import requests

class GameScreenshotCapture:
    def __init__(self, game_url="file:///Users/viramurray/Desktop/Development/my_pygame_project/combat_tank/index.html"):
        self.game_url = game_url
        self.screenshots_dir = "screenshots"
        self.setup_directories()
        self.driver = None
        
    def setup_directories(self):
        """Create directories for organizing screenshots"""
        directories = [
            self.screenshots_dir,
            f"{self.screenshots_dir}/gameplay",
            f"{self.screenshots_dir}/mobile",
            f"{self.screenshots_dir}/ui_elements"
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
            print(f"Created directory: {directory}")
    
    def setup_driver(self, mobile=False):
        """Setup Chrome WebDriver with appropriate options"""
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        if mobile:
            # Mobile emulation
            mobile_emulation = {
                "deviceMetrics": {"width": 375, "height": 667, "pixelRatio": 2.0},
                "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15"
            }
            chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            print(f"WebDriver initialized ({'Mobile' if mobile else 'Desktop'} mode)")
            return True
        except Exception as e:
            print(f"Failed to initialize WebDriver: {e}")
            print("Make sure ChromeDriver is installed and in your PATH")
            return False
    
    def capture_loading_screen(self):
        """Capture the game loading screen"""
        print("Capturing loading screen...")
        self.driver.get(self.game_url)
        time.sleep(2)  # Wait for loading screen to appear
        
        screenshot_path = f"{self.screenshots_dir}/ui_elements/loading_screen.png"
        self.driver.save_screenshot(screenshot_path)
        print(f"Loading screen captured: {screenshot_path}")
    
    def start_game_and_capture_gameplay(self):
        """Start the game and capture various gameplay moments"""
        print("Starting game and capturing gameplay...")
        
        try:
            # Wait for and click the start button or tap to start
            start_element = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, "loading-screen"))
            )
            start_element.click()
            time.sleep(3)  # Wait for game to start
            
            # Capture initial game state
            screenshot_path = f"{self.screenshots_dir}/gameplay/game_start.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"Game start captured: {screenshot_path}")
            
            # Simulate some gameplay actions
            self.simulate_gameplay()
            
        except Exception as e:
            print(f"Error during gameplay capture: {e}")
    
    def simulate_gameplay(self):
        """Simulate gameplay actions and capture screenshots"""
        actions = ActionChains(self.driver)
        
        # Find the game canvas
        try:
            canvas = self.driver.find_element(By.ID, "gameCanvas")
            
            # Simulate movement and shooting
            gameplay_actions = [
                ("move_right", "ArrowRight"),
                ("move_down", "ArrowDown"),
                ("shoot", " "),  # Spacebar
                ("move_left", "ArrowLeft"),
                ("move_up", "ArrowUp")
            ]
            
            for i, (action_name, key) in enumerate(gameplay_actions):
                # Send key press
                actions.send_keys(key).perform()
                time.sleep(1)
                
                # Capture screenshot
                screenshot_path = f"{self.screenshots_dir}/gameplay/{action_name}_{i+1}.png"
                self.driver.save_screenshot(screenshot_path)
                print(f"Gameplay action '{action_name}' captured: {screenshot_path}")
                
                time.sleep(0.5)  # Brief pause between actions
                
        except Exception as e:
            print(f"Error simulating gameplay: {e}")
    
    def capture_mobile_version(self):
        """Capture mobile version screenshots"""
        print("Capturing mobile version...")
        
        # Reinitialize driver for mobile
        if self.driver:
            self.driver.quit()
        
        if not self.setup_driver(mobile=True):
            return
        
        self.driver.get(self.game_url)
        time.sleep(3)
        
        # Capture mobile loading screen
        screenshot_path = f"{self.screenshots_dir}/mobile/mobile_loading.png"
        self.driver.save_screenshot(screenshot_path)
        print(f"Mobile loading screen captured: {screenshot_path}")
        
        # Start mobile game
        try:
            start_element = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, "loading-screen"))
            )
            start_element.click()
            time.sleep(3)
            
            # Capture mobile gameplay
            screenshot_path = f"{self.screenshots_dir}/mobile/mobile_gameplay.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"Mobile gameplay captured: {screenshot_path}")
            
            # Try to capture touch controls if visible
            try:
                touch_controls = self.driver.find_element(By.CLASS_NAME, "touch-controls")
                if touch_controls.is_displayed():
                    screenshot_path = f"{self.screenshots_dir}/mobile/touch_controls.png"
                    self.driver.save_screenshot(screenshot_path)
                    print(f"Touch controls captured: {screenshot_path}")
            except:
                print("Touch controls not found or not visible")
                
        except Exception as e:
            print(f"Error capturing mobile version: {e}")
    
    def capture_ui_elements(self):
        """Capture specific UI elements"""
        print("Capturing UI elements...")
        
        # Switch back to desktop mode
        if self.driver:
            self.driver.quit()
        
        if not self.setup_driver(mobile=False):
            return
        
        self.driver.get(self.game_url)
        time.sleep(3)
        
        # Start the game to access UI elements
        try:
            start_element = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, "loading-screen"))
            )
            start_element.click()
            time.sleep(3)
            
            # Capture score and lives display
            screenshot_path = f"{self.screenshots_dir}/ui_elements/game_ui.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"Game UI captured: {screenshot_path}")
            
        except Exception as e:
            print(f"Error capturing UI elements: {e}")
    
    def generate_screenshot_report(self):
        """Generate a report of all captured screenshots"""
        report_path = f"{self.screenshots_dir}/screenshot_report.md"
        
        with open(report_path, 'w') as f:
            f.write("# Combat Tank Game - Screenshot Documentation\n\n")
            f.write("This report contains all captured screenshots for the article.\n\n")
            
            # List all screenshots
            for root, dirs, files in os.walk(self.screenshots_dir):
                if files:
                    relative_path = os.path.relpath(root, self.screenshots_dir)
                    if relative_path != ".":
                        f.write(f"## {relative_path.replace('_', ' ').title()}\n\n")
                    
                    for file in sorted(files):
                        if file.endswith('.png'):
                            file_path = os.path.join(root, file)
                            relative_file_path = os.path.relpath(file_path, self.screenshots_dir)
                            f.write(f"- ![{file}]({relative_file_path})\n")
                    f.write("\n")
        
        print(f"Screenshot report generated: {report_path}")
    
    def run_full_capture(self):
        """Run the complete screenshot capture process"""
        print("Starting full screenshot capture process...")
        print("=" * 50)
        
        # Desktop captures
        if self.setup_driver(mobile=False):
            self.capture_loading_screen()
            self.start_game_and_capture_gameplay()
            self.capture_ui_elements()
        
        # Mobile captures
        self.capture_mobile_version()
        
        # Generate report
        self.generate_screenshot_report()
        
        # Cleanup
        if self.driver:
            self.driver.quit()
        
        print("=" * 50)
        print("Screenshot capture complete!")
        print(f"All screenshots saved in: {self.screenshots_dir}/")
        print("Check screenshot_report.md for a complete list of captured images.")

def main():
    """Main function to run the screenshot capture"""
    print("Combat Tank Game - Screenshot Capture Tool")
    print("=" * 50)
    
    # Check if game file exists
    game_file = "/Users/viramurray/Desktop/Development/my_pygame_project/combat_tank/index.html"
    if not os.path.exists(game_file):
        print(f"Game file not found: {game_file}")
        print("Please ensure the game file exists before running this script.")
        return
    
    # Initialize and run capture
    capturer = GameScreenshotCapture(f"file://{game_file}")
    
    try:
        capturer.run_full_capture()
    except KeyboardInterrupt:
        print("\nCapture interrupted by user.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if capturer.driver:
            capturer.driver.quit()

if __name__ == "__main__":
    main()
