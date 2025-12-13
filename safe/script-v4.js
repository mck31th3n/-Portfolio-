// S.A.F.E. V4.0 - Tier 1.5 Blended with Polished Obsidian
// Intelligence Core + Timeline + Luxury Graph Animations

// ====================================
// GLOBAL STATE
// ====================================

const SAFEState = {
    startTime: Date.now(),
    cycles: 0,
    decisions: 0,
    learningReports: 0,
    mode: 'execution',
    latency: 1.2,
    temperature: 23,
    uptime: 0
};

// ====================================
// INTELLIGENCE CORE ANIMATION (Tier 1.5)
// ====================================

class IntelligenceCore {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.rotation = 0;
        this.pulsePhase = 0;

        this.animate();
    }

    drawCore() {
        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dark gradient background
        const bgGradient = ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, 200
        );
        bgGradient.addColorStop(0, 'rgba(18, 18, 18, 0.4)');
        bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.rotation);

        // Outer ring (glowing Eclipse Gold)
        const outerRadius = 150 + Math.sin(this.pulsePhase) * 5;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Middle ring (dimmer gold)
        const middleRadius = 100 + Math.sin(this.pulsePhase + 0.5) * 3;
        ctx.strokeStyle = '#8a7323';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, middleRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner core (glowing center)
        const innerRadius = 50 + Math.sin(this.pulsePhase + 1) * 2;
        ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // Ticking notches (12 around outer ring)
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 5;
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x1 = Math.cos(angle) * (outerRadius - 10);
            const y1 = Math.sin(angle) * (outerRadius - 10);
            const x2 = Math.cos(angle) * (outerRadius + 5);
            const y2 = Math.sin(angle) * (outerRadius + 5);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Pulse line (breathing effect - emerald green)
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff88';
        ctx.globalAlpha = 0.6 + Math.sin(this.pulsePhase) * 0.4;
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius + 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    animate() {
        this.rotation += 0.002; // Slow rotation
        this.pulsePhase += 0.03; // Breathing pulse

        this.drawCore();

        requestAnimationFrame(() => this.animate());
    }
}

// ====================================
// LIVE ENGINE TIMELINE (Tier 1.5)
// ====================================

class EngineTimeline {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.events = [];
        this.maxEvents = 60; // Last 60 seconds

        this.render();
        setInterval(() => this.addRandomEvent(), 3000); // Add event every 3 seconds
    }

    addRandomEvent() {
        const types = ['decision', 'data', 'audit', 'threat'];
        const colors = {
            decision: '#ffcc00',
            data: '#0099ff',
            audit: '#00ff88',
            threat: '#ff3b30'
        };

        const type = types[Math.floor(Math.random() * types.length)];
        this.events.push({
            time: Date.now(),
            type: type,
            color: colors[type]
        });

        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }

        this.render();
    }

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, width, height);

        // Draw baseline
        ctx.strokeStyle = '#8a7323';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Draw events
        const now = Date.now();
        const timeWindow = 60000; // 60 seconds

        this.events.forEach(event => {
            const age = now - event.time;
            if (age < timeWindow) {
                const x = width - (age / timeWindow) * width;
                const y = height / 2;

                ctx.fillStyle = event.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = event.color;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

        // Draw time markers (every 10 seconds)
        ctx.fillStyle = '#8e8e93';
        ctx.font = '9px JetBrains Mono';
        for (let i = 0; i <= 60; i += 10) {
            const x = width - (i / 60) * width;
            ctx.fillText(`-${i}s`, x - 15, height - 10);
        }
    }
}

// ====================================
// STATIC GLOW GRAPH (Original from The Owl)
// ====================================

function initStaticGlowGraph() {
    const canvas = document.getElementById('chart-animation');
    if (!canvas) {
        console.warn('⚠ Chart animation canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Use explicit dimensions from HTML or fallback to parent/defaults
    if (!canvas.width || canvas.width === 0) {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth || 600;
        canvas.height = parent.offsetHeight || 500;
    }

    console.log(`✓ Graph canvas initialized: ${canvas.width}x${canvas.height}`);

    // Graph configuration
    const numDots = 12;
    const dots = [];
    const colors = [
        { r: 255, g: 215, b: 0, name: 'gold' },      // Gold
        { r: 100, g: 180, b: 255, name: 'blue' },    // Blue
        { r: 0, g: 255, b: 204, name: 'teal' },      // Teal
        { r: 255, g: 200, b: 100, name: 'amber' }    // Amber
    ];

    // Initialize dots with upward trend (positive growth)
    for (let i = 0; i < numDots; i++) {
        const x = (i / (numDots - 1)) * (canvas.width * 0.8) + (canvas.width * 0.1);
        const baseY = canvas.height * 0.7;

        // Create upward trend: starts low, ends high
        const trendProgress = i / (numDots - 1); // 0 to 1
        const minHeight = canvas.height * 0.15; // Start at 15% height
        const maxHeight = canvas.height * 0.45; // End at 45% height
        const trendHeight = minHeight + (maxHeight - minHeight) * trendProgress;

        // Add slight randomness for organic feel (±5%)
        const randomVariation = (Math.random() - 0.5) * canvas.height * 0.05;
        const targetY = canvas.height * 0.7 - trendHeight + randomVariation;

        const color = colors[Math.floor(Math.random() * colors.length)];

        dots.push({
            x,
            baseY,
            currentY: baseY,
            targetY: Math.max(canvas.height * 0.2, Math.min(canvas.height * 0.6, targetY)),
            color,
            glowPhase: Math.random() * Math.PI * 2,
            glowSpeed: 0.02 + Math.random() * 0.01,
            verticalProgress: 0,
            showVertical: false,
            delay: i * 150
        });
    }

    let animationTime = 0;
    let cyclePhase = 'breathing'; // breathing -> vertical -> horizontal -> reset
    let horizontalProgress = 0;

    function drawDot(dot, glow) {
        // Dot with glow
        ctx.beginPath();
        ctx.arc(dot.x, dot.currentY, 6, 0, Math.PI * 2);

        // Glow effect
        const gradient = ctx.createRadialGradient(dot.x, dot.currentY, 0, dot.x, dot.currentY, 20 * glow);
        gradient.addColorStop(0, `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${glow})`);
        gradient.addColorStop(0.5, `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${glow * 0.3})`);
        gradient.addColorStop(1, `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Solid dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.currentY, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${0.8 + glow * 0.2})`;
        ctx.fill();
    }

    function drawVerticalLine(dot, progress) {
        if (progress <= 0) return;

        const lineHeight = (dot.baseY - dot.targetY) * progress;
        const currentTop = dot.baseY - lineHeight;

        // Gradient line
        const gradient = ctx.createLinearGradient(dot.x, dot.baseY, dot.x, currentTop);
        gradient.addColorStop(0, `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, 0.1)`);
        gradient.addColorStop(1, `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, 0.6)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.baseY);
        ctx.lineTo(dot.x, currentTop);
        ctx.stroke();

        // Glow on line
        ctx.shadowColor = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, 0.4)`;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    function drawHorizontalConnection(progress) {
        if (progress <= 0) return;

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        for (let i = 0; i < dots.length - 1; i++) {
            const dot1 = dots[i];
            const dot2 = dots[i + 1];

            if (i === 0) {
                ctx.moveTo(dot1.x, dot1.currentY);
            }

            // Only draw up to progress point
            const segmentProgress = Math.max(0, Math.min(1, (progress * dots.length) - i));
            if (segmentProgress > 0) {
                const x = dot1.x + (dot2.x - dot1.x) * segmentProgress;
                const y = dot1.currentY + (dot2.currentY - dot1.currentY) * segmentProgress;
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dark gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, 'rgba(18, 18, 18, 0.4)');
        bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        animationTime += 16; // ~60fps

        // Phase management
        if (cyclePhase === 'breathing') {
            if (animationTime > 3000) {
                cyclePhase = 'vertical';
                animationTime = 0;
            }
        } else if (cyclePhase === 'vertical') {
            if (animationTime > 2000) {
                cyclePhase = 'horizontal';
                animationTime = 0;
            }
        } else if (cyclePhase === 'horizontal') {
            if (animationTime > 2000) {
                cyclePhase = 'reset';
                animationTime = 0;
            }
        } else if (cyclePhase === 'reset') {
            // Smoothly animate dots back down instead of hard reset
            const resetProgress = Math.min(1, animationTime / 1000);
            dots.forEach(dot => {
                // Animate from current position back to baseY
                const reverseProgress = 1 - resetProgress;
                dot.currentY = dot.baseY - (dot.baseY - dot.targetY) * easeOutCubic(reverseProgress);
                dot.verticalProgress = reverseProgress;
            });

            if (animationTime > 1000) {
                cyclePhase = 'breathing';
                animationTime = 0;
                dots.forEach(dot => {
                    dot.verticalProgress = 0;
                    dot.currentY = dot.baseY;
                });
                horizontalProgress = 0;
            }
        }

        // Update and draw based on phase
        dots.forEach((dot, i) => {
            // Breathing glow
            const glow = 0.3 + Math.sin(dot.glowPhase) * 0.3;
            dot.glowPhase += dot.glowSpeed;

            // Vertical growth
            if (cyclePhase === 'vertical') {
                const delayedProgress = Math.max(0, (animationTime - dot.delay) / (2000 - dot.delay));
                dot.verticalProgress = Math.min(1, delayedProgress);
                dot.currentY = dot.baseY - (dot.baseY - dot.targetY) * easeOutCubic(dot.verticalProgress);
            }

            // Draw vertical line
            if (dot.verticalProgress > 0) {
                drawVerticalLine(dot, dot.verticalProgress);
            }

            // Draw dot
            drawDot(dot, glow);
        });

        // Horizontal connection
        if (cyclePhase === 'horizontal') {
            horizontalProgress = Math.min(1, animationTime / 2000);
            drawHorizontalConnection(easeInOutCubic(horizontalProgress));
        } else if (cyclePhase === 'reset') {
            const fadeProgress = 1 - (animationTime / 1000);
            if (fadeProgress > 0) {
                ctx.globalAlpha = fadeProgress;
                drawHorizontalConnection(1);
                ctx.globalAlpha = 1;
            }
        } else if (horizontalProgress > 0 && cyclePhase !== 'breathing') {
            drawHorizontalConnection(1);
        }

        requestAnimationFrame(animate);
    }

    // Easing functions
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    animate();
}

// ====================================
// REAL-TIME METRICS UPDATER (Tier 1.5)
// ====================================

function updateMetrics() {
    SAFEState.uptime = Math.floor((Date.now() - SAFEState.startTime) / 1000);
    SAFEState.cycles++;

    // Update runtime cycles
    const cycleElements = document.querySelectorAll('#runtime-cycles, #audit-cycles');
    cycleElements.forEach(el => {
        if (el) el.textContent = SAFEState.cycles;
    });

    // Update uptime
    const hours = Math.floor(SAFEState.uptime / 3600);
    const minutes = Math.floor((SAFEState.uptime % 3600) / 60);
    const seconds = SAFEState.uptime % 60;
    const uptimeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const uptimeElements = document.querySelectorAll('#uptime, #uptime-display');
    uptimeElements.forEach(el => {
        if (el) el.textContent = uptimeString;
    });

    // Update temperature (simulated load)
    SAFEState.temperature = 20 + Math.random() * 10;
    const tempEl = document.getElementById('temperature');
    if (tempEl) tempEl.textContent = `${Math.floor(SAFEState.temperature)}%`;

    // Update latency (simulated)
    SAFEState.latency = 1.0 + Math.random() * 0.5;
    const latencyEl = document.getElementById('latency');
    if (latencyEl) latencyEl.textContent = `${SAFEState.latency.toFixed(1)}ms`;
}

// ====================================
// MODE SWITCHER (Tier 1.5)
// ====================================

function initModeswitch() {
    const modeOptions = document.querySelectorAll('.mode-option');

    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active from all
            modeOptions.forEach(opt => opt.classList.remove('active'));

            // Add active to clicked
            option.classList.add('active');

            // Update mode
            SAFEState.mode = option.dataset.mode;

            // Update core reasoning mode text
            const modeTexts = {
                execution: 'Pattern Recognition',
                audit: 'Integrity Verification',
                isolated: 'Temporal Isolation',
                blind: 'Sanitized Analysis'
            };

            const coreModeEl = document.getElementById('core-reasoning-mode');
            if (coreModeEl) {
                coreModeEl.textContent = modeTexts[SAFEState.mode];
            }

            addSystemMessage(`Mode switched to ${SAFEState.mode.toUpperCase()}`);
        });
    });
}

// ====================================
// SYSTEM MESSAGES (Tier 1.5)
// ====================================

const systemMessages = [
    'Integrity holds.',
    'Noise rejected.',
    'Signal confirmed.',
    'Cycle complete.',
    'Pattern recognized.',
    'Volatility assessed.',
    'Drift minimized.',
    'Contamination: zero.',
    'Audit complete.',
    'Temporal sync verified.'
];

function addSystemMessage(text) {
    const feed = document.getElementById('system-messages');
    if (!feed) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });

    const messageEl = document.createElement('div');
    messageEl.className = 'system-message';
    messageEl.innerHTML = `
        <span class="message-time">${timeString}</span>
        <span class="message-text">${text}</span>
    `;

    feed.insertBefore(messageEl, feed.firstChild);

    // Keep only last 10 messages
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
}

function generateSystemMessages() {
    const message = systemMessages[Math.floor(Math.random() * systemMessages.length)];
    addSystemMessage(message);
}

// ====================================
// SIMULATED LIVE DATA (Tier 1.5)
// ====================================

function updateLiveData() {
    // Simulate decisions
    if (Math.random() < 0.1) { // 10% chance per update
        SAFEState.decisions++;
        const decisionsEl = document.getElementById('total-decisions');
        if (decisionsEl) decisionsEl.textContent = SAFEState.decisions;
    }

    // Simulate learning reports
    if (Math.random() < 0.05) { // 5% chance
        SAFEState.learningReports++;
        const reportsEl = document.getElementById('learning-reports');
        if (reportsEl) reportsEl.textContent = SAFEState.learningReports;
    }

    // Update portfolio value (simulated)
    const portfolioEl = document.getElementById('portfolio-value');
    if (portfolioEl) {
        const baseValue = 10000;
        const variance = (Math.random() - 0.5) * 100;
        portfolioEl.textContent = `$${(baseValue + variance).toFixed(2)}`;
    }

    // Update win rate
    const winRateEl = document.getElementById('win-rate');
    if (winRateEl && SAFEState.decisions > 0) {
        const rate = 55 + (Math.random() - 0.5) * 10;
        winRateEl.textContent = `${rate.toFixed(1)}%`;
    }

    // Update active positions
    const positionsEl = document.getElementById('active-positions');
    if (positionsEl) {
        const positions = Math.floor(Math.random() * 5);
        positionsEl.textContent = positions;
    }

    // Update CPU/memory
    const cpuEl = document.getElementById('cpu-load');
    if (cpuEl) {
        const cpu = 20 + Math.random() * 20;
        cpuEl.textContent = `${Math.floor(cpu)}%`;
    }

    const memEl = document.getElementById('memory-usage');
    if (memEl) {
        const mem = 0.8 + Math.random() * 0.3;
        memEl.textContent = `${mem.toFixed(1)}%`;
    }

    // Update API calls
    const apiEl = document.getElementById('api-calls');
    if (apiEl) {
        const calls = SAFEState.cycles * 3; // Roughly
        apiEl.textContent = calls;
    }
}

// ====================================
// MAGNETIC CURSOR (from The Owl)
// ====================================

function initMagneticCursor() {
    const magneticElements = document.querySelectorAll('.btn, .feature, .doc-card, .arch-node, .quant-panel');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.08;
            const moveY = y * 0.08;

            this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.01)`;
        });

        el.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// ====================================
// GLOSSY REFLECTIONS (from The Owl)
// ====================================

function initGlossyReflections() {
    document.querySelectorAll('.feature, .status-panel, .doc-card, .quant-panel').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            this.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.06), transparent 40%),
                linear-gradient(145deg, rgba(18, 18, 18, 0.95), rgba(0, 0, 0, 0.98))
            `;
        });

        card.addEventListener('mouseleave', function () {
            this.style.background = '';
        });
    });
}

// ====================================
// SMOOTH SCROLL (from The Owl)
// ====================================

function initExecutiveScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ====================================
// CINEMATIC ANIMATIONS (from The Owl)
// ====================================

function initCinematicAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 120);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '-50px'
    });

    document.querySelectorAll('.feature, .doc-card, .ring, .arch-node, .quant-panel').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        observer.observe(el);
    });
}

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ', 'background: #000;');
    console.log('%c S.A.F.E. V4.0 ', 'background: #d4af37; color: #000; font-size: 24px; font-weight: bold; padding: 12px 24px; font-family: Cinzel; letter-spacing: 6px;');
    console.log('%c Tier 1.5 Intelligence Engine × Polished Obsidian ', 'color: #E8EEF2; font-size: 14px; font-family: Inter; letter-spacing: 3px; padding-left: 24px;');
    console.log('%c ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ', 'background: #000;');
    console.log('');

    // Initialize Tier 1.5 features
    console.log('%c ✓ Initializing Intelligence Core... ', 'color: #d4af37; font-size: 12px; font-family: Inter; font-weight: bold;');
    const core = new IntelligenceCore('intelligence-core-canvas');

    console.log('%c ✓ Initializing Timeline... ', 'color: #d4af37; font-size: 12px; font-family: Inter; font-weight: bold;');
    const timeline = new EngineTimeline('engine-timeline');

    console.log('%c ✓ Initializing Mode Switcher... ', 'color: #d4af37; font-size: 12px; font-family: Inter; font-weight: bold;');
    initModeswitch();

    // Start metric updates (Tier 1.5)
    setInterval(updateMetrics, 1000); // Update every second
    setInterval(updateLiveData, 2000); // Update every 2 seconds
    setInterval(generateSystemMessages, 5000); // Every 5 seconds

    // Initial update
    updateMetrics();
    updateLiveData();

    // Initialize luxury features (from The Owl)
    setTimeout(() => {
        console.log('%c ✓ Initializing Static Glow Graph... ', 'color: #FFD700; font-size: 12px; font-family: Inter; font-weight: bold;');
        initStaticGlowGraph();
    }, 300);

    setTimeout(() => initExecutiveScroll(), 600);
    setTimeout(() => initCinematicAnimations(), 900);
    setTimeout(() => initMagneticCursor(), 1200);
    setTimeout(() => initGlossyReflections(), 1500);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const canvas = document.getElementById('chart-animation');
            if (canvas) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
        }, 300);
    });

    console.log('%c ✓ All systems operational ', 'color: #00ff88; font-size: 12px; font-family: Inter; font-weight: bold;');
});
