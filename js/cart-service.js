/**
 * Cart Service — localStorage-backed multi-item cart
 * Manages add/remove/update quantities with event dispatching
 */

const CART_KEY = 'chav_cart';

// ── Read / Write ───────────────────────────────────────────────
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdate(cart);
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Add a product to the cart (or increment quantity if it already exists)
 * @param {Object} product - { id, name, price, unit, image }
 * @param {number} quantity - amount to add (default 1)
 */
export function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,       // e.g. "₹250"
            priceNum: parsePrice(product.price),
            unit: product.unit || '',
            image: product.image || '',
            quantity
        });
    }

    saveCart(cart);
    return cart;
}

/**
 * Remove a product entirely from the cart
 */
export function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

/**
 * Set a specific quantity for a product
 */
export function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        saveCart(cart);
    }
    return cart;
}

/**
 * Get all items in the cart
 */
export function getCartItems() {
    return getCart();
}

/**
 * Get total number of items (sum of quantities)
 */
export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Get cart total in rupees (number)
 */
export function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
}

/**
 * Clear the entire cart
 */
export function clearCart() {
    localStorage.removeItem(CART_KEY);
    dispatchCartUpdate([]);
}

// ── Helpers ────────────────────────────────────────────────────

/**
 * Parse "₹250" or "₹1,200" into a number
 */
function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return Number(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
}

/**
 * Dispatch a custom event so the navbar badge and drawers can react
 */
function dispatchCartUpdate(cart) {
    window.dispatchEvent(new CustomEvent('cart-updated', {
        detail: {
            items: cart,
            count: cart.reduce((s, i) => s + i.quantity, 0),
            total: cart.reduce((s, i) => s + (i.priceNum * i.quantity), 0)
        }
    }));
}
