const products = [
    {
        id: 1,
        name: "Gym Weight Set",
        price: 240.00,
        originalPrice: 299.00,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&q=80",
        description: "Professional grade gym weights for your home workout. Durable and ergonomic design.",
        rating: 5,
        reviews: 24,
        category: "accessories",
        badge: "SALE"
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        price: 480.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80",
        description: "Advanced smartwatch with health tracking, GPS, and premium design. Water resistant.",
        rating: 5,
        reviews: 48,
        category: "watches",
        badge: "HOT"
    },
    {
        id: 3,
        name: "Running Shoes Elite",
        price: 360.00,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80",
        description: "High-performance running shoes with advanced cushioning technology.",
        rating: 5,
        reviews: 74,
        category: "shoes"
    },
    {
        id: 4,
        name: "Luxury Timepiece",
        price: 1200.00,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20315?w=600&h=600&fit=crop&q=80",
        description: "Elegant luxury watch with Swiss movement and premium materials.",
        rating: 5,
        reviews: 32,
        category: "watches"
    },
    {
        id: 5,
        name: "Athletic Sneakers",
        price: 280.00,
        originalPrice: 350.00,
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop&q=80",
        description: "Comfortable athletic sneakers perfect for daily wear and sports activities.",
        rating: 5,
        reviews: 56,
        category: "shoes",
        badge: "SALE"
    },
    {
        id: 6,
        name: "Designer Sunglasses",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&q=80",
        description: "Stylish designer sunglasses with UV protection and polarized lenses.",
        rating: 4,
        reviews: 18,
        category: "accessories"
    },
    {
        id: 7,
        name: "Premium Watch Collection",
        price: 850.00,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&q=80",
        description: "Sophisticated timepiece with leather strap and automatic movement.",
        rating: 5,
        reviews: 42,
        category: "watches",
        badge: "HOT"
    },
    {
        id: 8,
        name: "Trail Running Shoes",
        price: 220.00,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&q=80",
        description: "Durable trail running shoes with superior grip and breathable mesh.",
        rating: 4,
        reviews: 29,
        category: "shoes"
    },
    {
        id: 9,
        name: "Fitness Tracker Band",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&q=80",
        description: "Advanced fitness tracker with heart rate monitor and sleep tracking.",
        rating: 4,
        reviews: 15,
        category: "accessories"
    },
    {
        id: 10,
        name: "Classic Leather Watch",
        price: 320.00,
        image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop&q=80",
        description: "Timeless classic watch with genuine leather strap and elegant design.",
        rating: 5,
        reviews: 38,
        category: "watches"
    },
    {
        id: 11,
        name: "Basketball Shoes Pro",
        price: 340.00,
        originalPrice: 420.00,
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&q=80",
        description: "Professional basketball shoes with superior ankle support and cushioning.",
        rating: 5,
        reviews: 67,
        category: "shoes",
        badge: "SALE"
    },
    {
        id: 12,
        name: "Wireless Earbuds",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&q=80",
        description: "Premium wireless earbuds with noise cancellation and long battery life.",
        rating: 5,
        reviews: 89,
        category: "accessories",
        badge: "HOT"
    },
    {
        id: 13,
        name: "Digital Sports Watch",
        price: 190.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80",
        description: "Feature-rich digital sports watch with multiple training modes.",
        rating: 4,
        reviews: 45,
        category: "watches"
    },
    {
        id: 14,
        name: "Casual Canvas Shoes",
        price: 95.00,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&q=80",
        description: "Comfortable casual canvas shoes perfect for everyday wear.",
        rating: 4,
        reviews: 52,
        category: "shoes"
    },
    {
        id: 15,
        name: "Gym Bag Pro",
        price: 75.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80",
        description: "Spacious gym bag with multiple compartments and durable construction.",
        rating: 4,
        reviews: 33,
        category: "accessories"
    },
    {
        id: 16,
        name: "Chronograph Watch",
        price: 650.00,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20315?w=600&h=600&fit=crop&q=80",
        description: "Precision chronograph watch with stopwatch functionality and tachymeter.",
        rating: 5,
        reviews: 28,
        category: "watches"
    },
    {
        id: 17,
        name: "Hiking Boots",
        price: 280.00,
        originalPrice: 350.00,
        image: "https://images.unsplash.com/photo-1608256246200-53bd53f83321?w=600&h=600&fit=crop&q=80",
        description: "Rugged hiking boots with waterproof protection and superior traction.",
        rating: 5,
        reviews: 41,
        category: "shoes",
        badge: "SALE"
    },
    {
        id: 18,
        name: "Yoga Mat Premium",
        price: 65.00,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop&q=80",
        description: "Eco-friendly yoga mat with superior grip and cushioning for all poses.",
        rating: 5,
        reviews: 76,
        category: "accessories"
    },
    {
        id: 19,
        name: "Diving Watch",
        price: 550.00,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&q=80",
        description: "Professional diving watch water resistant up to 300 meters depth.",
        rating: 5,
        reviews: 19,
        category: "watches"
    },
    {
        id: 20,
        name: "Fashion Sneakers",
        price: 195.00,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&q=80",
        description: "Trendy fashion sneakers with modern design and comfortable fit.",
        rating: 4,
        reviews: 63,
        category: "shoes"
    },
    {
        id: 21,
        name: "Resistance Bands Set",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&q=80",
        description: "Complete resistance bands set with multiple resistance levels.",
        rating: 5,
        reviews: 94,
        category: "accessories",
        badge: "HOT"
    },
    {
        id: 22,
        name: "Minimalist Watch",
        price: 275.00,
        image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop&q=80",
        description: "Sleek minimalist watch design with clean lines and modern aesthetics.",
        rating: 4,
        reviews: 37,
        category: "watches"
    },
    {
        id: 23,
        name: "Tennis Shoes",
        price: 165.00,
        originalPrice: 220.00,
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&q=80",
        description: "Professional tennis shoes with excellent court grip and stability.",
        rating: 4,
        reviews: 26,
        category: "shoes",
        badge: "SALE"
    },
    {
        id: 24,
        name: "Smart Ring",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&q=80",
        description: "Advanced smart ring with health tracking and notification features.",
        rating: 5,
        reviews: 58,
        category: "accessories"
    }
];

function getFeaturedProducts() {
    return getDynamicProducts().slice(0, 6);
}

function getAllProducts() {
    return getDynamicProducts();
}

function getProductById(id) {
    return getDynamicProducts().find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
    const list = getDynamicProducts();
    if (!category) return list;
    return list.filter(product => product.category === category);
}

function searchProducts(query) {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return getDynamicProducts().filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

<<<<<<< Updated upstream
function renderProductCard(product) {
    const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    const badge = product.badge ? `<div class="product-badge badge-${product.badge.toLowerCase()}">${product.badge}</div>` : '';
    const originalPrice = product.originalPrice ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : '';
    const categoryLabel = product.category ? product.category.replace(/^\w/, c => c.toUpperCase()) : 'Featured';
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-media">
                ${badge}
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-meta">
                    <span class="product-category-pill">${categoryLabel}</span>
                    <span class="product-rating-badge">${stars}<small>${product.reviews} reviews</small></span>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price-row">
                    <div class="price-stack">
                        <span class="price-current">$${product.price.toFixed(2)}</span>
                        ${originalPrice}
                    </div>
                    <span class="product-delivery-pill">Ships in 48h</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
=======
function getDynamicProducts() {
    const combined = [...products];
    try {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
        [...storedProducts, ...adminProducts].forEach(p => {
            if (p && p.id && !combined.find(item => item.id === p.id)) {
                combined.push(p);
            }
        });
    } catch (e) {
    }
    return combined;
}

function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const media = document.createElement('div');
    media.className = 'product-media';

    if (product.badge) {
        const badge = document.createElement('div');
        badge.className = 'product-badge badge-' + product.badge.toLowerCase();
        badge.textContent = product.badge;
        media.appendChild(badge);
    }

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';
    media.appendChild(img);

    const info = document.createElement('div');
    info.className = 'product-info';

    const meta = document.createElement('div');
    meta.className = 'product-meta';

    const category = document.createElement('span');
    category.className = 'product-category-pill';
    category.textContent = product.category ? product.category.replace(/^\w/, function(c) { return c.toUpperCase(); }) : 'Featured';
    meta.appendChild(category);

    const rating = document.createElement('span');
    rating.className = 'product-rating-badge';
    rating.innerHTML = makeStars(product.rating) + '<small>' + product.reviews + ' reviews</small>';
    meta.appendChild(rating);

    info.appendChild(meta);

    const title = document.createElement('h3');
    title.className = 'product-title';
    title.textContent = product.name;
    info.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'product-description';
    desc.textContent = product.description;
    info.appendChild(desc);

    const priceRow = document.createElement('div');
    priceRow.className = 'product-price-row';

    const priceStack = document.createElement('div');
    priceStack.className = 'price-stack';

    const currentPrice = document.createElement('span');
    currentPrice.className = 'price-current';
    currentPrice.textContent = '$' + product.price.toFixed(2);
    priceStack.appendChild(currentPrice);

    if (product.originalPrice) {
        const original = document.createElement('span');
        original.className = 'price-original';
        original.textContent = '$' + product.originalPrice.toFixed(2);
        priceStack.appendChild(original);
    }

    priceRow.appendChild(priceStack);

    const delivery = document.createElement('span');
    delivery.className = 'product-delivery-pill';
    delivery.textContent = 'Ships in 48h';
    priceRow.appendChild(delivery);

    info.appendChild(priceRow);

    const button = document.createElement('button');
    button.className = 'add-to-cart';
    button.textContent = 'Add to Cart';
    button.addEventListener('click', function() {
        addToCart(product.id);
    });
    info.appendChild(button);

    card.appendChild(media);
    card.appendChild(info);

    return card;
}

function makeStars(rating) {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return filled + empty;
>>>>>>> Stashed changes
}

function renderProductsGrid(productsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (productsArray.length === 0) {
<<<<<<< Updated upstream
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-gray); font-size: 18px; padding: 60px;">No products found. Try a different search or filter.</p>';
        return;
    }
    
    container.innerHTML = productsArray.map(product => renderProductCard(product)).join('');
=======
        const empty = document.createElement('p');
        empty.style.textAlign = 'center';
        empty.style.gridColumn = '1/-1';
        empty.style.color = 'var(--text-gray)';
        empty.style.fontSize = '18px';
        empty.style.padding = '60px';
        empty.textContent = 'No products found. Try a different search or filter.';
        container.innerHTML = '';
        container.appendChild(empty);
        return;
    }
    
    container.innerHTML = '';
    for (let i = 0; i < productsArray.length; i++) {
        container.appendChild(renderProductCard(productsArray[i]));
    }
>>>>>>> Stashed changes
}
