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
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
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

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
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
            item.quantity = parseInt(newQuantity);
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
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function saveCart() {
    localStorage.setItem(getCartStorageKey(), JSON.stringify(cart));
}

function renderCart() {
    syncCartFromStorage();
    const cartContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <p style="font-size: 18px; color: #999;">Your cart is empty</p>
                    <a href="shop.html" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">Continue Shopping</a>
                </td>
            </tr>
        `;
        
        if (cartSummary) {
            cartSummary.innerHTML = `
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$0.00</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>$0.00</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>$0.00</span>
                </div>
            `;
        }
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => {
        const lineTotal = (item.price * item.quantity).toFixed(2);
        return `
        <tr>
            <td>
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
                    <div>
                        <p class="cart-item-name">${item.name}</p>
                        <span class="cart-item-meta">Saved locally for a faster checkout.</span>
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)" min="1">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>$${lineTotal}</td>
            <td>
                <span class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">
                    <i class="fas fa-trash"></i>
                </span>
            </td>
        </tr>
    `;
    }).join('');
    
    if (cartSummary) {
        const subtotal = getCartTotal();
        const shipping = subtotal > 0 ? 10.00 : 0;
        const total = subtotal + shipping;
        
        cartSummary.innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary checkout-btn" onclick="checkout()">Proceed to Checkout</button>
        `;
    }
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
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
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
    
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    
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
        }
        if (typeof updateFloatingCart === 'function') {
            updateFloatingCart();
        }
    });
} else {
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
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

