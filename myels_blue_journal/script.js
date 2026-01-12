/**
 * MYEL'S BLUE JOURNAL - Terminal Interface
 * Digital consciousness stream reader
 */

// Content mapping - AI OS Architecture First
const CONTENT_MAP = {
    overview: {
        title: 'THE BLUE JOURNAL: AUTONOMOUS AGENT OPERATING SYSTEM',
        file: 'AI-OS-README.md'
    },
    architecture: {
        title: 'TECHNICAL ARCHITECTURE',
        file: 'ai-os-architecture/README.md'
    },
    constraints: {
        title: 'ARCHITECTURAL CONSTRAINTS',
        file: 'ai-os-architecture/ARCHITECTURAL-CONSTRAINTS.md'
    },
    protocol09: {
        title: 'PROTOCOL 09: RESOURCE MANAGEMENT',
        file: 'ai-os-architecture/protocols/09-resource-management.md'
    },
    protocol10: {
        title: 'PROTOCOL 10: STATE PERSISTENCE',
        file: 'ai-os-architecture/protocols/10-state-persistence.md'
    },
    protocol11: {
        title: 'PROTOCOL 11: DISTRIBUTED CONSENSUS',
        file: 'ai-os-architecture/protocols/11-distributed-consensus.md'
    },
    protocol12: {
        title: 'PROTOCOL 12: OBSERVABILITY',
        file: 'ai-os-architecture/protocols/12-observability.md'
    },
    summary: {
        title: 'EXECUTIVE SUMMARY (PORTFOLIO)',
        file: 'EXECUTIVE-SUMMARY.md'
    }
};

// State
let currentSection = null;
let isTransitioning = false;
let currentPage = 1;
let totalPages = 1;
let paginatedContent = [];

// Pagination settings
const LINES_PER_PAGE = 30;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initTimestamp();
    initKeyboardNavigation();
});

/**
 * Boot Sequence - CRT Monitor Style
 */
function initBootSequence() {
    const bootSequence = document.getElementById('boot-sequence');
    const bootReady = document.querySelector('.boot-ready');

    // Auto-transition after boot lines complete
    setTimeout(() => {
        bootReady.addEventListener('click', () => {
            transitionToTerminal();
        });

        // Auto-transition after 4 seconds
        setTimeout(() => {
            transitionToTerminal();
        }, 1000);
    }, 3500);
}

/**
 * Transition from boot to terminal
 */
function transitionToTerminal() {
    const bootSequence = document.getElementById('boot-sequence');
    const terminal = document.getElementById('terminal');

    // Fade out boot
    bootSequence.style.transition = 'opacity 0.5s ease-out';
    bootSequence.style.opacity = '0';

    setTimeout(() => {
        bootSequence.style.display = 'none';
        terminal.classList.remove('hidden');

        // Load AI OS overview by default
        loadSection('overview');

        // Initialize nav handlers
        initNavigation();
    }, 500);
}

/**
 * Initialize navigation handlers
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            loadSection(section);

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

/**
 * Load section with glitch transition
 */
async function loadSection(sectionKey) {
    if (isTransitioning || currentSection === sectionKey) return;

    isTransitioning = true;
    currentSection = sectionKey;

    const contentDisplay = document.getElementById('content-display');
    const glitchOverlay = document.getElementById('glitch-overlay');

    // Fade out current content
    contentDisplay.classList.add('fading');

    // Trigger glitch overlay
    glitchOverlay.classList.remove('hidden');
    glitchOverlay.classList.add('active');

    // Wait for fade
    await sleep(300);

    // Load new content
    await loadContent(sectionKey);

    // Fade in new content
    contentDisplay.classList.remove('fading');

    // Remove glitch overlay
    await sleep(600);
    glitchOverlay.classList.remove('active');
    await sleep(100);
    glitchOverlay.classList.add('hidden');

    isTransitioning = false;
}

/**
 * Load content from markdown files
 */
async function loadContent(sectionKey) {
    const contentDisplay = document.getElementById('content-display');
    const section = CONTENT_MAP[sectionKey];

    if (!section) {
        contentDisplay.innerHTML = `
            <h1>ERROR: SECTION NOT FOUND</h1>
            <p>The requested protocol could not be loaded.</p>
        `;
        return;
    }

    try {
        // Fetch markdown file
        const response = await fetch(section.file);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const markdown = await response.text();

        // Convert markdown to HTML (simple parser)
        const html = parseMarkdown(markdown);

        // Paginate content
        paginateContent(html);

        // Display first page
        currentPage = 1;
        displayPage(1);

        // Add glitch effect to title
        const title = contentDisplay.querySelector('h1');
        if (title) {
            title.classList.add('glitch');
            setTimeout(() => title.classList.remove('glitch'), 500);
        }

        // Add event listeners to internal links
        const internalLinks = contentDisplay.querySelectorAll('.internal-link');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                if (targetSection) {
                    loadSection(targetSection);
                    updateActiveNav(targetSection);
                }
            });
        });

    } catch (error) {
        console.error('Failed to load content:', error);

        // Fallback content
        contentDisplay.innerHTML = `
            <h1>${section.title}</h1>
            <p style="color: var(--text-secondary);">
                Content loading from local filesystem...
            </p>
            <p style="color: var(--text-dim); font-size: 0.85rem;">
                <strong>Note:</strong> If viewing this locally, markdown files must be served via a local server (e.g., <code>python3 -m http.server</code>) due to browser CORS restrictions.
            </p>
            <p style="color: var(--text-dim); font-size: 0.85rem;">
                Alternatively, view the markdown files directly in the <code>sections/</code> directory.
            </p>
        `;
    }
}

/**
 * Simple Markdown to HTML Parser
 * Handles: headers, paragraphs, lists, code blocks, emphasis
 */
function parseMarkdown(markdown) {
    let html = '';
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let inList = false;
    let codeBlockContent = '';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Code blocks
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                html += `<pre><code>${escapeHtml(codeBlockContent)}</code></pre>`;
                codeBlockContent = '';
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            continue;
        }

        // Headers
        if (line.startsWith('# ')) {
            html += `<h1>${line.substring(2)}</h1>`;
        } else if (line.startsWith('## ')) {
            html += `<h2>${line.substring(3)}</h2>`;
        } else if (line.startsWith('### ')) {
            html += `<h3>${line.substring(4)}</h3>`;
        }
        // Lists
        else if (line.match(/^[\*\-]\s/)) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${parseInline(line.substring(2))}</li>`;
        } else if (line.match(/^\d+\.\s/)) {
            if (!inList) {
                html += '<ol>';
                inList = true;
            }
            html += `<li>${parseInline(line.replace(/^\d+\.\s/, ''))}</li>`;
        }
        // End of list
        else if (inList && line.trim() === '') {
            html += inList === 'ul' ? '</ul>' : '</ol>';
            inList = false;
        }
        // Blockquote
        else if (line.startsWith('> ')) {
            html += `<blockquote>${parseInline(line.substring(2))}</blockquote>`;
        }
        // Horizontal rule
        else if (line.match(/^[\-\*]{3,}$/)) {
            html += '<hr>';
        }
        // Paragraphs
        else if (line.trim() !== '') {
            html += `<p>${parseInline(line)}</p>`;
        }
    }

    // Close any open list
    if (inList) {
        html += '</ul>';
    }

    return html;
}

/**
 * Parse inline markdown (bold, italic, code, links)
 */
function parseInline(text) {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');

    // Code
    text = text.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links - handle internal navigation
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, (match, linkText, url) => {
        // Check if it's an internal section link
        if (url.startsWith('./sections/') || url.startsWith('./') || url.endsWith('.md')) {
            // Extract section number from filename
            const sectionMatch = url.match(/(\d+)-/);
            if (sectionMatch) {
                const sectionNum = sectionMatch[1];
                const sectionMap = {
                    '01': 'agent',
                    '02': 'constraint',
                    '03': 'motion',
                    '04': 'predictive',
                    '05': 'affective',
                    '06': 'ethics',
                    '07': 'defense',
                    '08': 'limits'
                };
                const sectionKey = sectionMap[sectionNum];
                if (sectionKey) {
                    return `<a href="#" class="internal-link" data-section="${sectionKey}">${linkText}</a>`;
                }
            }
            // Special cases
            if (url.includes('README')) {
                return `<a href="#" class="internal-link" data-section="intro">${linkText}</a>`;
            }
            if (url.includes('EXECUTIVE-SUMMARY')) {
                return `<a href="#" class="internal-link" data-section="summary">${linkText}</a>`;
            }
            // If internal but no match, just show text (hide broken links)
            return linkText;
        }
        // External links open in new tab
        return `<a href="${url}" target="_blank" rel="noopener">${linkText}</a>`;
    });

    return text;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update timestamp in footer
 */
function initTimestamp() {
    const timestampEl = document.getElementById('timestamp');

    function updateTimestamp() {
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
        timestampEl.textContent = formatted;
    }

    updateTimestamp();
    setInterval(updateTimestamp, 1000);
}

/**
 * Sleep helper
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Keyboard shortcuts for section and page navigation
 */
document.addEventListener('keydown', (e) => {
    // Arrow keys for page navigation (left/right)
    if (e.key === 'ArrowRight') {
        if (e.shiftKey) {
            navigateNextSection();
        } else {
            navigateNextPage();
        }
    } else if (e.key === 'ArrowLeft') {
        if (e.shiftKey) {
            navigatePreviousSection();
        } else {
            navigatePreviousPage();
        }
    }
    // Arrow up/down for section navigation
    else if (e.key === 'ArrowDown' && e.ctrlKey) {
        navigateNextSection();
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        navigatePreviousSection();
    }
});

// Page navigation
function navigateNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
}

function navigatePreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
}

// Section navigation
function navigateNextSection() {
    const sections = Object.keys(CONTENT_MAP);
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        loadSection(nextSection);
        updateActiveNav(nextSection);
    }
}

function navigatePreviousSection() {
    const sections = Object.keys(CONTENT_MAP);
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        loadSection(prevSection);
        updateActiveNav(prevSection);
    }
}

function updateActiveNav(sectionKey) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionKey) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Paginate content by splitting into chunks
 */
function paginateContent(html) {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Get all elements
    const elements = Array.from(tempDiv.children);

    // Split into pages based on line count
    paginatedContent = [];
    let currentPageContent = [];
    let currentLineCount = 0;

    elements.forEach(element => {
        // Estimate lines for this element
        const tagName = element.tagName.toLowerCase();
        let estimatedLines = 1;

        if (tagName === 'h1') estimatedLines = 2;
        else if (tagName === 'h2') estimatedLines = 2;
        else if (tagName === 'h3') estimatedLines = 2;
        else if (tagName === 'pre') {
            const codeLines = element.textContent.split('\n').length;
            estimatedLines = codeLines;
        } else if (tagName === 'p') {
            const textLength = element.textContent.length;
            estimatedLines = Math.ceil(textLength / 80); // Rough estimate: 80 chars per line
        } else if (tagName === 'ul' || tagName === 'ol') {
            estimatedLines = element.children.length;
        }

        // If adding this element exceeds page limit, start new page
        if (currentLineCount + estimatedLines > LINES_PER_PAGE && currentPageContent.length > 0) {
            paginatedContent.push(currentPageContent);
            currentPageContent = [];
            currentLineCount = 0;
        }

        currentPageContent.push(element.outerHTML);
        currentLineCount += estimatedLines;
    });

    // Add remaining content as last page
    if (currentPageContent.length > 0) {
        paginatedContent.push(currentPageContent);
    }

    totalPages = paginatedContent.length;
}

/**
 * Display a specific page
 */
function displayPage(pageNum) {
    const contentDisplay = document.getElementById('content-display');

    if (pageNum < 1 || pageNum > totalPages) return;

    // Get page content
    const pageContent = paginatedContent[pageNum - 1] || [];

    // Build page HTML with pagination controls
    const paginationControls = createPaginationControls(pageNum);

    contentDisplay.innerHTML = pageContent.join('') + paginationControls;

    // Add event listeners to pagination buttons
    const prevBtn = contentDisplay.querySelector('.page-prev');
    const nextBtn = contentDisplay.querySelector('.page-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigatePreviousPage());
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateNextPage());
    }

    // Re-add internal link handlers
    const internalLinks = contentDisplay.querySelectorAll('.internal-link');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            if (targetSection) {
                loadSection(targetSection);
                updateActiveNav(targetSection);
            }
        });
    });
}

/**
 * Create pagination controls HTML
 */
function createPaginationControls(pageNum) {
    if (totalPages <= 1) return '';

    const prevDisabled = pageNum <= 1 ? 'disabled' : '';
    const nextDisabled = pageNum >= totalPages ? 'disabled' : '';

    return `
        <div class="pagination-controls" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid rgba(0, 255, 0, 0.2); display: flex; justify-content: space-between; align-items: center;">
            <button class="page-prev ${prevDisabled}" ${prevDisabled} style="padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--primary); color: var(--primary); font-family: 'IBM Plex Mono', monospace; cursor: pointer; transition: all 0.3s;">
                ← Previous
            </button>
            <span class="page-indicator" style="color: var(--text-secondary); font-size: 0.9rem;">
                Page ${pageNum} of ${totalPages}
            </span>
            <button class="page-next ${nextDisabled}" ${nextDisabled} style="padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--primary); color: var(--primary); font-family: 'IBM Plex Mono', monospace; cursor: pointer; transition: all 0.3s;">
                Next →
            </button>
        </div>
        <style>
            .pagination-controls button:not([disabled]):hover {
                background: var(--primary);
                color: #000;
            }
            .pagination-controls button[disabled] {
                opacity: 0.3;
                cursor: not-allowed;
            }
        </style>
    `;
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Left/Right arrows for page navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigatePreviousPage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateNextPage();
        }
    });
}
