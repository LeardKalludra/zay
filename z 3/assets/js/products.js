const products = [
    {
        id: 1,
        name: "Gym Weight Set",
        price: 240.00,
        originalPrice: 299.00,
        image: "https://i.insider.com/5e8247562ff83953b63efa46?width=700",
        description: "Professional grade gym weights for your home workout. Durable and ergonomic design.",
        rating: 5,
        reviews: 24,
        category: "accessories",
        badge: "SALE"
    },
    {
        id: 2,
        name: "Zay Watch Pro",
        price: 480.00,
        image: "http://127.0.0.1:5500/z%203/public/images/watch.png",
        description: "Advanced smartwatch with health tracking, GPS, and premium design. Water resistant.",
        rating: 5,
        reviews: 48,
        category: "watches",
        badge: "HOT"
    },
    {
        id: 3,
        name: "Nike",
        price: 360.00,
        image: "https://wallpapercave.com/wp/wp8129955.jpg",
        description: "High-performance shoes with advanced cushioning technology.",
        rating: 5,
        reviews: 74,
        category: "shoes"
    },
    {
        id: 4,
        name: "Luxury Timepiece",
        price: 1200.00,
        image: "https://images.unsplash.com/photo-1700650109006-1741e917a6bf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        image: "https://images.unsplash.com/photo-1709258228137-19a8c193be39?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cnVubmluZyUyMHNuZWFrZXJzfGVufDB8fDB8fHww",
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
        image: "https://images.unsplash.com/photo-1722842529194-b8c5c24c8790?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Stylish designer sunglasses with UV protection and polarized lenses.",
        rating: 4,
        reviews: 18,
        category: "accessories"
    },
    {
        id: 7,
        name: "Premnium Rolex Watch",
        price: 850.00,
        image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Durable trail running shoes with superior grip and breathable mesh.",
        rating: 4,
        reviews: 29,
        category: "shoes"
    },
    {
        id: 9,
        name: "Fitness Tracker Apple Watch",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1758348844319-6ca57f0a8ea0?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Advanced fitness tracker with heart rate monitor and sleep tracking.",
        rating: 4,
        reviews: 15,
        category: "technology"
    },
    {
        id: 10,
        name: "Classic Leather Watch",
        price: 320.00,
        image: "https://images.unsplash.com/photo-1618960507963-9d2d4562c1b4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        image: "https://images.unsplash.com/photo-1552346210-57dc21545e80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Professional basketball shoes with superior ankle support and cushioning.",
        rating: 5,
        reviews: 67,
        category: "shoes",
        badge: "SALE"
    },
    {
        id: 12,
        name: "AirPods",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Premium wireless earbuds with noise cancellation and long battery life.",
        rating: 5,
        reviews: 89,
        category: "technology",
        badge: "HOT"
    },
    {
        id: 13,
        name: "Digital Sports Watch",
        price: 190.00,
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=1365&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Feature-rich digital sports watch with multiple training modes.",
        rating: 4,
        reviews: 45,
        category: "technology",
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
        image: "https://images.unsplash.com/photo-1708622833152-924c6e364138?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Spacious gym bag with multiple compartments and durable construction.",
        rating: 4,
        reviews: 33,
        category: "accessories"
    },
    {
        id: 16,
        name: "Chronograph Watch",
        price: 650.00,
        image: "https://monchwatches.com/cdn/shop/files/Shot9.png?v=1755008718&width=2048",
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
        image: "https://media.istockphoto.com/id/1437519010/photo/vertical-shot-of-a-guy-wearing-a-black-sneaker-on-the-beach-in-daylight.webp?a=1&s=612x612&w=0&k=20&c=TvgUcIn8LSFCKtB0OdHoauy3E3tJdQ9GU5-CyyfqI4E=",
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
        image: "https://images.unsplash.com/photo-1601925268030-e734cf5bdc52?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Eco-friendly yoga mat with superior grip and cushioning for all poses.",
        rating: 5,
        reviews: 76,
        category: "accessories"
    },
    {
        id: 19,
        name: "Diving Watch",
        price: 550.00,
        image: "https://images.unsplash.com/photo-1704782476133-5863a05a90b1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Professional diving watch water resistant up to 300 meters depth.",
        rating: 5,
        reviews: 19,
        category: "watches"
    },
    {
        id: 20,
        name: "Fashion Sneakers",
        price: 195.00,
        image: "https://images.unsplash.com/photo-1650751909769-f918d36bab92?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Trendy fashion sneakers with modern design and comfortable fit.",
        rating: 4,
        reviews: 63,
        category: "shoes"
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
        image: "https://images.unsplash.com/photo-1738165758746-5bfad0dd55ec?q=80&w=1360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        image: "https://images.unsplash.com/photo-1651752090085-50375d90bf8b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Advanced smart ring with health tracking and notification features.",
        rating: 5,
        reviews: 58,
        category: "technology",

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

function getDynamicProducts() {
    const combined = [];
    for (let i = 0; i < products.length; i++) {
        combined.push(products[i]);
    }
    try {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
        const extra = storedProducts.concat(adminProducts);
        for (let i = 0; i < extra.length; i++) {
            const p = extra[i];
            if (!p || !p.id) continue;
            const exists = combined.some(function(item) { return item.id === p.id; });
            if (!exists) combined.push(p);
        }
    } catch (e) {}
    const removed = getRemovedProductIds();
    const filtered = combined.filter(function(p) { return !removed.includes(p.id); });
    const overridden = applyProductOverrides(filtered);
    return attachInventoryToProducts(overridden);
}

function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const outOfStock = typeof product.stock === 'number' && product.stock <= 0;
    if (outOfStock) {
        card.classList.add('out-of-stock');
    }
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
    const ratingStars = document.createElement('span');
    ratingStars.textContent = makeStars(product.rating);
    const ratingReviews = document.createElement('small');
    ratingReviews.textContent = (product.reviews || 0) + ' reviews';
    rating.appendChild(ratingStars);
    rating.appendChild(ratingReviews);
    meta.appendChild(rating);

    if (typeof product.stock === 'number') {
        const stock = document.createElement('span');
        stock.className = 'stock-chip ' + (outOfStock ? 'stock-empty' : 'stock-available');
        stock.textContent = outOfStock ? 'Out of stock' : (product.stock + ' in stock');
        meta.appendChild(stock);
    }

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


    info.appendChild(priceRow);

    const button = document.createElement('button');
    button.className = 'add-to-cart';
    button.textContent = outOfStock ? 'Out of Stock' : 'Add to Cart';
    button.disabled = outOfStock;
    if (outOfStock) {
        button.classList.add('disabled');
    } else {
        button.addEventListener('click', function() {
            addToCart(product.id);
        });
    }
    info.appendChild(button);

    card.appendChild(media);
    card.appendChild(info);

    return card;
}

function getInventoryMap() {
    try {
        return JSON.parse(localStorage.getItem('inventory')) || {};
    } catch (e) {
        return {};
    }
}

function saveInventoryMap(map) {
    localStorage.setItem('inventory', JSON.stringify(map));
}

function getProductStock(productId) {
    const inventory = getInventoryMap();
    if (inventory[productId] !== undefined) return inventory[productId];
    const product = products.find(p => p.id === productId);
    if (product && typeof product.stock === 'number') return product.stock;
    return 0;
}

function setProductStock(productId, quantity) {
    const inventory = getInventoryMap();
    inventory[productId] = Math.max(0, parseInt(quantity, 10) || 0);
    saveInventoryMap(inventory);
}

function removeProductStock(productId) {
    const inventory = getInventoryMap();
    if (inventory[productId] !== undefined) {
        delete inventory[productId];
        saveInventoryMap(inventory);
    }
}

function attachInventoryToProducts(list) {
    const inventory = getInventoryMap();
    let updated = false;
    const withInventory = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const fallback = typeof item.stock === 'number' ? item.stock : 20;
        const stock = inventory[item.id] !== undefined ? inventory[item.id] : fallback;
        if (inventory[item.id] === undefined) {
            inventory[item.id] = stock;
            updated = true;
        }
        const copy = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description,
            category: item.category,
            rating: item.rating,
            reviews: item.reviews,
            badge: item.badge,
            stock: stock
        };
        withInventory.push(copy);
    }
    if (updated) saveInventoryMap(inventory);
    return withInventory;
}

function getRemovedProductIds() {
    try {
        const raw = JSON.parse(localStorage.getItem('removedProducts')) || [];
        const cleaned = [];
        for (let i = 0; i < raw.length; i++) {
            const num = parseInt(raw[i], 10);
            if (!isNaN(num)) cleaned.push(num);
        }
        return cleaned;
    } catch (e) {
        return [];
    }
}

function saveRemovedProductIds(list) {
    localStorage.setItem('removedProducts', JSON.stringify(list));
}

function getProductOverrides() {
    try {
        return JSON.parse(localStorage.getItem('productOverrides')) || {};
    } catch (e) {
        return {};
    }
}

function saveProductOverrides(map) {
    localStorage.setItem('productOverrides', JSON.stringify(map));
}

function applyProductOverrides(list) {
    const overrides = getProductOverrides();
    if (!overrides || typeof overrides !== 'object') return list;
    const updated = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const override = overrides[item.id];
        if (!override) {
            updated.push(item);
            continue;
        }
        const merged = {
            id: item.id,
            name: override.name || item.name,
            price: override.price || item.price,
            image: override.image || item.image,
            description: override.description || item.description,
            category: override.category || item.category,
            rating: item.rating,
            reviews: item.reviews,
            badge: item.badge,
            stock: item.stock
        };
        updated.push(merged);
    }
    return updated;
}

function makeStars(rating) {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return filled + empty;
}

function renderProductsGrid(productsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    clearElement(container);
    
    if (productsArray.length === 0) {
        const empty = document.createElement('p');
        empty.style.textAlign = 'center';
        empty.style.gridColumn = '1/-1';
        empty.style.color = 'var(--text-gray)';
        empty.style.fontSize = '18px';
        empty.style.padding = '60px';
        empty.textContent = 'No products found. Try a different search or filter.';
        container.appendChild(empty);
        return;
    }
    
    for (let i = 0; i < productsArray.length; i++) {
        container.appendChild(renderProductCard(productsArray[i]));
    }
}

function clearElement(el) {
    if (!el) return;
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}
