#!/bin/bash
################################################################################
# SAFE Live Data Updater
# Runs the Python data bridge every 5 seconds to keep UI data fresh
################################################################################

cd "$(dirname "$0")"

echo "🔄 Starting SAFE live data feed..."
echo "Press Ctrl+C to stop"
echo ""

while true; do
    python3 safe-data-bridge.py
    sleep 5
done
