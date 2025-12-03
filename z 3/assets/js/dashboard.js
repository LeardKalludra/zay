document.addEventListener('DOMContentLoaded', function () {
    const data = collectDashboardData();
    renderMetrics(data);
    renderOrders(data);
    renderTopProducts(data);
    renderInventory(data);
    renderAnalytics(data);
    renderSettings(data);
    initProductForm();
    attachStatusHandlers();
    initSections();
    initInventoryManager();
    initProductEditModal();
});

function clearElement(el) {
    if (!el) return;
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function collectDashboardData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let carts = collectCarts();
    const ordersHistory = getOrders();
    const settingsPrefs = getSettingsPrefs();

    if (!users.length && !carts.length) {
        const sample = buildSampleData();
        users = sample.users;
        carts = sample.carts;
    }

    const orderSource = ordersHistory.length ? ordersHistory : carts;
    const sortedOrders = orderSource.slice().sort(function (a, b) {
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;
        return bDate - aDate;
    });

    const totalRevenue = sortedOrders.reduce(function (sum, cart) {
        return sum + cart.total;
    }, 0);
    const ordersCount = sortedOrders.filter(function (c) { return c.items.length > 0; }).length;
    const activeUsers = carts.filter(function (c) { return c.items.length > 0 && c.owner; }).length;
    const avgOrder = ordersCount ? totalRevenue / ordersCount : 0;
    const activeCartsTotal = carts
        .filter(function (c) { return c.items.length > 0; })
        .reduce(function (sum, cart) { return sum + cart.total; }, 0);
    const orderSalesTotal = ordersHistory.length
        ? ordersHistory.reduce(function (sum, order) { return sum + (order.total || 0); }, 0)
        : totalRevenue;

    const productSales = {};
    carts.forEach(function (cart) {
        cart.items.forEach(function (item) {
            if (!productSales[item.id]) {
                productSales[item.id] = { ...item, sold: 0 };
            }
            productSales[item.id].sold += item.quantity;
        });
    });

    const topProducts = Object.values(productSales)
        .sort(function (a, b) { return b.sold - a.sold; })
        .slice(0, 3);

    const inventory = buildInventorySnapshot();

    const itemsSold = sortedOrders.reduce(function (sum, order) {
        const itemTotal = (order.items || []).reduce(function (s, i) { return s + (i.quantity || 0); }, 0);
        return sum + itemTotal;
    }, 0);
    const conversionBase = carts.length || sortedOrders.length;
    const conversionRate = conversionBase ? Math.round((ordersCount / Math.max(conversionBase, 1)) * 100) : 0;
    const barTotals = sortedOrders.length ? sortedOrders.map(function (o) { return o.total; }) : carts.map(function (c) { return c.total; });

    return {
        users: users,
        carts: carts,
        metrics: [
            { label: 'Active carts total', value: activeCartsTotal, meta: 'Sum of active carts', trend: { dir: 'up', text: ordersCount + ' orders' }, format: 'currency' },
            { label: 'Total order sales', value: orderSalesTotal, meta: 'All completed checkouts', trend: ordersCount ? { dir: 'up', text: formatCurrency(avgOrder) + ' avg' } : null, format: 'currency' },
            { label: 'Total orders', value: ordersCount, meta: 'Orders placed', badge: '' },
            { label: 'Registered users', value: users.length, meta: 'Accounts created', badge: '' }
        ],
        orders: sortedOrders,
        topProducts: topProducts,
        inventory: inventory,
        analytics: {
            cards: [
                { label: 'Orders', value: ordersCount.toString(), trend: ordersCount ? 'up' : 'down', change: ordersCount ? '+ live' : 'no orders' },
                { label: 'Revenue', value: formatCurrency(orderSalesTotal), trend: ordersCount ? 'up' : 'down', change: ordersCount ? formatCurrency(avgOrder) + ' avg' : '$0 avg' },
                { label: 'Items sold', value: itemsSold.toString(), trend: itemsSold ? 'up' : 'down', change: itemsSold ? '+ items' : 'no items' },
                { label: 'Conversion', value: conversionBase ? (conversionRate + '%') : '—', trend: conversionRate ? 'up' : 'down', change: conversionBase ? conversionBase + ' sessions' : 'no sessions' }
            ],
            bars: buildBarHeights(barTotals),
            totals: barTotals
        },
        settings: mergeSettings(settingsPrefs)
    };
}

function collectCarts() {
    const carts = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cart_')) {
            try {
                const stored = JSON.parse(localStorage.getItem(key)) || [];
                const ownerKey = key.replace('cart_', '');
                const owner = ownerKey === 'guest' ? null : decodeURIComponent(ownerKey);
                const total = stored.reduce(function (sum, item) { return sum + (item.price * item.quantity); }, 0);
                const date = new Date(parseInt(localStorage.getItem(key + '_updated') || Date.now(), 10));
                const status = getOrderStatuses()[key] || (stored.length ? 'Pending' : 'Empty');
                carts.push({ id: key, owner: owner, items: stored, total: total, date: date, status: status });
            } catch (e) {
                continue;
            }
        }
    }
    return carts.sort(function (a, b) { return b.total - a.total; });
}

function getOrders() {
    try {
        const stored = JSON.parse(localStorage.getItem('orders')) || [];
        return stored.map(function (order) {
            return {
                id: order.id,
                owner: order.owner,
                items: order.items || [],
                total: order.total || 0,
                date: order.date ? new Date(order.date) : new Date(),
                status: order.status || 'Pending'
            };
        });
    } catch (e) {
        return [];
    }
}

function buildSampleData() {
    let baseProducts = (typeof products !== 'undefined' ? products.slice(0, 4) : []).map(function (p) {
        return {
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            category: p.category || 'general',
            quantity: 1
        };
    });

    if (!baseProducts.length) {
        baseProducts = [
            { id: 1, name: 'Sample Watch', price: 199, image: '', category: 'watches', quantity: 1 },
            { id: 2, name: 'Sample Shoes', price: 149, image: '', category: 'shoes', quantity: 1 },
            { id: 3, name: 'Sample Earbuds', price: 89, image: '', category: 'accessories', quantity: 1 }
        ];
    }

    const sampleUsers = [
        { fullname: 'Alex Morgan', email: 'alex@example.com', role: 'user' },
        { fullname: 'Jamie Fox', email: 'jamie@example.com', role: 'user' }
    ];

    const sampleCarts = [
        { owner: sampleUsers[0].email, items: baseProducts.slice(0, 2), total: sumItems(baseProducts.slice(0, 2)), date: new Date() },
        { owner: sampleUsers[1].email, items: baseProducts.slice(1, 4), total: sumItems(baseProducts.slice(1, 4)), date: new Date() }
    ];

    return { users: sampleUsers, carts: sampleCarts };
}

function sumItems(items) {
    return items.reduce(function (sum, item) { return sum + (item.price * item.quantity); }, 0);
}

function renderMetrics(data) {
    const container = document.getElementById('metricsContainer');
    if (!container) return;
    clearElement(container);
    data.metrics.forEach(function (item) {
        const card = document.createElement('div');
        card.className = 'dash-card';

        const top = document.createElement('div');
        top.className = 'card-top';

        const label = document.createElement('p');
        label.textContent = item.label;
        top.appendChild(label);

        if (item.trend) {
            const trend = document.createElement('span');
            trend.className = 'trend ' + item.trend.dir;
            const icon = document.createElement('i');
            icon.className = 'fa-solid ' + (item.trend.dir === 'up' ? 'fa-arrow-up' : 'fa-arrow-down');
            trend.appendChild(icon);
            const trendText = document.createTextNode(' ' + item.trend.text);
            trend.appendChild(trendText);
            top.appendChild(trend);
        }

        if (item.badge) {
            const badge = document.createElement('span');
            badge.className = 'badge-pill badge-warn';
            badge.textContent = item.badge;
            top.appendChild(badge);
        }

        card.appendChild(top);

        const value = document.createElement('h2');
        const isCurrency = item.format === 'currency';
        value.textContent = typeof item.value === 'number' && isCurrency ? formatCurrency(item.value) : item.value;
        card.appendChild(value);

        const meta = document.createElement('p');
        meta.className = 'muted';
        meta.textContent = item.meta;
        card.appendChild(meta);

        container.appendChild(card);
    });
}

function renderOrders(data) {
    const body = document.getElementById('ordersBody');
    const cards = document.getElementById('ordersCards');
    if (!body) return;
    clearElement(body);
    if (cards) clearElement(cards);
    if (data.orders.length === 0) {
        const empty = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.textContent = 'No carts yet.';
        empty.appendChild(td);
        body.appendChild(empty);
        if (cards) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'order-card empty';
            emptyCard.textContent = 'No orders yet.';
            cards.appendChild(emptyCard);
        }
        return;
    }
    data.orders.forEach(function (order) {
        const statusValue = (getOrderStatuses()[order.id] || order.status || 'Pending');

        const row = document.createElement('tr');
        const idTd = document.createElement('td');
        idTd.textContent = formatOrderId(order.id);
        const ownerTd = document.createElement('td');
        ownerTd.textContent = order.owner || 'Guest';
        const statusTd = document.createElement('td');
        const select = document.createElement('select');
        select.className = 'order-status';
        select.setAttribute('data-order', order.id);
        ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].forEach(function (st) {
            const opt = document.createElement('option');
            opt.value = st;
            opt.textContent = st;
            if (statusValue === st) opt.selected = true;
            select.appendChild(opt);
        });
        statusTd.appendChild(select);
        const totalTd = document.createElement('td');
        totalTd.textContent = formatCurrency(order.total);
        const dateTd = document.createElement('td');
        dateTd.textContent = order.date.toLocaleDateString();

        row.appendChild(idTd);
        row.appendChild(ownerTd);
        row.appendChild(statusTd);
        row.appendChild(totalTd);
        row.appendChild(dateTd);
        body.appendChild(row);

        if (cards) {
            const card = document.createElement('div');
            card.className = 'order-card';

            const top = document.createElement('div');
            top.className = 'order-card__row';
            const idLabel = document.createElement('strong');
            idLabel.textContent = formatOrderId(order.id);
            const statusPill = document.createElement('span');
            statusPill.className = 'pill';
            statusPill.textContent = order.status || 'Pending';
            top.appendChild(idLabel);
            top.appendChild(statusPill);

            const middle = document.createElement('div');
            middle.className = 'order-card__row muted';
            const ownerSpan = document.createElement('span');
            ownerSpan.textContent = order.owner || 'Guest';
            const dateSpan = document.createElement('span');
            dateSpan.textContent = order.date.toLocaleDateString();
            middle.appendChild(ownerSpan);
            middle.appendChild(dateSpan);

            const bottom = document.createElement('div');
            bottom.className = 'order-card__row';
            const totalLabel = document.createElement('span');
            totalLabel.textContent = 'Total';
            const totalValue = document.createElement('strong');
            totalValue.textContent = formatCurrency(order.total);
            bottom.appendChild(totalLabel);
            bottom.appendChild(totalValue);

            const statusWrap = document.createElement('div');
            statusWrap.className = 'order-card__row';
            const label = document.createElement('span');
            label.textContent = 'Status';
            const statusSelect = document.createElement('select');
            statusSelect.className = 'order-status';
            statusSelect.setAttribute('data-order', order.id);
            ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].forEach(function (st) {
                const opt = document.createElement('option');
                opt.value = st;
                opt.textContent = st;
                if (statusValue === st) opt.selected = true;
                statusSelect.appendChild(opt);
            });
            statusWrap.appendChild(label);
            statusWrap.appendChild(statusSelect);

            card.appendChild(top);
            card.appendChild(middle);
            card.appendChild(bottom);
            card.appendChild(statusWrap);
            cards.appendChild(card);
        }
    });
}

function renderTopProducts(data) {
    const list = document.getElementById('topProductsList');
    if (!list) return;
    clearElement(list);
    if (data.topProducts.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No product activity yet.';
        list.appendChild(li);
        return;
    }
    data.topProducts.forEach(function (item) {
        const li = document.createElement('li');
        const left = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = item.name;
        const meta = document.createElement('p');
        meta.className = 'muted';
        meta.textContent = (item.category || 'Products') + ' • ' + item.sold + ' in carts';
        left.appendChild(title);
        left.appendChild(meta);

        const pill = document.createElement('span');
        pill.className = 'pill' + (item.tone ? ' pill-' + item.tone : '');
        pill.textContent = formatCurrency(item.price);

        li.appendChild(left);
        li.appendChild(pill);
        list.appendChild(li);
    });
}

function renderInventory(data) {
    const list = document.getElementById('inventoryList');
    if (!list) return;
    clearElement(list);
    if (!data.inventory.length) {
        const empty = document.createElement('li');
        empty.textContent = 'No inventory yet.';
        list.appendChild(empty);
        return;
    }
    data.inventory.forEach(function (item) {
        const li = document.createElement('li');
        const left = document.createElement('div');
        const name = document.createElement('p');
        const boldName = document.createElement('strong');
        boldName.textContent = item.name;
        name.appendChild(boldName);
        const sku = document.createElement('p');
        sku.className = 'muted';
        sku.textContent = 'SKU: ' + item.sku;
        left.appendChild(name);
        left.appendChild(sku);

        const status = document.createElement('span');
        status.className = 'status-pill ' + item.tone;
        status.textContent = item.status + ' • ' + item.stock;

        li.appendChild(left);
        li.appendChild(status);
        list.appendChild(li);
    });
}

function renderCustomers(data) {
    return;
}

function renderAnalytics(data) {
    const cards = document.getElementById('analyticsCards');
    const bars = document.getElementById('chartBars');
    const label = document.getElementById('chartLabel');
    const meta = document.getElementById('chartMeta');
    const pill = document.getElementById('analyticsPill');
    if (cards) {
        clearElement(cards);
        data.analytics.cards.forEach(function (item) {
            const card = document.createElement('div');
            card.className = 'analytics-card';
            const label = document.createElement('p');
            label.className = 'muted';
            label.textContent = item.label;
            const value = document.createElement('h3');
            value.textContent = item.value;
            const trend = document.createElement('p');
            trend.className = 'trend ' + item.trend;
            const icon = document.createElement('i');
            icon.className = 'fa-solid ' + (item.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down');
            trend.appendChild(icon);
            trend.appendChild(document.createTextNode(' ' + item.change));
            card.appendChild(label);
            card.appendChild(value);
            card.appendChild(trend);
            cards.appendChild(card);
        });
    }
    if (bars) {
        clearElement(bars);
        const barValues = (data.analytics.totals || []).slice(0, 6);
        const heights = data.analytics.bars.slice(0, barValues.length || data.analytics.bars.length);
        heights.forEach(function (val, idx) {
            const bar = document.createElement('span');
            bar.style.height = val + '%';
            const amount = barValues[idx] !== undefined ? barValues[idx] : 0;
            bar.setAttribute('data-value', formatCurrency(amount));
            bars.appendChild(bar);
        });
    }

    if (label) {
        const count = data.analytics.totals ? Math.min(data.analytics.totals.length, 6) : 6;
        label.textContent = 'Order totals (last ' + count + ')';
    }

    if (meta) {
        const totals = data.analytics.totals || [];
        if (totals.length) {
            const max = Math.max.apply(null, totals);
            const avg = totals.reduce(function (sum, v) { return sum + v; }, 0) / totals.length;
            meta.textContent = 'Peak ' + formatCurrency(max) + ' • Avg ' + formatCurrency(avg);
        } else {
            meta.textContent = 'No order history yet.';
        }
    }

    if (pill) {
        pill.textContent = data.orders && data.orders.length ? 'Live' : 'No data';
    }
}

function renderSettings(data) {
    const list = document.getElementById('settingsList');
    if (!list) return;
    clearElement(list);
    data.settings.forEach(function (item) {
        const label = document.createElement('label');
        label.className = 'setting-row';

        const info = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = item.label;
        const desc = document.createElement('p');
        desc.className = 'muted';
        desc.textContent = item.desc;
        info.appendChild(title);
        info.appendChild(desc);

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = !!item.checked;
        toggle.addEventListener('change', function () {
            persistSetting(item.label, toggle.checked);
        });

        label.appendChild(info);
        label.appendChild(toggle);
        list.appendChild(label);
    });
}

function statusTone(status) {
    const text = status.toLowerCase();
    if (text.includes('ship')) return 'success';
    if (text.includes('process')) return 'warn';
    return 'danger';
}

function formatCurrency(amount) {
    if (typeof amount !== 'number') return amount;
    return '$' + amount.toFixed(2);
}

function formatOrderId(id) {
    if (!id) return '#';
    if (id.startsWith('cart_')) return '#' + id.replace('cart_', '');
    if (id.startsWith('order_')) return '#' + id.replace('order_', '');
    return '#' + id;
}

function buildBarHeights(totals) {
    if (!totals || !totals.length) return [10, 12, 8, 6, 9, 7];
    const max = Math.max.apply(null, totals);
    return totals.slice(0, 6).map(function (val) {
        return max ? Math.round((val / max) * 90) + 10 : 10;
    });
}

function getOrderStatuses() {
    try {
        return JSON.parse(localStorage.getItem('orderStatuses')) || {};
    } catch (e) {
        return {};
    }
}

function saveOrderStatuses(map) {
    localStorage.setItem('orderStatuses', JSON.stringify(map));
}

function saveOrders(list) {
    localStorage.setItem('orders', JSON.stringify(list));
}

function attachStatusHandlers() {
    const body = document.getElementById('ordersBody');
    if (!body) return;
    body.addEventListener('change', function (e) {
        if (e.target && e.target.classList.contains('order-status')) {
            const id = e.target.getAttribute('data-order');
            const statuses = getOrderStatuses();
            statuses[id] = e.target.value;
            saveOrderStatuses(statuses);

            const stored = getOrders();
            const updated = stored.map(function (o) {
                if (o.id === id) {
                    return { ...o, status: e.target.value };
                }
                return o;
            });
            saveOrders(updated);
        }
    });
}

function mergeSettings(stored) {
    const defaults = [
        { label: 'Maintenance mode', desc: 'Temporarily pause storefront', checked: false },
        { label: 'Low stock alerts', desc: 'Email when inventory < 10', checked: true },
        { label: 'Order notifications', desc: 'Push updates to admin email', checked: true }
    ];
    return defaults.map(function (item) {
        if (stored[item.label] !== undefined) {
            return { ...item, checked: stored[item.label] };
        }
        return item;
    });
}

function getSettingsPrefs() {
    try {
        return JSON.parse(localStorage.getItem('settingsPrefs')) || {};
    } catch (e) {
        return {};
    }
}

function persistSetting(label, value) {
    const prefs = getSettingsPrefs();
    prefs[label] = value;
    localStorage.setItem('settingsPrefs', JSON.stringify(prefs));
}

function getAllProductData() {
    const base = typeof products !== 'undefined' ? products : [];
    const adminProducts = getAdminProducts();
    return base.concat(adminProducts);
}

function getAdminProducts() {
    try {
        return JSON.parse(localStorage.getItem('adminProducts')) || [];
    } catch (e) {
        return [];
    }
}

function saveAdminProducts(list) {
    localStorage.setItem('adminProducts', JSON.stringify(list));
}

function populateCategorySelect(selectEl) {
    if (!selectEl) return;
    const categories = getUniqueCategories();
    clearElement(selectEl);
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    defaultOpt.textContent = 'Select category';
    selectEl.appendChild(defaultOpt);
    categories.forEach(function (cat) {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = formatCategory(cat);
        selectEl.appendChild(opt);
    });
}

function getUniqueCategories() {
    const all = getAllProductData();
    const set = new Set();
    all.forEach(function (p) {
        if (p.category) set.add(p.category);
    });
    return Array.from(set);
}

function formatCategory(cat) {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function initProductForm() {
    const form = document.getElementById('productForm');
    const categorySelect = document.getElementById('productCategory');
    const quantityInput = document.getElementById('productQuantity');
    if (!form) return;
    populateCategorySelect(categorySelect);
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value.trim();
        const image = document.getElementById('productImage').value.trim();
        const description = (document.getElementById('productDescription')?.value || '').trim();
        const quantityVal = quantityInput ? parseInt(quantityInput.value, 10) : 0;
        const stock = isNaN(quantityVal) ? 0 : Math.max(0, quantityVal);
        if (!name || isNaN(price) || !category || !image || !description) return;

        const adminList = getAdminProducts();
        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            category: category,
            image: image,
            description: description,
            rating: 4,
            reviews: 0,
            stock: stock
        };
        adminList.push(newProduct);
        saveAdminProducts(adminList);
        setProductStock(newProduct.id, stock);
        persistProductsArray(newProduct);
        form.reset();
        populateCategorySelect(categorySelect);

        const data = collectDashboardData();
        renderTopProducts(data);
        renderInventory(data);
        renderAdminProducts(getDynamicProducts());
    });

    renderAdminProducts(getDynamicProducts());
}

function renderAdminProducts(list) {
    const wrapper = document.getElementById('adminProductsList');
    if (!wrapper) return;
    clearElement(wrapper);
    if (!list.length) {
        wrapper.textContent = 'No products available.';
        return;
    }
    list.forEach(function (p) {
        const row = document.createElement('div');
        row.className = 'product-row';
        const meta = document.createElement('div');
        meta.className = 'meta';
        const currentStock = getProductStock(p.id) || p.stock || 0;
        const name = document.createElement('strong');
        name.textContent = p.name;
        const category = document.createElement('span');
        category.className = 'muted';
        category.textContent = (p.category || 'Item') + ' • $' + p.price;
        const stock = document.createElement('span');
        stock.className = 'muted';
        stock.textContent = 'Stock: ' + currentStock;
        const desc = document.createElement('span');
        desc.className = 'muted';
        desc.textContent = p.description || '';
        meta.appendChild(name);
        meta.appendChild(category);
        meta.appendChild(stock);
        meta.appendChild(desc);
        const actions = document.createElement('div');
        actions.className = 'actions';
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function () {
            openProductEditModal(p.id);
        });
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Delete';
        removeBtn.addEventListener('click', function () {
            removeProductEverywhere(p.id);
            const data = collectDashboardData();
            renderTopProducts(data);
            renderInventory(data);
            renderAdminProducts(getDynamicProducts());
        });
        actions.appendChild(editBtn);
        actions.appendChild(removeBtn);
        row.appendChild(meta);
        row.appendChild(actions);
        wrapper.appendChild(row);
    });
}

function persistProductsArray(newProduct) {
    const key = 'products';
    try {
        const existing = JSON.parse(localStorage.getItem(key)) || [];
        existing.push(newProduct);
        localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
        localStorage.setItem(key, JSON.stringify([newProduct]));
    }
}

function initSections() {
    const navLinks = document.querySelectorAll('.dash-nav a');
    const sections = document.querySelectorAll('.dash-section');

    function showSection(name) {
        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === name);
        });
        sections.forEach(function (sec) {
            const match = sec.getAttribute('data-section') === name;
            if (match) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const name = this.getAttribute('data-section');
            if (name) showSection(name);
        });
    });

    showSection('overview');
}

function removeProductEverywhere(productId) {
    const numericId = parseInt(productId, 10);
    removeProductStock(numericId);

    const removed = getRemovedProductIds();
    if (!removed.includes(numericId)) {
        removed.push(numericId);
        saveRemovedProductIds(removed);
    }

    const updatedAdmin = getAdminProducts().filter(function (p) { return p.id !== numericId; });
    saveAdminProducts(updatedAdmin);

    try {
        const stored = JSON.parse(localStorage.getItem('products')) || [];
        const filteredStored = stored.filter(function (p) { return p.id !== numericId; });
        localStorage.setItem('products', JSON.stringify(filteredStored));
    } catch (e) {
    }

    const overrides = getProductOverrides();
    if (overrides[numericId]) {
        delete overrides[numericId];
        saveProductOverrides(overrides);
    }

    renderAdminProducts(getDynamicProducts());
}

function initProductEditModal() {
    const modal = document.getElementById('productEditModal');
    const form = document.getElementById('productEditForm');
    const closeEls = document.querySelectorAll('[data-close-product]');
    if (!modal || !form) return;

    closeEls.forEach(function (btn) {
        btn.addEventListener('click', closeProductEditModal);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeProductEditModal();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('productEditId').value, 10);
        const name = document.getElementById('productEditName').value.trim();
        const price = parseFloat(document.getElementById('productEditPrice').value);
        const category = document.getElementById('productEditCategory').value.trim();
        const image = document.getElementById('productEditImage').value.trim();
        const description = document.getElementById('productEditDescription').value.trim();
        if (!id || !name || isNaN(price) || !category || !image || !description) return;

        const override = { name: name, price: price, category: category, image: image, description: description };
        persistProductOverride(id, override);
        updateStoredProductRecords(id, override);

        const data = collectDashboardData();
        renderAdminProducts(getDynamicProducts());
        renderTopProducts(data);
        renderInventory(data);
        closeProductEditModal();
    });
}

function openProductEditModal(productId) {
    const modal = document.getElementById('productEditModal');
    if (!modal) return;
    const product = getDynamicProducts().find(function (p) { return p.id === productId; });
    if (!product) return;
    document.getElementById('productEditId').value = product.id;
    document.getElementById('productEditName').value = product.name || '';
    document.getElementById('productEditPrice').value = product.price || 0;
    const editCategory = document.getElementById('productEditCategory');
    populateCategorySelect(editCategory);
    if (product.category) {
        editCategory.value = product.category;
        if (editCategory.value !== product.category) {
            const opt = document.createElement('option');
            opt.value = product.category;
            opt.textContent = formatCategory(product.category);
            editCategory.appendChild(opt);
            editCategory.value = product.category;
        }
    }
    document.getElementById('productEditImage').value = product.image || '';
    document.getElementById('productEditDescription').value = product.description || '';
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeProductEditModal() {
    const modal = document.getElementById('productEditModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function persistProductOverride(id, override) {
    const overrides = getProductOverrides();
    overrides[id] = override;
    saveProductOverrides(overrides);
}

function updateStoredProductRecords(id, override) {
    const updateList = function (list) {
        return list.map(function (item) {
            if (item.id === id) {
                return { ...item, ...override };
            }
            return item;
        });
    };
    const admin = getAdminProducts();
    if (admin.length) {
        saveAdminProducts(updateList(admin));
    }
    try {
        const stored = JSON.parse(localStorage.getItem('products')) || [];
        localStorage.setItem('products', JSON.stringify(updateList(stored)));
    } catch (e) { }
}

function buildInventorySnapshot() {
    const allProducts = getDynamicProducts();
    return allProducts.map(function (p) {
        const stock = typeof p.stock === 'number' ? p.stock : getProductStock(p.id);
        const statusMeta = inventoryStatus(stock);
        return {
            id: p.id,
            name: p.name,
            category: p.category,
            sku: 'SKU-' + p.id,
            stock: stock,
            tone: statusMeta.tone,
            status: statusMeta.text
        };
    }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}

function inventoryStatus(stock) {
    if (stock <= 0) return { tone: 'danger', text: 'Out of stock' };
    if (stock < 5) return { tone: 'danger', text: 'Critical' };
    if (stock < 15) return { tone: 'warn', text: 'Low' };
    return { tone: 'success', text: 'In stock' };
}

function initInventoryManager() {
    const manageBtn = document.getElementById('inventoryManageBtn');
    const modal = document.getElementById('inventoryModal');
    const closeBtns = document.querySelectorAll('[data-close-inventory]');
    const saveBtn = document.getElementById('inventorySaveBtn');
    if (!manageBtn || !modal) return;

    manageBtn.addEventListener('click', function (e) {
        e.preventDefault();
        renderInventoryManagerList();
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    });

    closeBtns.forEach(function (btn) {
        btn.addEventListener('click', closeInventoryModal);
    });

    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const inputs = modal.querySelectorAll('input[data-product]');
            const inventory = getInventoryMap();
            inputs.forEach(function (input) {
                const id = parseInt(input.getAttribute('data-product'), 10);
                const qty = Math.max(0, parseInt(input.value, 10) || 0);
                inventory[id] = qty;
            });
            saveInventoryMap(inventory);
            const data = collectDashboardData();
            renderInventory(data);
            renderTopProducts(data);
            closeInventoryModal();
        });
    }

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeInventoryModal();
    });
}

function renderInventoryManagerList() {
    const container = document.getElementById('inventoryManageList');
    if (!container) return;
    clearElement(container);
    const inventory = buildInventorySnapshot();
    inventory.forEach(function (item) {
        const row = document.createElement('div');
        row.className = 'inventory-manage-row';
        const info = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = item.name;
        const category = document.createElement('p');
        category.className = 'muted';
        category.textContent = formatCategory(item.category);
        info.appendChild(title);
        info.appendChild(category);
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = item.stock;
        input.setAttribute('data-product', item.id);
        row.appendChild(info);
        row.appendChild(input);
        container.appendChild(row);
    });
}

function closeInventoryModal() {
    const modal = document.getElementById('inventoryModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}


const user = getAuthenticatedUser();
if (!user || user.role !== 'admin') {
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function () {
    logout();
});

const navLinks = document.querySelectorAll('.dash-nav a');
const shell = document.querySelector('.dashboard-shell');
const toggleBtn = document.getElementById('sidebarToggle');

navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');
        }
        if (window.innerWidth <= 900 && shell) {
            shell.classList.remove('sidebar-open');
        }
    });
});

if (toggleBtn && shell) {
    toggleBtn.addEventListener('click', function () {
        shell.classList.toggle('sidebar-open');
    });
}

window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && shell) {
        shell.classList.remove('sidebar-open');
    }
});