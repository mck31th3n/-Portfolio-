// ============================================
// THE OWL - MAIN UI JAVASCRIPT
// Interactive functionality and animations
// ============================================

class OwlMainUI {
    constructor() {
        this.nav = document.querySelector('.owl-nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.agentCards = document.querySelectorAll('.agent-card');

        this.init();
    }

    init() {
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.setupAgentCards();
        this.animateStats();
        this.setupActivityFeed();
    }

    // Scroll spy for navigation
    setupScrollSpy() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );

        this.sections.forEach(section => observer.observe(section));
    }

    // Smooth scroll for navigation links
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Agent card interactions
    setupAgentCards() {
        this.agentCards.forEach(card => {
            card.addEventListener('click', () => {
                const agent = card.dataset.agent;
                this.showAgentDetails(agent);
            });
        });
    }

    showAgentDetails(agent) {
        const agentData = {
            zelle: {
                name: 'ZELLE',
                title: 'Strategic Intelligence Core',
                color: '#9B59B6',
                description: 'Advanced pattern recognition and strategic decision routing across all domains.'
            },
            muse: {
                name: 'MUSE',
                title: 'Creative Intelligence Core',
                color: '#E67E22',
                description: 'Creative asset management and innovative problem-solving capabilities.'
            },
            keystone: {
                name: 'KEYSTONE',
                title: 'Foundation Intelligence Core',
                color: '#4A90E2',
                description: 'System integrity maintenance and architectural decision support.'
            },
            vector: {
                name: 'VECTOR',
                title: 'Analytical Intelligence Core',
                color: '#95A5A6',
                description: 'Precise data analysis and methodical pattern processing.'
            },
            ally: {
                name: 'ALLY',
                title: 'Collaborative Intelligence Core',
                color: '#27AE60',
                description: 'Cross-system coordination and communication management.'
            }
        };

        const data = agentData[agent];
        console.log(`Agent Selected: ${data.name}`);
        console.log(`   ${data.description}`);

        // Could extend this to show a modal or navigate to agent-specific page
        // For now, just log to console
    }

    // Animate statistics on scroll
    animateStats() {
        const stats = document.querySelectorAll('.stat-value');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        this.countUp(entry.target);
                        entry.target.classList.add('animated');
                    }
                });
            },
            { threshold: 0.5 }
        );

        stats.forEach(stat => observer.observe(stat));
    }

    countUp(element) {
        const text = element.textContent;
        const hasComma = text.includes(',');
        const hasPercent = text.includes('%');
        const hasGB = text.includes('GB');

        // Extract number
        let target = parseFloat(text.replace(/[^0-9.]/g, ''));

        // Don't animate single digit numbers
        if (target <= 10 && !hasPercent) {
            return;
        }

        let current = 0;
        const increment = target / 50;
        const duration = 1000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            let displayValue = Math.floor(current).toString();

            // Add formatting back
            if (hasComma && current >= 1000) {
                displayValue = displayValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            if (hasPercent) {
                displayValue = current.toFixed(1) + '%';
            }
            if (hasGB) {
                displayValue = current.toFixed(1) + ' GB';
            }

            element.textContent = displayValue;
        }, stepTime);
    }

    // Activity feed auto-update simulation
    setupActivityFeed() {
        // Simulate new activity every 30 seconds (for demo purposes)
        // In production, this would be real-time data
        setInterval(() => {
            this.addNewActivity();
        }, 30000);
    }

    addNewActivity() {
        const agents = ['zelle', 'muse', 'keystone', 'vector', 'ally'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        const agentNames = {
            zelle: 'ZELLE',
            muse: 'MUSE',
            keystone: 'KEYSTONE',
            vector: 'VECTOR',
            ally: 'ALLY'
        };

        const agentColors = {
            zelle: '#9B59B6',
            muse: '#E67E22',
            keystone: '#4A90E2',
            vector: '#95A5A6',
            ally: '#27AE60'
        };

        const messages = {
            zelle: 'Analyzed strategic patterns in recent project files.',
            muse: 'Processed creative assets and media files.',
            keystone: 'Completed system integrity verification.',
            vector: 'Performed deep analytical scan of codebase.',
            ally: 'Synchronized cross-system communications.'
        };

        const feed = document.querySelector('.activity-feed');
        const newItem = document.createElement('div');
        newItem.className = 'activity-item new-entry';
        newItem.dataset.agent = randomAgent;
        newItem.style.opacity = '0';
        newItem.innerHTML = `
            <div class="activity-avatar" style="border-color: ${agentColors[randomAgent]};">
                <span class="avatar-initial">${agentNames[randomAgent][0]}</span>
            </div>
            <div class="activity-content">
                <div class="activity-header">
                    <span class="activity-agent">${agentNames[randomAgent]}</span>
                    <span class="activity-time">Just now</span>
                </div>
                <p class="activity-message">${messages[randomAgent]}</p>
                <div class="activity-meta">
                    <span class="meta-tag">Real-time Update</span>
                </div>
            </div>
        `;

        feed.insertBefore(newItem, feed.firstChild);

        // Fade in animation
        setTimeout(() => {
            newItem.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 100);

        // Remove oldest item if more than 5
        const items = feed.querySelectorAll('.activity-item');
        if (items.length > 5) {
            items[items.length - 1].style.opacity = '0';
            setTimeout(() => {
                items[items.length - 1].remove();
            }, 600);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const owlUI = new OwlMainUI();

    // Log system ready
    console.log('THE OWL - Main UI Loaded');
    console.log('   Five intelligence cores operational');
    console.log('   Always watching, learning, adapting...');

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'H' to scroll to top
        if (e.key === 'h' || e.key === 'H') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Press 'R' to reload (useful during development)
        if (e.key === 'r' && e.ctrlKey) {
            location.reload();
        }
    });

    // Add scroll-based nav background
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const nav = document.querySelector('.owl-nav');

        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
});
