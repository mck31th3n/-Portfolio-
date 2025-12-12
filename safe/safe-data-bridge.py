#!/usr/bin/env python3
"""
SAFE Data Bridge - Reads live SAFE test data and serves it to the UI
Generates a JSON file that the JavaScript can fetch
"""

import csv
import json
import os
from datetime import datetime
from pathlib import Path

# Path to SAFE test data
SAFE_DIR = Path.home() / "Step"
OUTPUT_FILE = Path(__file__).parent / "safe-live-data.json"

def read_latest_csv_row(filename):
    """Read the last row from a CSV file"""
    filepath = SAFE_DIR / filename
    if not filepath.exists():
        return None

    try:
        with open(filepath, 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            return rows[-1] if rows else None
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return None

def count_csv_rows(filename):
    """Count total rows in a CSV file (excluding header)"""
    filepath = SAFE_DIR / filename
    if not filepath.exists():
        return 0

    try:
        with open(filepath, 'r') as f:
            return sum(1 for line in f) - 1  # Subtract header
    except Exception:
        return 0

def read_start_time():
    """Read the test start time"""
    filepath = SAFE_DIR / "safe_v4_fullpower_start.txt"
    if not filepath.exists():
        return None

    try:
        with open(filepath, 'r') as f:
            time_str = f.read().strip()
            return datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')
    except Exception:
        return None

def calculate_uptime(start_time):
    """Calculate uptime in hours, minutes, seconds"""
    if not start_time:
        return {"hours": 0, "minutes": 0, "seconds": 0, "totalHours": 0}

    elapsed = datetime.now() - start_time
    total_seconds = int(elapsed.total_seconds())

    return {
        "hours": total_seconds // 3600,
        "minutes": (total_seconds % 3600) // 60,
        "seconds": total_seconds % 60,
        "totalHours": round(total_seconds / 3600, 2)
    }

def generate_live_data():
    """Generate live data JSON from SAFE CSV files"""

    # Get portfolio data
    portfolio_row = read_latest_csv_row('paper_trading_v4_portfolio_snapshot.csv')
    portfolio_data = None
    if portfolio_row:
        portfolio_data = {
            "value": float(portfolio_row.get('portfolio_value', 10000)),
            "return": float(portfolio_row.get('return_pct', 0)),
            "cycles": int(portfolio_row.get('cycle_count', 0)),
            "timestamp": portfolio_row.get('timestamp', '')
        }

    # Get trading data
    total_decisions = count_csv_rows('paper_trading_v4_multi_asset.csv')

    # Get start time and calculate uptime
    start_time = read_start_time()
    uptime = calculate_uptime(start_time)

    # Build JSON output
    data = {
        "isRunning": start_time is not None,
        "startTime": start_time.isoformat() if start_time else None,
        "uptime": uptime,
        "portfolio": portfolio_data,
        "totalDecisions": total_decisions,
        "lastUpdate": datetime.now().isoformat()
    }

    return data

def main():
    """Main function - generate JSON and save to file"""
    print(f"🔄 Reading SAFE test data from {SAFE_DIR}...")

    data = generate_live_data()

    # Save to JSON file
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"✅ Live data written to {OUTPUT_FILE}")
    print(f"   Running: {data['isRunning']}")
    if data['isRunning']:
        print(f"   Uptime: {data['uptime']['hours']}h {data['uptime']['minutes']}m {data['uptime']['seconds']}s")
        print(f"   Cycles: {data['portfolio']['cycles'] if data['portfolio'] else 0}")
        print(f"   Decisions: {data['totalDecisions']}")
        if data['portfolio']:
            print(f"   Portfolio: ${data['portfolio']['value']:.2f} ({data['portfolio']['return']:+.2f}%)")

if __name__ == '__main__':
    main()
