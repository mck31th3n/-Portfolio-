// OWL System Interface - Full Boot + Interactive Sequence

const SEQUENCE = {
    FINGERPRINTS_APPEAR: 0,
    FINGERPRINTS_DISSOLVE: 2000,
    LINES_CONVERGE: 2800,
    MIDDLE_DESCENDS: 4300,
    SIGIL_FORMS: 5400,
    TEXT_APPEARS: 6000,
    TEXT_FADES: 7500,
    FINGERPRINTS_RETURN: 8000,
    OWL_APPEARS: 8800,
    SYSTEM_READY: 9000
};

class OWLSystem {
    constructor() {
        this.fingerprints = document.querySelectorAll('.fingerprint');
        this.lines = {
            thumb: document.querySelector('.thumb-line'),
            index: document.querySelector('.index-line'),
            ring: document.querySelector('.ring-line'),
            pinky: document.querySelector('.pinky-line'),
            middle: document.querySelector('.middle-line')
        };
        this.sigil = document.querySelector('.sigil');
        this.owlText = document.querySelector('.owl-text');
        this.subtitle = document.querySelector('.subtitle');
        this.owl = document.querySelector('.owl-overseer');

        this.currentFinger = null;
        this.systemReady = false;
    }

    startBootSequence() {
        console.log('🦉 OWL Boot Sequence Initiated');

        // Phase 1: Fingerprints appear (CSS handles this)

        // Phase 2: Dissolve fingerprints
        setTimeout(() => {
            this.fingerprints.forEach(fp => fp.classList.add('dissolving'));
        }, SEQUENCE.FINGERPRINTS_DISSOLVE);

        // Phase 3: Lines converge
        setTimeout(() => {
            this.lines.thumb.classList.add('animating');
            this.lines.index.classList.add('animating');
            this.lines.ring.classList.add('animating');
            this.lines.pinky.classList.add('animating');
        }, SEQUENCE.LINES_CONVERGE);

        // Phase 4: Middle finger line descends
        setTimeout(() => {
            this.lines.middle.classList.add('animating');
        }, SEQUENCE.MIDDLE_DESCENDS);

        // Phase 5: Sigil forms
        setTimeout(() => {
            this.sigil.classList.add('active');
        }, SEQUENCE.SIGIL_FORMS);

        // Phase 6: Text appears
        setTimeout(() => {
            this.owlText.classList.add('visible');
            this.subtitle.classList.add('visible');
        }, SEQUENCE.TEXT_APPEARS);

        // Phase 7: Text fades out
        setTimeout(() => {
            this.owlText.classList.add('fading');
            this.subtitle.classList.add('fading');
            this.sigil.classList.add('fading');
        }, SEQUENCE.TEXT_FADES);

        // Phase 8: Fingerprints return to positions
        setTimeout(() => {
            this.fingerprints.forEach(fp => {
                fp.classList.remove('dissolving');
                fp.classList.add('returned');
                fp.style.pointerEvents = 'auto';
            });
        }, SEQUENCE.FINGERPRINTS_RETURN);

        // Phase 9: Owl overseer appears
        setTimeout(() => {
            this.owl.classList.add('visible');
            this.systemReady = true;
            this.enableInteractions();
            console.log('✅ OWL System Ready - Always Watching, Learning, Adapting');
        }, SEQUENCE.OWL_APPEARS);

        // Phase 10: Show stats dashboard
        setTimeout(() => {
            this.showStatsDashboard();
        }, SEQUENCE.SYSTEM_READY);
    }

    showStatsDashboard() {
        const dashboard = document.getElementById('stats-dashboard');
        if (dashboard) {
            dashboard.classList.add('visible');
        }
    }

    enableInteractions() {
        this.fingerprints.forEach(fp => {
            fp.addEventListener('click', (e) => {
                const fingerName = fp.dataset.finger;
                this.navigateToFinger(fingerName, fp);
            });

            fp.addEventListener('mouseenter', () => {
                if (this.systemReady) {
                    fp.style.transform = fp.classList.contains('middle')
                        ? 'translateX(-50%) scale(1.1)'
                        : 'scale(1.1)';
                }
            });

            fp.addEventListener('mouseleave', () => {
                fp.style.transform = fp.classList.contains('middle')
                    ? 'translateX(-50%) scale(1)'
                    : 'scale(1)';
            });
        });
    }

    navigateToFinger(fingerName, fingerElement) {
        if (!this.systemReady) return;

        console.log(`🦉 Owl flying to ${fingerName}...`);

        // Remove previous flying classes
        this.owl.classList.remove('flying-to-thumb', 'flying-to-index', 'flying-to-ring', 'flying-to-pinky', 'flying-to-middle');

        // Add flying class based on finger
        const fingerClass = fingerElement.classList[1]; // thumb, index, ring, pinky, or middle
        this.owl.classList.add(`flying-to-${fingerClass}`);

        this.currentFinger = fingerName;

        // After owl arrives, navigate to finger domain
        setTimeout(() => {
            this.openFingerDomain(fingerName);
        }, 1000);
    }

    openFingerDomain(fingerName) {
        console.log(`📂 Opening ${fingerName} domain...`);

        // Show finger domain info (you can extend this to navigate to actual pages)
        const fingerData = {
            'ZELLE': {
                domain: 'Strategic Intelligence Core',
                status: 'ACTIVE',
                color: '#9B59B6'
            },
            'MUSE': {
                domain: 'Creative Intelligence Core',
                status: 'ACTIVE',
                color: '#E67E22'
            },
            'KEYSTONE': {
                domain: 'Foundation Intelligence Core',
                status: 'ACTIVE',
                color: '#4A90E2'
            },
            'VECTOR': {
                domain: 'Analytical Intelligence Core',
                status: 'ACTIVE',
                color: '#95A5A6'
            },
            'ALLY': {
                domain: 'Collaborative Intelligence Core',
                status: 'ACTIVE',
                color: '#27AE60'
            }
        };

        const data = fingerData[fingerName];
        if (data) {
            console.log(`📊 ${fingerName}:`);
            console.log(`   Domain: ${data.domain}`);
            console.log(`   Status: ${data.status}`);
            console.log(`   The OWL continues to watch, learn, and adapt...`);
        }

        // You can extend this to actually navigate:
        // window.location.href = `/nest/${fingerName.toLowerCase()}.html`;
    }

    returnOwlToCenter() {
        this.owl.classList.remove('flying-to-thumb', 'flying-to-index', 'flying-to-ring', 'flying-to-pinky', 'flying-to-middle');
        this.currentFinger = null;
    }
}

// Initialize system
window.addEventListener('DOMContentLoaded', () => {
    const owlSystem = new OWLSystem();
    owlSystem.startBootSequence();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            location.reload();
        }
        if (e.key === 'Escape') {
            owlSystem.returnOwlToCenter();
        }
    });

    // Click anywhere to return owl to center
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fingerprint') && owlSystem.systemReady) {
            owlSystem.returnOwlToCenter();
        }
    });
});
