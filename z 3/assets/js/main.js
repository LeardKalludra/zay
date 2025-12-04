document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    yearSpan.textContent = new Date().getFullYear();
});


document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }

    initHeroSlider();
    initSearch();

    initScrollAnimations();
    initScrollToTop();
    if (typeof initFloatingCart === 'function') {
        initFloatingCart();
    }
    initUserMenu();
});

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(function (el) {
        observer.observe(el);
    });
}

function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

function initUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = userMenu ? userMenu.querySelector('.user-dropdown') : null;
    if (!userMenu || !userDropdown || typeof getAuthenticatedUser !== 'function') return;

    const user = getAuthenticatedUser();
    const userNameEl = userDropdown.querySelector('.user-name');
    const userEmailEl = userDropdown.querySelector('.user-email');
    const logoutBtn = userDropdown.querySelector('.logout-btn');

    if (user) {
        if (userNameEl) {
            userNameEl.textContent = user.fullname || user.email || 'Account';
        }
        if (userEmailEl) {
            userEmailEl.textContent = user.email || '';
            userEmailEl.style.display = user.email ? 'block' : 'none';
        }
        userMenu.classList.add('is-auth');
    } else {
        userMenu.classList.remove('is-auth');
    }

    if (logoutBtn && typeof logout === 'function') {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');

    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(function (slide) { slide.classList.remove('active'); });
        indicators.forEach(function (indicator) { indicator.classList.remove('active'); });

        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            showSlide(currentSlide + 1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            showSlide(currentSlide - 1);
        });
    }

    indicators.forEach(function (indicator, index) {
        indicator.addEventListener('click', function () {
            showSlide(index);
        });
    });

    setInterval(function () {
        showSlide(currentSlide + 1);
    }, 5000);
}

function initSearch() {
    const searchIcon = document.querySelector('.search-icon');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchIcon && searchModal) {
        searchIcon.addEventListener('click', function (e) {
            e.preventDefault();
            searchModal.style.display = 'block';
            if (searchInput) searchInput.focus();
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', function () {
            searchModal.style.display = 'none';
        });
    }

    if (searchModal) {
        searchModal.addEventListener('click', function (e) {
            if (e.target === searchModal) {
                searchModal.style.display = 'none';
            }
        });
    }

    if (searchInput && searchResults) {
        let searchTimeout;
        searchInput.addEventListener('input', function (e) {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            searchTimeout = setTimeout(function () {
                if (query.length < 2) {
                    clearElement(searchResults);
                    return;
                }

                const results = searchProducts(query);
                displaySearchResults(results, searchResults);
            }, 300);
        });
    }
}

const form = document.getElementById("newsletterForm");

form.addEventListener("submit",(e) => {
    e.preventDefault();
    showSuccessPopup();
})


const successPopup = document.getElementById("successPopup");
const closePopup = document.getElementById("closePopup");

function showSuccessPopup() {
    successPopup.style.display = "flex";
}

closePopup.addEventListener("click", () => {
    successPopup.style.display = "none";
    form.reset()
});
    
