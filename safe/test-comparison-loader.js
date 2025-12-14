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
        // If loading fails, the static HTML values will still be visible
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
        elements.duration.textContent = `${testData.duration_hours.toFixed(1)} hrs`;
    }

    if (elements.cycles) {
        elements.cycles.textContent = testData.cycles;
    }

    if (elements.return) {
        const returnPct = testData.performance.return_pct;
        elements.return.textContent = `${returnPct > 0 ? '+' : ''}${returnPct.toFixed(3)}%`;
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
    const range = maxValue - minValue || 1; // Prevent division by zero
    const padding = 60;

    // Define colors based on test type
    const isBaseline = canvasId.includes('baseline');
    const lineColor = isBaseline ? 'rgba(74, 144, 226, 1)' : 'rgba(39, 174, 96, 1)';
    const fillColor = isBaseline ? 'rgba(74, 144, 226, 0.15)' : 'rgba(39, 174, 96, 0.15)';
    const pointColor = isBaseline ? 'rgba(74, 144, 226, 0.9)' : 'rgba(39, 174, 96, 0.9)';

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

    // Draw baseline at $10,000 (starting capital)
    if (range > 0) {
        const baselineY = padding + (h - padding * 2) * (1 - (10000 - minValue) / range);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, baselineY);
        ctx.lineTo(w - padding, baselineY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label for $10,000 line
        ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('$10,000 (start)', w - padding + 5, baselineY + 4);
    }

    // Plot area under curve
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
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw data points (first and last emphasized)
    chartData.forEach((point, i) => {
        const x = padding + (w - padding * 2) * i / (chartData.length - 1);
        const y = padding + (h - padding * 2) * (1 - (point.portfolio_value - minValue) / range);

        // Emphasize first and last points
        const isEndpoint = i === 0 || i === chartData.length - 1;
        const radius = isEndpoint ? 5 : 2;
        const opacity = isEndpoint ? 1 : 0.6;

        ctx.fillStyle = pointColor.replace('0.9', opacity.toString());
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Add value labels for first and last points
        if (isEndpoint) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.textAlign = i === 0 ? 'left' : 'right';

            const value = point.portfolio_value.toFixed(2);
            const returnPct = ((point.portfolio_value - 10000) / 10000 * 100).toFixed(3);
            const label = `$${value}\n(${returnPct > 0 ? '+' : ''}${returnPct}%)`;

            // Draw background for text
            const textMetrics = ctx.measureText(`$${value}`);
            const textWidth = textMetrics.width + 10;
            const textHeight = 36;
            const bgX = i === 0 ? x - 5 : x - textWidth + 5;
            const bgY = y - textHeight - 5;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(bgX, bgY, textWidth, textHeight);

            // Draw text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.textBaseline = 'top';
            const textX = i === 0 ? x : x - 5;
            ctx.fillText(`$${value}`, textX, bgY + 3);

            ctx.font = '11px Inter, sans-serif';
            ctx.fillStyle = returnPct < 0 ? 'rgba(231, 76, 60, 0.9)' : 'rgba(39, 174, 96, 0.9)';
            ctx.fillText(`(${returnPct > 0 ? '+' : ''}${returnPct}%)`, textX, bgY + 19);
        }
    });

    // Draw Y-axis labels with better visibility
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 5; i++) {
        const value = maxValue - (range * i / 5);
        const y = padding + (h - padding * 2) * i / 5;

        // Draw background for better readability
        const text = `$${value.toFixed(0)}`;
        const textMetrics = ctx.measureText(text);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(2, y - 8, textMetrics.width + 6, 16);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(text, padding - 10, y);
    }

    // Draw time axis labels
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textBaseline = 'top';

    ctx.fillText('Start', padding, h - padding + 10);
    ctx.fillText('End', w - padding, h - padding + 10);
    ctx.fillText(`Duration: ${testData.duration_hours.toFixed(1)} hours`, w / 2, h - padding + 10);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTestComparison);
} else {
    loadTestComparison();
}
