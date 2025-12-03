
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
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

function clearElement(el) {
    if (!el) return;
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in-up').forEach(function(el) {
        observer.observe(el);
    });
}

function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
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
        let count = 0;
        for (let i = 0; i < cart.length; i++) {
            count += cart[i].quantity;
        }
        floatingCartCount.textContent = count;
    }
    
    if (!floatingCartItems) return;
    clearElement(floatingCartItems);
    
    if (cart.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '20px';
        emptyMsg.style.color = 'var(--text-gray)';
        emptyMsg.textContent = 'Your cart is empty';
        floatingCartItems.appendChild(emptyMsg);
        if (floatingCartTotal) floatingCartTotal.textContent = '0.00';
        return;
    }
    
    cart.forEach(function(item) {
        const wrapper = document.createElement('div');
        wrapper.className = 'floating-cart-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        wrapper.appendChild(img);

        const info = document.createElement('div');
        info.className = 'floating-cart-item-info';
        const title = document.createElement('h5');
        title.textContent = item.name;
        const meta = document.createElement('p');
        meta.textContent = '$' + item.price.toFixed(2) + ' x ' + item.quantity;
        info.appendChild(title);
        info.appendChild(meta);

        wrapper.appendChild(info);
        floatingCartItems.appendChild(wrapper);
    });
    
    if (floatingCartTotal) {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].price * cart[i].quantity;
        }
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
        logoutBtn.addEventListener('click', function(e) {
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
        slides.forEach(function(slide) { slide.classList.remove('active'); });
        indicators.forEach(function(indicator) { indicator.classList.remove('active'); });
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showSlide(currentSlide + 1);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showSlide(currentSlide - 1);
        });
    }
    
    indicators.forEach(function(indicator, index) {
        indicator.addEventListener('click', function() {
            showSlide(index);
        });
    });
    
    setInterval(function() {
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
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchModal.style.display = 'block';
            if (searchInput) searchInput.focus();
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchModal.style.display = 'none';
        });
    }
    
    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                searchModal.style.display = 'none';
            }
        });
    }
    
    if (searchInput && searchResults) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            searchTimeout = setTimeout(function() {
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

function displaySearchResults(results, container) {
    clearElement(container);
    if (results.length === 0) {
        const empty = document.createElement('p');
        empty.style.padding = '20px';
        empty.style.textAlign = 'center';
        empty.style.color = '#999';
        empty.textContent = 'No products found.';
        container.appendChild(empty);
        return;
    }
    
    results.forEach(function(product) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.addEventListener('click', function() {
            window.location.href = 'shop.html';
        });

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '15px';
        row.style.alignItems = 'center';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';

        const info = document.createElement('div');
        const title = document.createElement('h4');
        title.style.marginBottom = '5px';
        title.textContent = product.name;
        const price = document.createElement('p');
        price.style.color = '#666';
        price.style.fontSize = '14px';
        price.textContent = '$' + product.price.toFixed(2);
        info.appendChild(title);
        info.appendChild(price);

        row.appendChild(img);
        row.appendChild(info);
        item.appendChild(row);
        container.appendChild(item);
    });
}

function loadFeaturedProducts() {
    const featuredProducts = getFeaturedProducts();
    renderProductsGrid(featuredProducts, 'featuredProducts');
}

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const products = category === 'all' ? getAllProducts() : getProductsByCategory(category);
    renderProductsGrid(products, 'featuredProducts');
}

function loadShopProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    const productsToShow = category ? getProductsByCategory(category) : getAllProducts();
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

