/**
 * Test Comparison Data Loader
 * Loads sanitized test results and renders comparison charts
 */

// Load and display test comparison data
async function loadTestComparison() {
    try {
        const response = await fetch('test_comparison_data.json');
        const data = await response.json();

        // Update stats for both tests
        updateTestStats(data.tests[0], 'baseline');
        updateTestStats(data.tests[1], 'fullpower');

        // Render charts
        renderTestChart(data.tests[0], 'baseline-chart');
        renderTestChart(data.tests[1], 'fullpower-chart');

        console.log('✅ Test comparison data loaded successfully');
    } catch (error) {
        console.error('Error loading test comparison:', error);
    }
}

// Update test statistics in the UI
function updateTestStats(testData, prefix) {
    const elements = {
        duration: document.getElementById(`${prefix}-duration`),
        cycles: document.getElementById(`${prefix}-cycles`),
        return: document.getElementById(`${prefix}-return`),
        timestamp: document.getElementById(`${prefix}-timestamp`)
    };

    if (elements.duration) {
        elements.duration.textContent = `${testData.duration_hours} hrs`;
    }

    if (elements.cycles) {
        elements.cycles.textContent = testData.cycles;
    }

    if (elements.return) {
        elements.return.textContent = `${testData.performance.return_pct > 0 ? '+' : ''}${testData.performance.return_pct}%`;
    }

    if (elements.timestamp) {
        elements.timestamp.textContent = `${testData.start_time} → ${testData.end_time} EST`;
    }
}

// Render a line chart showing portfolio performance over time
function renderTestChart(testData, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Get data points
    const chartData = testData.chart_data;
    const values = chartData.map(d => d.portfolio_value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const padding = 40;

    // Define colors based on test type
    const isBaseline = canvasId.includes('baseline');
    const lineColor = isBaseline ? 'rgba(74, 144, 226, 0.8)' : 'rgba(39, 174, 96, 0.8)';
    const fillColor = isBaseline ? 'rgba(74, 144, 226, 0.15)' : 'rgba(39, 174, 96, 0.15)';

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (h - padding * 2) * i / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(w - padding, y);
        ctx.stroke();
    }

    // Draw baseline at $10,000
    const baselineY = padding + (h - padding * 2) * (1 - (10000 - minValue) / range);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, baselineY);
    ctx.lineTo(w - padding, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot data
    ctx.beginPath();
    chartData.forEach((point, i) => {
        const x = padding + (w - padding * 2) * i / (chartData.length - 1);
        const y = padding + (h - padding * 2) * (1 - (point.portfolio_value - minValue) / range);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    // Fill area under curve
    const lastX = padding + (w - padding * 2);
    ctx.lineTo(lastX, h - padding);
    ctx.lineTo(padding, h - padding);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    chartData.forEach((point, i) => {
        const x = padding + (w - padding * 2) * i / (chartData.length - 1);
        const y = padding + (h - padding * 2) * (1 - (point.portfolio_value - minValue) / range);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = lineColor;
    chartData.forEach((point, i) => {
        const x = padding + (w - padding * 2) * i / (chartData.length - 1);
        const y = padding + (h - padding * 2) * (1 - (point.portfolio_value - minValue) / range);

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Y-axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
        const value = maxValue - (range * i / 5);
        const y = padding + (h - padding * 2) * i / 5;
        ctx.fillText(`$${value.toFixed(0)}`, padding - 10, y + 4);
    }

    // Draw starting/ending values
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const startValue = chartData[0].portfolio_value;
    const endValue = chartData[chartData.length - 1].portfolio_value;

    // Start label
    ctx.fillText('Start', padding, h - 5);

    // End label
    ctx.fillText('End', w - padding, h - 5);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTestComparison);
} else {
    loadTestComparison();
}
