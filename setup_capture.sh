#!/bin/bash

echo "Setting up screenshot capture tools..."
echo "======================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed."
    echo "Please install Python 3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is required but not installed."
    echo "Please install pip3 first."
    exit 1
fi

# Install Python requirements
echo "Installing Python requirements..."
pip3 install -r requirements.txt

# Check if Chrome is installed
if ! command -v "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" &> /dev/null; then
    echo "Google Chrome is required for automated screenshots."
    echo "Please install Chrome from: https://www.google.com/chrome/"
    echo ""
    echo "Alternatively, you can use the simple capture script:"
    echo "  chmod +x simple_capture.sh"
    echo "  ./simple_capture.sh"
    exit 1
fi

# Install ChromeDriver using webdriver-manager (handled by Python script)
echo "ChromeDriver will be automatically managed by the Python script."

# Make scripts executable
chmod +x simple_capture.sh
chmod +x capture_screenshots.py

echo ""
echo "Setup complete!"
echo ""
echo "You now have two options for capturing screenshots:"
echo ""
echo "1. AUTOMATED (Python + Selenium):"
echo "   python3 capture_screenshots.py"
echo ""
echo "2. MANUAL (Interactive with macOS tools):"
echo "   ./simple_capture.sh"
echo ""
echo "The manual option is recommended if you want more control"
echo "over timing and specific moments to capture."
