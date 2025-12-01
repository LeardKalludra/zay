document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    yearSpan.textContent = new Date().getFullYear();
});


document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    initHeroSlider();
    
    initSearch();
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        loadFeaturedProducts();
    }
    
    if (window.location.pathname.includes('shop.html')) {
        loadShopProducts();
    }
    
    initScrollAnimations();
    
    initScrollToTop();
    
    initFloatingCart();
    initUserMenu();
});

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

function initFloatingCart() {
    updateFloatingCart();
}





function updateFloatingCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const floatingCartItems = document.getElementById('floatingCartItems');
    const floatingCartTotal = document.getElementById('floatingCartTotal');
    const floatingCartCount = document.querySelector('.floating-cart-count');
    
    if (floatingCartCount) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        floatingCartCount.textContent = count;
    }
    
    if (!floatingCartItems) return;
    
    if (cart.length === 0) {
        floatingCartItems.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--text-gray);">Your cart is empty</p>';
        if (floatingCartTotal) floatingCartTotal.textContent = '0.00';
        return;
    }
    
    floatingCartItems.innerHTML = cart.map(item => `
        <div class="floating-cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="floating-cart-item-info">
                <h5>${item.name}</h5>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
        </div>
    `).join('');
    
    if (floatingCartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        floatingCartTotal.textContent = total.toFixed(2);
    }
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
        logoutBtn.addEventListener('click', (e) => {
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
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    setInterval(() => {
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
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.style.display = 'block';
            if (searchInput) searchInput.focus();
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            searchModal.style.display = 'none';
        });
    }
    
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.style.display = 'none';
            }
        });
    }
    
    if (searchInput && searchResults) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (query.length < 2) {
                    searchResults.innerHTML = '';
                    return;
                }
                
                const results = searchProducts(query);
                displaySearchResults(results, searchResults);
            }, 300);
        });
    }
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No products found.</p>';
        return;
    }
    
    container.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="window.location.href='shop.html'">
            <div style="display: flex; gap: 15px; align-items: center;">
                <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                <div>
                    <h4 style="margin-bottom: 5px;">${product.name}</h4>
                    <p style="color: #666; font-size: 14px;">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function loadFeaturedProducts() {
    const featuredProducts = getFeaturedProducts();
    renderProductsGrid(featuredProducts, 'featuredProducts');
}

    function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let products = category === 'all' ? getAllProducts() : getProductsByCategory(category);
    renderProductsGrid(products, 'featuredProducts');
}

function loadShopProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    let productsToShow = category ? getProductsByCategory(category) : getAllProducts();
    renderProductsGrid(productsToShow, 'shopProducts');
    
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect) {
        categorySelect.value = category || '';
    }
    if (typeof setActiveCategoryPill === 'function') {
        setActiveCategoryPill(category || '');
    }
    
    if (category) {
        const categoryNames = {
            'watches': 'Watches',
            'shoes': 'Shoes',
            'accessories': 'Accessories'
        };
        const categoryName = categoryNames[category] || category;
        const pageHeader = document.querySelector('.shop-header h1');
        if (pageHeader) {
            pageHeader.textContent = categoryName;
        }
    }
}

    function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    alert('Thank you for subscribing! We\'ll send you exclusive offers and updates.');
    event.target.reset();
}

    const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

