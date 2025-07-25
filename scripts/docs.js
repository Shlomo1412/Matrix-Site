// Documentation Pages JavaScript

// Initialize Lucide icons and functionality
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initDocumentation();
});

function initDocumentation() {
    initSidebarSearch();
    initActiveNavigation();
    initBackToTop();
    initCopyToClipboard();
    initSmoothScrolling();
}

// Sidebar search functionality
function initSidebarSearch() {
    const searchInput = document.getElementById('sidebar-search');
    if (!searchInput) return;

    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        sidebarLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const section = link.closest('.sidebar-section');
            
            if (query === '' || text.includes(query)) {
                link.style.display = '';
                if (section) section.style.display = '';
            } else {
                link.style.display = 'none';
            }
        });
        
        // Hide sections with no visible links
        document.querySelectorAll('.sidebar-section').forEach(section => {
            const visibleLinks = section.querySelectorAll('.sidebar-link[style=""], .sidebar-link:not([style])');
            if (visibleLinks.length === 0 && query !== '') {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
        });
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id], .api-method[id]');
    const navLinks = document.querySelectorAll('.sidebar-link[href^="#"]');

    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Copy to clipboard functionality
function initCopyToClipboard() {
    document.querySelectorAll('pre').forEach(pre => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i data-lucide="copy"></i>';
        copyBtn.setAttribute('aria-label', 'Copy code');
        
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.innerHTML = '<i data-lucide="check"></i>';
                copyBtn.style.color = '#10b981';
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i data-lucide="copy"></i>';
                    copyBtn.style.color = '';
                    lucide.createIcons();
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                copyBtn.innerHTML = '<i data-lucide="check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i data-lucide="copy"></i>';
                    lucide.createIcons();
                }, 2000);
            }
        });
        
        // Re-initialize Lucide icons
        lucide.createIcons();
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile sidebar toggle (if needed)
function initMobileSidebar() {
    const sidebar = document.querySelector('.docs-sidebar');
    const toggleBtn = document.createElement('button');
    
    if (!sidebar || window.innerWidth > 1024) return;
    
    toggleBtn.className = 'mobile-sidebar-toggle';
    toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
    toggleBtn.style.cssText = `
        position: fixed;
        top: calc(var(--nav-height) + 1rem);
        left: 1rem;
        z-index: 1001;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(toggleBtn);
    
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });
    
    lucide.createIcons();
}

// Initialize mobile sidebar on resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024) {
        initMobileSidebar();
    }
});

// Call mobile sidebar init on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 1024) {
        initMobileSidebar();
    }
});
