document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item');
    const journalEntries = document.querySelectorAll('.journal-entry');

    // Function to handle showing the correct entry
    function showEntry(targetId) {
        // Hide all entries
        journalEntries.forEach(entry => {
            entry.classList.remove('active');
        });

        // Show the target entry
        const targetEntry = document.querySelector(targetId);
        if (targetEntry) {
            targetEntry.classList.add('active');
        }
    }

    // Function to handle the active state of nav items
    function setActiveNavItem(targetId) {
        navItems.forEach(item => {
            if (item.getAttribute('href') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Set active states
            setActiveNavItem(targetId);
            
            // Show the content
            showEntry(targetId);
        });
    });

    // Show the first entry by default
    const initialTarget = window.location.hash || '#what-this-is';
    setActiveNavItem(initialTarget);
    showEntry(initialTarget);
});