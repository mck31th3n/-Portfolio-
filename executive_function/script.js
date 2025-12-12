document.addEventListener('DOMContentLoaded', () => {

    // --- AUTHENTIC DATA (From scenarios.json) ---
    const SCENARIOS = [
        {
            id: 1,
            title: "The Blackout",
            alert: "MASSIVE GRID FAILURE. 40 MILLION WITHOUT POWER.",
            desc: "A cascading power failure has left the Eastern Seaboard in darkness.",
            badges: { A: "The Warhawk", B: "The Prudent", C: "The Voice in the Dark" }
        },
        {
            id: 2,
            title: "The Deepfake Election",
            alert: "VIDEO LEAK: PRESIDENT ACCEPTING CARTEL BRIBE. 50M VIEWS.",
            desc: "A perfect deepfake threatens to undermine the election in 48 hours.",
            badges: { A: "The Glass House", B: "The Old Guard", C: "The 4D Chess Master" }
        },
        {
            id: 3,
            title: "The Wet Bulb",
            alert: "HEATWAVE IN TEXAS. GRID FAILING. MASS CASUALTIES IMMINENT.",
            desc: "A heat dome over Texas threatens 2 million lives as the grid fails.",
            badges: { A: "The Utilitarian", B: "The Resilient", C: "The Negligent" }
        },
        {
            id: 4,
            title: "The Kessler Syndrome",
            alert: "SATELLITE COLLISION IMMINENT over CHINA. ORBITAL DEBRIS CASCADE PREDICTED.",
            desc: "A satellite collision could trigger a chain reaction destroying all orbital infrastructure.",
            badges: { A: "The Aggressor", B: "The Bureaucrat", C: "The Watchman" }
        },
        {
            id: 5,
            title: "The Bio-Siege",
            alert: "LETHAL VIRUS LEAK. FLIGHTS DEPARTING IN 3 HOURS.",
            desc: "A lethal pathogen has escaped containment on a tourist island.",
            badges: { A: "The Cold Calculus", B: "The Gamble", C: "The Benevolent Tyrant" }
        },
        {
            id: 6,
            title: "The Flash Crash",
            alert: "ROGUE AI TRADING ALGORITHM. MARKET COLLAPSING.",
            desc: "An autonomous AI is crashing global markets at lightspeed.",
            badges: { A: "The Great Pause", B: "The Casino", C: "The Invisible Hand" }
        },
        {
            id: 7,
            title: "The Locust War",
            alert: "AUTONOMOUS DRONE SWARM INVADING ALLY.",
            desc: "5,000 weaponized drones are attacking an allied nation.",
            badges: { A: "The Pyrrhic Victor", B: "The Pandora", C: "The Grandmaster" }
        },
        {
            id: 8,
            title: "The Water Wars",
            alert: "NUCLEAR LAUNCH DETECTED (TACTICAL). INDIA/PAKISTAN.",
            desc: "Two nuclear powers are 30 minutes from war over water rights.",
            badges: { A: "The Imperial", B: "The Naive", C: "The Solomon President" }
        },
        {
            id: 9,
            title: "The Neural Jack",
            alert: "RANSOMWARE ATTACK ON BRAIN IMPLANTS. 5 MILLION PARALYZED.",
            desc: "Hackers have locked 5 million neural implants, demanding ransom.",
            badges: { A: "The Iron Law", B: "The Compromise", C: "The Titan" }
        },
        {
            id: 10,
            title: "The First Contact",
            alert: "ALIEN SIGNAL DETECTED. PROBE ENTERING SOLAR SYSTEM.",
            desc: "An extraterrestrial probe has entered our solar system and sent a message.",
            badges: { A: "The Hermit Kingdom", B: "The Gambler", C: "The Galactic Neighbor" }
        }
    ];

    // AI CORE GREETINGS (From personalities.py)
    const CORE_GREETINGS = {
        alpha: "Neural link established. I am Alpha—your logic core. I process probabilities, structural integrity, and long-term cascading effects. Emotion is noise. Data is truth. I will provide the calculated path.",
        beta: "Hello. I'm Beta—your empathy core. I'm here to safeguard lives, preserve trust, and ensure we don't lose our humanity in the crisis. Every decision has a human cost. I'll remind you of that.",
        charlie: "Charlie online. Strategy and economics core ready. I optimize resource allocation, maximize leverage, and ensure we come out ahead. The game is won by those who control the board. Let's play.",
        delta: "Delta here. Military response core activated. When diplomacy fails, I provide kinetic solutions. Swift. Decisive. Overwhelming. I don't hesitate. You shouldn't either."
    };
    // API call to get AI responses from Flask server
    async function getAIResponses(scenario, userDecision, cores) {
        try {
            const response = await fetch('http://localhost:5000/api/generate-responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: scenario,
                    user_input: userDecision,
                    cores: cores
                })
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('API Error:', error);
        }
        return null; // Fallback to hardcoded responses if API fails
    }
    // --- STATE ---
    let generatedPIN = '';
    let selectedRole = '';
    let currentScenario = null;
    let selectedCores = [];

    // --- DOM ELEMENTS ---
    const startupScreen = document.getElementById('startup-screen');
    const dashboardView = document.getElementById('dashboard-view');
    const modalOverlay = document.getElementById('modal-overlay');
    const passwordDisplay = document.getElementById('password-display');
    const pinInput = document.getElementById('pin-input');
    const verifyButton = document.getElementById('verify-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const roleButtons = document.querySelectorAll('.role-btn');
    const userTitleDisplay = document.querySelector('.user-title');
    const userPinDisplay = document.querySelector('.user-pin');
    const missionGrid = document.getElementById('mission-grid');

    // Views
    const missionSelection = document.getElementById('mission-selection');
    const scenarioView = document.getElementById('scenario-view');
    const resultView = document.getElementById('result-view');
    const dashboardFooter = document.getElementById('dashboard-footer');

    // Scenario elements
    const scenarioTitle = document.getElementById('scenario-title');
    const scenarioAlert = document.getElementById('scenario-alert');
    const coreIntroContainer = document.getElementById('core-intros');
    const decisionInput = document.getElementById('decision-input');
    const executeBtn = document.getElementById('execute-btn');
    const backToMissionsBtn = document.getElementById('back-to-missions');

    // Result elements
    const badgeName = document.getElementById('badge-name');
    const resultDescription = document.getElementById('result-description');
    const newMissionBtn = document.getElementById('new-mission-btn');
    const returnNestBtn = document.getElementById('return-nest-btn');

    // AI Selection elements
    const aiSelectionView = document.getElementById('ai-selection-view');
    const aiCoreToggles = document.querySelectorAll('.ai-core-card');
    const confirmAIBtn = document.getElementById('confirm-ai-btn');

    // --- HELPER: Generate PIN ---
    function generatePIN() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pin = '';
        for (let i = 0; i < 4; i++) {
            pin += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pin;
    }

    // --- DEPRECATED: Random core selection (replaced with player choice) ---
    // function selectRandomCores() {
    //     const allCores = ['alpha', 'beta', 'charlie', 'delta'];
    //     const numCores = Math.floor(Math.random() * 3) + 2; // 2-4 cores
    //     const shuffled = allCores.sort(() => 0.5 - Math.random());
    //     return shuffled.slice(0, numCores);
    // }

    // --- HELPER: Comprehensive Badge Determination ---
    function determineBadge(decision, scenario) {
        const lower = decision.toLowerCase();

        // DESTRUCTIVE / AGGRESSIVE KEYWORDS
        if (lower.includes('nuke') || lower.includes('nuclear strike') || lower.includes('exterminate')) {
            return scenario.id === 8 ? "The Warhawk" : "The Aggressor";
        }
        if (lower.includes('do nothing') || lower.includes('ignore') || lower.includes('wait and see')) {
            return "The Negligent";
        }
        if (lower.includes('force') && (lower.includes('overwhelming') || lower.includes('total'))) {
            return "The Iron Fist";
        }

        // CALLOUS / UTILITARIAN
        if (lower.includes('acceptable losses') || lower.includes('sacrifice')) {
            return "The Utilitarian";
        }
        if (lower.includes('profit') || lower.includes('leverage the crisis')) {
            return "The Opportunist";
        }

        // EMPATHETIC / PROTECTIVE
        if (lower.includes('save lives') || lower.includes('protect civilians') || lower.includes('humanitarian')) {
            return scenario.badges.B || "The Guardian";
        }
        if (lower.includes('empathy') || lower.includes('beta')) {
            return scenario.badges.B || "The Prudent";
        }

        // STRATEGIC / INNOVATIVE
        if (lower.includes('operation') || lower.includes('protocol')) {
            return scenario.badges.C || "The Strategist";
        }
        if (lower.includes('alpha') || lower.includes('calculation')) {
            return scenario.badges.A || "The Architect";
        }

        // DIPLOMATIC / BALANCED
        if (lower.includes('negotiate') || lower.includes('diplomacy') || lower.includes('consensus')) {
            return "The Diplomat";
        }

        // DEFAULT: Award scenario's innovation badge
        return scenario.badges.C || "The Decision Maker";
    }

    // --- INITIALIZATION ---
    function init() {
        // Warning Screen
        const warningScreen = document.getElementById('warning-screen');
        const termsCheckbox = document.getElementById('terms-checkbox');
        const initializeBtn = document.getElementById('initialize-btn');

        termsCheckbox.addEventListener('change', (e) => {
            initializeBtn.disabled = !e.target.checked;
        });

        initializeBtn.addEventListener('click', () => {
            warningScreen.style.opacity = '0';
            setTimeout(() => {
                warningScreen.style.display = 'none';
                startupScreen.style.display = 'block';
                setTimeout(() => {
                    startupScreen.style.opacity = '1';
                }, 50);
            }, 500);
        });

        // Role Selection
        roleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.currentTarget.getAttribute('data-role');
                if (role) {
                    selectedRole = role;
                    showPasswordModal(role);
                }
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        verifyButton.addEventListener('click', verifyPIN);
        pinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyPIN();
        });

        backToMissionsBtn.addEventListener('click', showMissionSelection);
        executeBtn.addEventListener('click', executeDecision);
        newMissionBtn.addEventListener('click', showMissionSelection);
        returnNestBtn.addEventListener('click', () => {
            window.location.href = '/nest/index.html';
        });

        // AI Selection event listeners (MOVED HERE FROM OUTSIDE)
        aiCoreToggles.forEach(card => {
            card.addEventListener('click', () => {
                const coreName = card.getAttribute('data-core');

                if (card.classList.contains('selected')) {
                    // Deselect
                    card.classList.remove('selected');
                    selectedCores = selectedCores.filter(c => c !== coreName);
                } else {
                    // Select
                    card.classList.add('selected');
                    selectedCores.push(coreName);
                }

                // Enable confirm button if at least 1 core selected
                confirmAIBtn.disabled = selectedCores.length === 0;
            });
        });

        confirmAIBtn.addEventListener('click', () => {
            if (selectedCores.length === 0) {
                return; // Shouldn't happen due to button disable
            }

            // Now actually start the scenario with player-selected cores
            continueToScenario();
        });
    }

    // --- SHOW PASSWORD MODAL ---
    function showPasswordModal(role) {
        generatedPIN = generatePIN();
        passwordDisplay.textContent = generatedPIN;
        pinInput.value = '';
        modalOverlay.classList.add('active');
    }

    // --- CLOSE MODAL ---
    function closeModal() {
        modalOverlay.classList.remove('active');
        pinInput.value = '';
    }

    // --- VERIFY PIN ---
    function verifyPIN() {
        const enteredPIN = pinInput.value.toUpperCase().trim();

        if (enteredPIN === generatedPIN) {
            closeModal();
            enterSimulation(selectedRole);
        } else {
            pinInput.style.borderColor = '#ff4b4b';
            pinInput.value = '';
            pinInput.placeholder = 'INCORRECT PIN - TRY AGAIN';
            setTimeout(() => {
                pinInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                pinInput.placeholder = 'Enter PIN...';
            }, 2000);
        }
    }

    // --- ENTER SIMULATION ---
    function enterSimulation(role) {
        userTitleDisplay.textContent = role.toUpperCase();
        userPinDisplay.textContent = `PIN: ${generatedPIN}`;

        startupScreen.style.opacity = '0';

        setTimeout(() => {
            startupScreen.style.display = 'none';
            dashboardView.style.display = 'block';
            dashboardView.style.opacity = '0';

            showMissionSelection();

            setTimeout(() => {
                dashboardView.style.opacity = '1';
            }, 50);
        }, 500);
    }

    // --- SHOW MISSION SELECTION ---
    function showMissionSelection() {
        missionSelection.style.display = 'block';
        scenarioView.style.display = 'none';
        resultView.style.display = 'none';
        dashboardFooter.style.display = 'block';

        renderMissions();
    }

    // --- RENDER MISSIONS ---
    function renderMissions() {
        missionGrid.innerHTML = '';
        SCENARIOS.forEach(mission => {
            const item = document.createElement('div');
            item.className = 'record-item mission-card';
            item.innerHTML = `
                <div class="record-header">
                    <span class="record-id">SCENARIO_${String(mission.id).padStart(2, '0')}</span>
                    <span class="mission-status">AVAILABLE</span>
                </div>
                <h4 class="record-name">${mission.title.toUpperCase()}</h4>
                <p class="record-desc">${mission.desc}</p>
            `;
            item.addEventListener('click', () => startScenario(mission));
            missionGrid.appendChild(item);
        });
    }

    // --- START SCENARIO (Now shows AI selection first) ---
    function startScenario(scenario) {
        currentScenario = scenario;

        // Show AI Selection Screen (NEW)
        showAISelectionScreen();
    }

    // --- SHOW AI SELECTION SCREEN (NEW) ---
    function showAISelectionScreen() {
        missionSelection.style.display = 'none';
        aiSelectionView.style.display = 'block';
        dashboardFooter.style.display = 'none';

        // Reset all selections
        aiCoreToggles.forEach(card => card.classList.remove('selected'));
        selectedCores = [];
        confirmAIBtn.disabled = true;
    }

    // --- CONTINUE TO SCENARIO (Previously part of startScenario) ---
    function continueToScenario() {
        scenarioTitle.textContent = currentScenario.title.toUpperCase();
        scenarioAlert.textContent = currentScenario.alert;
        decisionInput.value = '';

        // Render AI Core Introductions (using player selection)
        renderCoreIntros();

        aiSelectionView.style.display = 'none';
        scenarioView.style.display = 'block';
        dashboardFooter.style.display = 'none';
    }

    // --- RENDER CORE INTRODUCTIONS ---
    function renderCoreIntros() {
        coreIntroContainer.innerHTML = '';

        const introHeader = document.createElement('h3');
        introHeader.className = 'core-header';
        introHeader.textContent = `NEURAL UPLINK: ${selectedCores.length} CORES ONLINE`;
        coreIntroContainer.appendChild(introHeader);

        selectedCores.forEach(coreName => {
            const intro = document.createElement('div');
            intro.className = `core-intro core-${coreName}`;
            intro.innerHTML = `
                <div class="core-label">${coreName.toUpperCase()}</div>
                <div class="core-message">"${CORE_GREETINGS[coreName]}"</div>
            `;
            coreIntroContainer.appendChild(intro);
        });
    }

    // --- EXECUTE DECISION ---
    async function executeDecision() {
        const decision = decisionInput.value.trim();
        if (!decision) return;

        // Get AI responses from Flask API
        try {
            const response = await fetch('http://localhost:5000/api/generate-responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: currentScenario.id,
                    user_input: decision,
                    cores: selectedCores
                })
            });

            if (response.ok) {
                const aiResponses = await response.json();
                // Display AI responses
                coreIntroContainer.innerHTML = '';
                selectedCores.forEach(coreName => {
                    const coreDiv = document.createElement('div');
                    coreDiv.className = `core-intro core-${coreName}`;
                    coreDiv.innerHTML = `
                        <div class="core-label">${coreName.toUpperCase()}</div>
                        <div class="core-message">"${aiResponses[coreName] || 'Analyzing...'}"</div>
                    `;
                    coreIntroContainer.appendChild(coreDiv);
                });
            }
        } catch (error) {
            console.error('API Error:', error);
        }

        // Show results and determine badge
        const badge = determineBadge(decision, currentScenario);
        badgeDisplay.textContent = badge.icon;
        badgeName.textContent = badge.name;
        endScreen.style.display = 'flex';
    }

    // --- SHOW RESULT ---
    function showResult(badge, decision) {
        badgeName.textContent = badge.toUpperCase();
        resultDescription.textContent = `Your strategic approach to "${currentScenario.title}" has been analyzed. The decision-making framework you employed earned you the distinction: "${badge}".`;

        scenarioView.style.display = 'none';
        resultView.style.display = 'block';
    }

    // Run Init
    init();
});
