/**
 * SAFE V4.0 - Live Data Connector
 * Reads real data from SAFE's JSON feed and updates the UI
 *
 * Note: Requires safe-data-bridge.py to be running to generate safe-live-data.json
 */

class SAFELiveConnector {
    constructor() {
        // DEPLOYMENT MODE: Set to 'demo' for GitHub Pages, 'live' for local development
        this.mode = 'demo'; // Change to 'live' when running locally with SAFE
        this.dataFile = this.mode === 'demo' ? 'safe-demo-data.json' : 'safe-live-data.json';
        this.updateInterval = 5000; // Update every 5 seconds
        this.isRunning = false;
        this.lastData = null;
    }

    async fetchLiveData() {
        try {
            // Add cache-busting timestamp to ensure fresh data
            const response = await fetch(`${this.dataFile}?t=${Date.now()}`);
            if (!response.ok) {
                console.log('⏳ Waiting for SAFE data...');
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('⏳ SAFE data not available yet - is safe-data-bridge.py running?');
            return null;
        }
    }

    async updateUI() {
        const data = await this.fetchLiveData();
        if (!data) return;

        // First time getting data
        if (!this.isRunning && data.isRunning) {
            this.isRunning = true;
            console.log('✅ Connected to SAFE live data');
            console.log(`Start time: ${new Date(data.startTime).toLocaleString()}`);
        }

        this.lastData = data;

        // Update uptime
        if (data.uptime) {
            const uptimeString = `${String(data.uptime.hours).padStart(2, '0')}:${String(data.uptime.minutes).padStart(2, '0')}:${String(data.uptime.seconds).padStart(2, '0')}`;

            const uptimeElements = document.querySelectorAll('#uptime, #uptime-display');
            uptimeElements.forEach(el => {
                if (el) el.textContent = uptimeString;
            });

            // Update progress indicator (24-hour test)
            const progressEl = document.getElementById('test-progress');
            if (progressEl) {
                const progress = Math.min((data.uptime.totalHours / 24) * 100, 100);
                progressEl.style.width = `${progress}%`;
            }
        }

        // Update portfolio data
        if (data.portfolio) {
            // Update portfolio value
            const valueEl = document.getElementById('portfolio-value');
            if (valueEl) valueEl.textContent = `$${data.portfolio.value.toFixed(2)}`;

            // Update return
            const returnEl = document.getElementById('portfolio-return');
            if (returnEl) {
                returnEl.textContent = `${data.portfolio.return >= 0 ? '+' : ''}${data.portfolio.return.toFixed(2)}%`;
                returnEl.style.color = data.portfolio.return >= 0 ? '#4caf50' : '#ff5252';
            }

            // Update cycles
            const cycleElements = document.querySelectorAll('#runtime-cycles, #audit-cycles');
            cycleElements.forEach(el => {
                if (el) el.textContent = data.portfolio.cycles;
            });
        }

        // Update total decisions
        if (data.totalDecisions !== undefined) {
            const decisionsEl = document.getElementById('total-decisions');
            if (decisionsEl) decisionsEl.textContent = data.totalDecisions;
        }

        // Update status indicator
        const statusEl = document.getElementById('system-status');
        if (statusEl) {
            if (data.isRunning) {
                statusEl.textContent = 'RUNNING';
                statusEl.style.color = '#4caf50';
            } else {
                statusEl.textContent = 'WAITING';
                statusEl.style.color = '#ff9800';
            }
        }
    }

    start() {
        console.log('🔄 Starting SAFE Live Data Connector...');

        // Initial update
        this.updateUI();

        // Set up periodic updates
        setInterval(() => this.updateUI(), this.updateInterval);

        console.log(`✅ Live updates every ${this.updateInterval / 1000} seconds`);
    }
}

// Auto-start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.safeLiveConnector = new SAFELiveConnector();
        window.safeLiveConnector.start();
    });
} else {
    window.safeLiveConnector = new SAFELiveConnector();
    window.safeLiveConnector.start();
}
