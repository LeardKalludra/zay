function getActiveUser() {
    if (typeof getAuthenticatedUser === 'function') {
        return getAuthenticatedUser();
    }
    try {
        const localUser = localStorage.getItem('loggedInUser');
        if (localUser) return JSON.parse(localUser);
        const sessionUser = sessionStorage.getItem('loggedInUser');
        if (sessionUser) return JSON.parse(sessionUser);
    } catch (err) {
        return null;
    }
    return null;
}

function getCartStorageKey() {
    const user = getActiveUser();
    if (user && user.email) {
        return `cart_${encodeURIComponent(user.email)}`;
    }
    return 'cart_guest';
}

let cart = JSON.parse(localStorage.getItem(getCartStorageKey())) || [];

function clearElement(el) {
    if (!el) return;
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function getAvailableStock(productId) {
    const product = getProductById(productId);
    if (product && typeof product.stock === 'number') return product.stock;
    if (typeof getProductStock === 'function') return getProductStock(productId);
    return 0;
}

function syncCartFromStorage() {
    try {
        const storedCart = JSON.parse(localStorage.getItem(getCartStorageKey()));
        cart = Array.isArray(storedCart) ? storedCart : [];
    } catch (error) {
        cart = [];
    }
}

function updateCartCount() {
    syncCartFromStorage();
    let count = 0;
    for (let i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }
    document.querySelectorAll('.cart-count').forEach(function(el) {
        el.textContent = count;
    });
}


function addToCart(productId) {
    const user = getActiveUser();
    if (!user) {
        showNotification('Please log in to add items to your cart.');
        return;
    }

    syncCartFromStorage();
    const product = getProductById(productId);
    if (!product) return;
    const available = getAvailableStock(product.id);
    if (available <= 0) {
        showNotification('Sorry, this product is out of stock.');
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        const nextQty = existingItem.quantity + 1;
        if (nextQty > available) {
            existingItem.quantity = available;
            showNotification('Only ' + available + ' left in stock.');
        } else {
            existingItem.quantity = nextQty;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
    
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
    
    if (typeof window.updateFloatingCartOnChange === 'function') {
        window.updateFloatingCartOnChange();
    }
}

function removeFromCart(productId) {
    syncCartFromStorage();
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    showNotification('Product removed from cart!');
    
    if (typeof window.updateFloatingCartOnChange === 'function') {
        window.updateFloatingCartOnChange();
    }
}

function updateQuantity(productId, newQuantity) {
    syncCartFromStorage();
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            const available = getAvailableStock(productId);
            if (available <= 0) {
                removeFromCart(productId);
                showNotification('This item is no longer in stock.');
                return;
            }
            const desired = Math.max(1, parseInt(newQuantity, 10) || 0);
            item.quantity = Math.min(desired, available || 0);
            if (desired > available) {
                showNotification('Only ' + available + ' left in stock.');
            }
            saveCart();
            updateCartCount();
            renderCart();
            
            if (typeof window.updateFloatingCartOnChange === 'function') {
                window.updateFloatingCartOnChange();
            }
        }
    }
}

function getCartTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    return total;
}

function getStoredOrders() {
    try {
        return JSON.parse(localStorage.getItem('orders')) || [];
    } catch (error) {
        return [];
    }
}

function renderOrderHistory() {
    const body = document.getElementById('orderHistoryBody');
    if (!body) return;

    const user = getActiveUser();
    const email = user && user.email ? user.email : null;
    const orders = getStoredOrders().filter(o => {
        if (email) return o.owner === email;
        return !o.owner;
    });

    clearElement(body);
    if (!orders.length) {
        const empty = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'No orders yet.';
        td.style.textAlign = 'center';
        td.style.padding = '16px';
        empty.appendChild(td);
        body.appendChild(empty);
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        const id = document.createElement('td');
        id.textContent = order.id.replace('order_', '#');
        const date = document.createElement('td');
        const orderDate = order.date ? new Date(order.date) : new Date();
        date.textContent = orderDate.toLocaleDateString();
        const total = document.createElement('td');
        total.textContent = '$' + (order.total + 10 || 0).toFixed(2);
        const status = document.createElement('td');
        status.textContent = order.status || 'Pending';

        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(total);
        row.appendChild(status);
        body.appendChild(row);
    });
}

function recordOrder(status = 'Processing') {
    const user = getActiveUser();
    const orders = getStoredOrders();
    const order = {
        id: `order_${Date.now()}`,
        owner: user && user.email ? user.email : null,
        items: cart.slice(),
        total: getCartTotal(),
        date: Date.now(),
        status: status
    };
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    const statuses = JSON.parse(localStorage.getItem('orderStatuses') || '{}');
    statuses[order.id] = status;
    localStorage.setItem('orderStatuses', JSON.stringify(statuses));
}

function saveCart() {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(cart));
    localStorage.setItem(key + '_updated', Date.now().toString());
}

function renderCart() {
    syncCartFromStorage();
    const cartContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        clearElement(cartContainer);
        const emptyRow = document.createElement('tr');
        const emptyTd = document.createElement('td');
        emptyTd.colSpan = 5;
        emptyTd.style.textAlign = 'center';
        emptyTd.style.padding = '40px';

        const emptyMsg = document.createElement('p');
        emptyMsg.style.fontSize = '18px';
        emptyMsg.style.color = '#999';
        emptyMsg.textContent = 'Your cart is empty';

        const shopLink = document.createElement('a');
        shopLink.href = 'shop.html';
        shopLink.className = 'btn btn-primary';
        shopLink.style.marginTop = '20px';
        shopLink.style.display = 'inline-block';
        shopLink.textContent = 'Continue Shopping';

        emptyTd.appendChild(emptyMsg);
        emptyTd.appendChild(shopLink);
        emptyRow.appendChild(emptyTd);
        cartContainer.appendChild(emptyRow);
        
        if (cartSummary) {
            clearElement(cartSummary);
            cartSummary.appendChild(makeSummaryRow('Subtotal:', '$0.00'));
            cartSummary.appendChild(makeSummaryRow('Shipping:', '$0.00'));
            cartSummary.appendChild(makeSummaryRow('Total:', '$0.00', true));
        }
        return;
    }

    clearElement(cartContainer);
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const lineTotal = (item.price * item.quantity).toFixed(2);

        const row = document.createElement('tr');

        const itemTd = document.createElement('td');
        const itemDetails = document.createElement('div');
        itemDetails.className = 'cart-item-details';

        const itemImg = document.createElement('img');
        itemImg.src = item.image;
        itemImg.alt = item.name;
        itemImg.className = 'cart-item-image';
        itemImg.loading = 'lazy';

        const itemInfo = document.createElement('div');
        const itemName = document.createElement('p');
        itemName.className = 'cart-item-name';
        itemName.textContent = item.name;
        const itemMeta = document.createElement('span');
        itemMeta.className = 'cart-item-meta';
        itemMeta.textContent = 'Saved locally for a faster checkout.';

        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemMeta);
        itemDetails.appendChild(itemImg);
        itemDetails.appendChild(itemInfo);
        itemTd.appendChild(itemDetails);
        row.appendChild(itemTd);

        const priceTd = document.createElement('td');
        priceTd.textContent = '$' + item.price.toFixed(2);
        row.appendChild(priceTd);

        const qtyTd = document.createElement('td');
        const qtyControl = document.createElement('div');
        qtyControl.className = 'quantity-control';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'quantity-btn';
        minusBtn.textContent = '-';
        minusBtn.addEventListener('click', function() {
            updateQuantity(item.id, item.quantity - 1);
        });

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.className = 'quantity-input';
        qtyInput.value = item.quantity;
        qtyInput.min = 1;
        qtyInput.addEventListener('change', function() {
            updateQuantity(item.id, this.value);
        });

        const plusBtn = document.createElement('button');
        plusBtn.className = 'quantity-btn';
        plusBtn.textContent = '+';
        plusBtn.addEventListener('click', function() {
            updateQuantity(item.id, item.quantity + 1);
        });

        qtyControl.appendChild(minusBtn);
        qtyControl.appendChild(qtyInput);
        qtyControl.appendChild(plusBtn);
        qtyTd.appendChild(qtyControl);
        row.appendChild(qtyTd);

        const lineTd = document.createElement('td');
        lineTd.textContent = '$' + lineTotal;
        row.appendChild(lineTd);

        const removeTd = document.createElement('td');
        const removeSpan = document.createElement('span');
        removeSpan.className = 'remove-item';
        removeSpan.title = 'Remove';
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fas fa-trash';
        removeSpan.appendChild(trashIcon);
        removeSpan.addEventListener('click', function() {
            removeFromCart(item.id);
        });
        removeTd.appendChild(removeSpan);
        row.appendChild(removeTd);

        cartContainer.appendChild(row);
    }
    
    if (cartSummary) {
        const subtotal = getCartTotal();
        const shipping = subtotal > 0 ? 10.00 : 0;
        const total = subtotal + shipping;
        
        clearElement(cartSummary);
        cartSummary.appendChild(makeSummaryRow('Subtotal:', '$' + subtotal.toFixed(2)));
        cartSummary.appendChild(makeSummaryRow('Shipping:', '$' + shipping.toFixed(2)));
        cartSummary.appendChild(makeSummaryRow('Total:', '$' + total.toFixed(2), true));

        const checkoutBtn = document.createElement('button');
        checkoutBtn.className = 'btn btn-primary checkout-btn';
        checkoutBtn.textContent = 'Proceed to Checkout';
        checkoutBtn.addEventListener('click', checkout);
        cartSummary.appendChild(checkoutBtn);
    }
}

function makeSummaryRow(label, value, isTotal) {
    const row = document.createElement('div');
    row.className = 'summary-row' + (isTotal ? ' total' : '');

    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    const valueEl = document.createElement('span');
    valueEl.textContent = value;

    row.appendChild(labelEl);
    row.appendChild(valueEl);
    return row;
}

function checkout() {
    syncCartFromStorage();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    if (openCheckoutModal()) {
        return;
    }

    alert('Thank you for your purchase! This is a demo site. In a real application, you would be redirected to a payment gateway.');
    applyInventoryDeduction(cart);
    recordOrder('Processing');
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    renderOrderHistory();
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return false;
    
    const form = document.getElementById('checkoutForm');
    if (form) form.reset();
    
    const confirmation = document.getElementById('checkoutConfirmation');
    if (confirmation) {
        confirmation.style.display = 'none';
        confirmation.textContent = '';
    }
    
    const dueEl = document.getElementById('checkoutDue');
    if (dueEl) {
        dueEl.textContent = getCartTotal().toFixed(2);
    }
    
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    return true;
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function handleCheckoutSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('checkoutName');
    const emailInput = document.getElementById('checkoutEmail');
    const confirmation = document.getElementById('checkoutConfirmation');
    
    if (confirmation) {
        const name = nameInput?.value || 'friend';
        confirmation.textContent = `Thanks ${name}! A confirmation email is on its way to ${emailInput?.value}.`;
        confirmation.style.display = 'block';
    }

    applyInventoryDeduction(cart);
    recordOrder('Processing');
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    renderOrderHistory();
    
    setTimeout(() => {
        closeCheckoutModal();
    }, 1800);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCheckoutModal();
    }
});

document.addEventListener('click', (event) => {
    if (event.target.classList && event.target.classList.contains('checkout-modal')) {
        closeCheckoutModal();
    }
});

function applyInventoryDeduction(items) {
    if (!items || !items.length || typeof getInventoryMap !== 'function' || typeof saveInventoryMap !== 'function') return;
    const inventory = getInventoryMap();
    items.forEach(function(item) {
        const current = inventory[item.id] !== undefined ? inventory[item.id] : getAvailableStock(item.id);
        inventory[item.id] = Math.max(0, (current || 0) - item.quantity);
    });
    saveInventoryMap(inventory);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
            renderOrderHistory();
        }
        if (typeof updateFloatingCart === 'function') {
            updateFloatingCart();
        }
    });
} else {
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
        renderOrderHistory();
    }
    if (typeof updateFloatingCart === 'function') {
        updateFloatingCart();
    }
}

window.updateFloatingCartOnChange = function() {
    if (typeof updateFloatingCart === 'function') {
        setTimeout(updateFloatingCart, 100);
    }
};
