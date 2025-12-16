document.addEventListener('DOMContentLoaded', () => {
    // 1. Footer Year Update
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme preference from local storage or default to dark (no class)
    const savedTheme = localStorage.getItem('theme'); 
    
    // Initial check: if savedTheme is 'light', apply the class
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }
    
    updateThemeToggleIcon(savedTheme || 'dark'); // Set initial icon state

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Toggle the 'light-mode' class on the body
            body.classList.toggle('light-mode');
            
            const isLightMode = body.classList.contains('light-mode');
            const newTheme = isLightMode ? 'light' : 'dark';
            
            // Save preference to local storage
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            updateThemeToggleIcon(newTheme);
        });
    }

    function updateThemeToggleIcon(theme) {
        const sunIcon = themeToggle.querySelector('[data-mode="light"]');
        const moonIcon = themeToggle.querySelector('[data-mode="dark"]');

        if (theme === 'dark') {
            // Dark mode is active (no class or class removed)
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
        } else {
            // Light mode is active (class is present)
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
        }
    }


    // 3. Smooth Scrolling and Active Nav Links
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 30, // Adjust for padding/header space
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for highlighting the active section in the sidebar
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50% 0px', // Highlight when the section hits halfway up the viewport
        threshold: 0 // We'll rely on rootMargin instead of threshold for better accuracy
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add 'active' class to the corresponding link
                const activeLink = document.querySelector(`.sidebar-nav a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});