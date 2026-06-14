import { onAuthChange, logoutUser, getUserData } from './auth-service.js';
import { initChatbot } from './chatbot.js';
import { getCartItems, getCartCount, getCartTotal, removeFromCart, updateQuantity, clearCart } from './cart-service.js';

/**
 * Injects and manages the Navbar
 */
export function initNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Auto-initialize chatbot on all pages with navbar
    initChatbot();

    onAuthChange(async (user) => {
        let userData = null;
        if (user) {
            userData = await getUserData(user.uid);
        }

        renderNavbar(container, user, userData);
    });
}

function renderNavbar(container, user, userData) {
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html');
    const isRegisterPage = path.includes('register.html');
    const isAdmin = userData && userData.role === 'admin';
    const isHome = path === '/' || path.endsWith('index.html');
    const isMenu = path.endsWith('products.html');
    const isDashboard = path.endsWith('dashboard.html');
    const isAdminPage = path.endsWith('admin.html');

    container.innerHTML = `
        <nav id="navbar" class="fixed top-0 inset-x-0 z-[1000] transition-all duration-300 border-b border-transparent">
            <div class="w-full max-w-screen-2xl mx-auto flex items-center justify-between px-6 lg:px-12 py-6 transition-all duration-300" id="navbar-inner">
                <!-- Logo -->
                <a href="index.html" class="flex items-center gap-3">
                    <img src="/images/logo.png" alt="Logo" class="w-10 h-10 object-contain">
                    <span class="font-headline text-2xl font-bold text-on-surface tracking-tighter">
                        Chav Mayechi
                    </span>
                </a>

                <!-- Desktop Links -->
                <div class="hidden lg:flex items-center gap-12">
                    <a href="index.html#home" class="${isHome ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface/70 hover:text-primary transition-colors'} font-headline text-lg leading-tight tracking-tight">Home</a>
                    <a href="index.html#about" class="text-on-surface/70 hover:text-primary transition-colors font-headline text-lg leading-tight tracking-tight">Our Story</a>
                    <a href="products.html" class="${isMenu ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface/70 hover:text-primary transition-colors'} font-headline text-lg leading-tight tracking-tight">Menu</a>
                    ${user ? `
                        <a href="dashboard.html" class="${isDashboard ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface/70 hover:text-primary transition-colors'} font-headline text-lg leading-tight tracking-tight">Dashboard</a>
                        ${isAdmin ? `<a href="admin.html" class="${isAdminPage ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface/70 hover:text-primary transition-colors'} font-headline text-lg leading-tight tracking-tight">Admin</a>` : ''}
                        <button id="nav-logout" class="text-secondary hover:text-primary font-headline text-lg leading-tight transition-colors">Logout</button>
                    ` : `
                        <a href="login.html" class="text-on-surface/70 hover:text-primary transition-colors font-headline text-lg leading-tight tracking-tight">Login</a>
                    `}
                </div>

                <div class="hidden lg:flex items-center gap-4">
                    ${!user ? `
                        <a href="register.html" class="bg-primary text-on-primary px-8 py-3 rounded-none font-medium hover:bg-on-surface transition-colors duration-300 active:scale-95 uppercase tracking-widest text-xs">Register</a>
                    ` : ''}
                    <button id="cart-toggle" class="relative text-on-surface hover:text-primary transition-colors p-2">
                        <span class="material-symbols-outlined text-2xl">shopping_bag</span>
                        <span id="cart-badge" class="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 scale-0">0</span>
                    </button>
                    <a href="order.html" class="bg-on-surface text-surface px-8 py-3 rounded-none font-medium hover:opacity-80 transition-opacity duration-300 active:scale-95 uppercase tracking-widest text-xs">
                        Order Now
                    </a>
                </div>

                <!-- Mobile: Cart + Toggle -->
                <div class="lg:hidden flex items-center gap-2">
                    <button id="cart-toggle-mobile" class="relative text-on-surface hover:text-primary transition-colors p-2">
                        <span class="material-symbols-outlined text-2xl">shopping_bag</span>
                        <span id="cart-badge-mobile" class="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 scale-0">0</span>
                    </button>
                    <button id="mobile-toggle" class="text-on-surface flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                        <span id="mobile-toggle-icon" class="material-symbols-outlined text-3xl font-light">menu</span>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden absolute top-full inset-x-0 bg-surface/95 backdrop-blur-xl border-t border-outline/20 py-8 px-6 flex flex-col gap-6 items-center text-center">
                 <a href="index.html#home" class="font-headline text-xl ${isHome ? 'text-primary font-bold' : 'text-on-surface'}">Home</a>
                 <a href="index.html#about" class="font-headline text-xl text-on-surface">Our Story</a>
                 <a href="products.html" class="font-headline text-xl ${isMenu ? 'text-primary font-bold' : 'text-on-surface'}">Menu</a>
                 ${user ? `
                    <a href="dashboard.html" class="font-headline text-xl ${isDashboard ? 'text-primary font-bold' : 'text-on-surface'}">Dashboard</a>
                    ${isAdmin ? `<a href="admin.html" class="font-headline text-xl ${isAdminPage ? 'text-primary font-bold' : 'text-on-surface'}">Admin</a>` : ''}
                    <button id="nav-logout-mobile" class="font-headline text-secondary hover:text-primary font-bold text-xl">Logout</button>
                 ` : `
                    <a href="login.html" class="font-headline text-xl text-on-surface">Login</a>
                    <a href="register.html" class="bg-primary text-on-primary w-full max-w-[200px] text-center px-4 py-3 text-xs uppercase tracking-widest">Register</a>
                 `}
                 <a href="order.html" class="bg-on-surface text-surface w-full max-w-[200px] text-center px-4 py-3 text-xs uppercase tracking-widest">Order Now</a>
            </div>
        </nav>

        <!-- Cart Drawer Overlay -->
        <div id="cart-overlay" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1001] opacity-0 pointer-events-none transition-opacity duration-300"></div>

        <!-- Cart Drawer -->
        <div id="cart-drawer" class="fixed top-0 right-0 h-full w-[90vw] max-w-md bg-surface z-[1002] translate-x-full transition-transform duration-300 ease-out flex flex-col shadow-2xl">
            <!-- Drawer Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-outline/30">
                <h2 class="font-headline text-xl font-bold text-on-surface">Your Cart</h2>
                <button id="cart-close" class="text-on-surface-variant hover:text-on-surface transition-colors p-1">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Drawer Body -->
            <div id="cart-items" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <!-- Populated dynamically -->
            </div>

            <!-- Drawer Footer -->
            <div id="cart-footer" class="hidden border-t border-outline/30 px-6 py-5 space-y-4">
                <div class="flex justify-between items-center">
                    <span class="font-label text-sm uppercase tracking-widest text-on-surface-variant">Total</span>
                    <span id="cart-total" class="font-headline text-2xl font-bold text-primary">₹0</span>
                </div>
                <a href="order.html" id="cart-checkout-btn" class="block w-full bg-on-surface text-surface text-center px-6 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Proceed to Checkout
                </a>
                <button id="cart-clear" class="w-full text-center text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors py-2">
                    Clear Cart
                </button>
            </div>
        </div>
    `;

    // Initialize Icons
    if (window.lucide) lucide.createIcons();

    // Scroll Logic for Navbar
    const nav = document.getElementById('navbar');
    const navInner = document.getElementById('navbar-inner');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-surface/90', 'backdrop-blur-xl', 'border-outline/20', 'shadow-md');
            navInner.classList.remove('py-6');
            navInner.classList.add('py-4');
        } else {
            nav.classList.remove('bg-surface/90', 'backdrop-blur-xl', 'border-outline/20', 'shadow-md');
            navInner.classList.add('py-6');
            navInner.classList.remove('py-4');
        }
    };
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Mobile Toggle Logic
    const toggle = document.getElementById('mobile-toggle');
    const toggleIcon = document.getElementById('mobile-toggle-icon');
    const menu = document.getElementById('mobile-menu');
    
    toggle?.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        if (toggleIcon) {
            toggleIcon.textContent = menu.classList.contains('hidden') ? 'menu' : 'close';
        }
    });

    // Close mobile menu on link click
    menu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            if (toggleIcon) toggleIcon.textContent = 'menu';
        });
    });

    // Logout Logic
    const logoutBtn = document.getElementById('nav-logout');
    const logoutBtnMobile = document.getElementById('nav-logout-mobile');
    const handleLogout = async () => {
        const res = await logoutUser();
        if (res.success) window.location.href = 'index.html';
    };
    logoutBtn?.addEventListener('click', handleLogout);
    logoutBtnMobile?.addEventListener('click', handleLogout);

    // ── Cart Drawer Logic ──────────────────────────────────────
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartClear = document.getElementById('cart-clear');

    function openCart() {
        cartDrawer.classList.remove('translate-x-full');
        cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
        cartOverlay.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';
        renderCartItems();
    }

    function closeCart() {
        cartDrawer.classList.add('translate-x-full');
        cartOverlay.classList.add('opacity-0', 'pointer-events-none');
        cartOverlay.classList.remove('opacity-100');
        document.body.style.overflow = '';
    }

    document.getElementById('cart-toggle')?.addEventListener('click', openCart);
    document.getElementById('cart-toggle-mobile')?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    cartClear?.addEventListener('click', () => {
        clearCart();
        renderCartItems();
    });

    // Render cart items inside the drawer
    function renderCartItems() {
        const itemsContainer = document.getElementById('cart-items');
        const footer = document.getElementById('cart-footer');
        const totalEl = document.getElementById('cart-total');
        const items = getCartItems();

        if (items.length === 0) {
            footer.classList.add('hidden');
            itemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center py-16">
                    <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">shopping_bag</span>
                    <p class="font-headline text-lg text-on-surface mb-2">Your cart is empty</p>
                    <p class="text-sm text-on-surface-variant mb-6">Add some delicious items to get started!</p>
                    <a href="products.html" class="bg-primary text-on-primary px-8 py-3 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                        Browse Menu
                    </a>
                </div>
            `;
            return;
        }

        footer.classList.remove('hidden');
        totalEl.textContent = '₹' + getCartTotal().toLocaleString('en-IN');

        itemsContainer.innerHTML = items.map(item => `
            <div class="flex gap-4 items-center py-3 border-b border-outline/15 last:border-0" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded bg-surface-container-high" onerror="this.src='/images/placeholder.svg'">
                <div class="flex-1 min-w-0">
                    <p class="font-headline text-sm font-bold text-on-surface truncate">${item.name}</p>
                    <p class="text-xs text-primary font-semibold">${item.price} <span class="text-on-surface-variant font-normal">${item.unit}</span></p>
                    <div class="flex items-center gap-3 mt-2">
                        <button class="cart-qty-btn w-7 h-7 flex items-center justify-center border border-outline/30 text-on-surface hover:bg-surface-container-high transition-colors text-sm" data-action="decrease" data-id="${item.id}">−</button>
                        <span class="text-sm font-bold w-6 text-center">${item.quantity}</span>
                        <button class="cart-qty-btn w-7 h-7 flex items-center justify-center border border-outline/30 text-on-surface hover:bg-surface-container-high transition-colors text-sm" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="text-right flex flex-col items-end gap-1">
                    <span class="font-bold text-sm text-on-surface">₹${(item.priceNum * item.quantity).toLocaleString('en-IN')}</span>
                    <button class="cart-remove-btn text-on-surface-variant hover:text-primary transition-colors" data-id="${item.id}">
                        <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Wire quantity buttons
        itemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = items.find(i => i.id === id);
                if (!item) return;
                if (btn.dataset.action === 'increase') {
                    updateQuantity(id, item.quantity + 1);
                } else {
                    updateQuantity(id, item.quantity - 1);
                }
                renderCartItems();
            });
        });

        // Wire remove buttons
        itemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.dataset.id);
                renderCartItems();
            });
        });
    }

    // Update badge counts
    function updateCartBadges() {
        const count = getCartCount();
        ['cart-badge', 'cart-badge-mobile'].forEach(id => {
            const badge = document.getElementById(id);
            if (badge) {
                badge.textContent = count;
                if (count > 0) {
                    badge.classList.remove('scale-0');
                    badge.classList.add('scale-100');
                } else {
                    badge.classList.add('scale-0');
                    badge.classList.remove('scale-100');
                }
            }
        });
    }

    // Listen for cart changes from anywhere
    window.addEventListener('cart-updated', () => {
        updateCartBadges();
    });

    // Initialize badge on load
    updateCartBadges();
}

/**
 * Toast notification (vanilla implementation)
 */
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 left-1/2 -translate-x-1/2 z-[10001] w-[90vw] max-w-sm px-6 py-4 rounded-none shadow-2xl transition-all duration-300 opacity-0 translate-y-[-20px] flex items-center gap-3 font-semibold text-sm tracking-wide ${
        type === 'success' ? 'bg-on-surface text-surface' : 'bg-primary text-white'
    }`;
    
    // We can just omit icon or use a generic symbol text if we wanted, let's keep it clean
    toast.innerHTML = `<span>${message}</span>`;
    
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-[-20px]');
        toast.classList.add('opacity-100', 'translate-y-0');
    });

    // Remove after 3s
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-20px]');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Injects a unified, premium footer into the page
 */
export function initFooter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <footer class="w-full bg-[#1c1b1b] text-[#fbf9f4] relative overflow-hidden">
            <!-- Decorative top border -->
            <div class="h-[2px] w-full bg-gradient-to-r from-transparent via-[#98462f] to-transparent"></div>

            <!-- Main Footer Content -->
            <div class="max-w-screen-2xl mx-auto px-6 sm:px-8 md:px-12 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
                <!-- Top: Brand + Newsletter CTA -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-14 md:mb-20 pb-10 md:pb-14 border-b border-white/10">
                    <div>
                        <a href="index.html" class="flex items-center gap-3 mb-4">
                            <img src="/images/logo.png" alt="Chav Mayechi Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain brightness-200">
                            <span class="font-headline text-2xl sm:text-3xl tracking-tighter text-[#fbf9f4]">Chav Mayechi</span>
                        </a>
                        <p class="text-white/50 text-sm font-light max-w-sm leading-relaxed">
                            Handcrafted Maharashtrian delicacies made with heritage recipes, pure ingredients, and a mother's love.
                        </p>
                    </div>
                    <a href="https://wa.me/918208519403?text=Hi!%20I%20want%20to%20place%20an%20order%20from%20Chav%20Mayechi!" target="_blank" rel="noopener noreferrer"
                       class="group flex items-center gap-3 bg-[#98462f] hover:bg-[#b5593b] text-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.15em] font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#98462f]/20">
                        <svg class="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.12 1.519 5.857L.055 23.456l5.733-1.505A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.813c-1.98 0-3.855-.53-5.508-1.468l-.394-.234-4.091 1.073 1.092-3.99-.256-.407A9.765 9.765 0 012.188 12c0-5.414 4.398-9.813 9.812-9.813S21.813 6.586 21.813 12s-4.399 9.813-9.813 9.813z"/></svg>
                        Order on WhatsApp
                        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </a>
                </div>

                <!-- Middle: 4-Column Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-14 md:mb-20">
                    <div class="space-y-5">
                        <h4 class="text-[#fbf9f4] font-bold text-[11px] uppercase tracking-[0.25em] font-label">Navigate</h4>
                        <ul class="space-y-3 text-sm text-white/50 font-light">
                            <li><a href="index.html" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>Home</a></li>
                            <li><a href="products.html" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>Menu</a></li>
                            <li><a href="order.html" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>Order Now</a></li>
                            <li><a href="index.html#about" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>Our Story</a></li>
                        </ul>
                    </div>
                    <div class="space-y-5">
                        <h4 class="text-[#fbf9f4] font-bold text-[11px] uppercase tracking-[0.25em] font-label">Contact</h4>
                        <ul class="space-y-3 text-sm text-white/50 font-light">
                            <li class="flex items-center gap-2"><span class="material-symbols-outlined text-[#98462f] text-base">call</span><a href="tel:+918208519403" class="hover:text-[#ffceb8] transition-colors">+91 82085 19403</a></li>
                            <li class="flex items-center gap-2"><span class="material-symbols-outlined text-[#98462f] text-base">mail</span><a href="mailto:chavmayechifoods@gmail.com" class="hover:text-[#ffceb8] transition-colors">chavmayechifoods@gmail.com</a></li>
                            <li class="flex items-start gap-2"><span class="material-symbols-outlined text-[#98462f] text-base mt-0.5">location_on</span><span>Maharashtra, India</span></li>
                        </ul>
                    </div>
                    <div class="space-y-5">
                        <h4 class="text-[#fbf9f4] font-bold text-[11px] uppercase tracking-[0.25em] font-label">Follow Us</h4>
                        <ul class="space-y-3 text-sm text-white/50 font-light">
                            <li><a href="https://www.instagram.com/chavmaychi_foods?igsh=MXNmYXk0NTFhdnVibg==" target="_blank" rel="noopener noreferrer" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>Instagram</a></li>
                            <li><a href="https://www.youtube.com/@Chavmayechifoods" target="_blank" rel="noopener noreferrer" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>YouTube</a></li>
                        </ul>
                    </div>
                    <div class="space-y-5">
                        <h4 class="text-[#fbf9f4] font-bold text-[11px] uppercase tracking-[0.25em] font-label">Our Promise</h4>
                        <ul class="space-y-3 text-sm text-white/50 font-light">
                            <li class="flex items-center gap-2"><span class="material-symbols-outlined text-[#98462f] text-base">verified</span>100% Authentic</li>
                            <li class="flex items-center gap-2"><span class="material-symbols-outlined text-[#98462f] text-base">eco</span>Organic Sourced</li>
                            <li class="flex items-center gap-2"><span class="material-symbols-outlined text-[#98462f] text-base">favorite</span>Made with Love</li>
                            <li class="flex items-center gap-2"><span class="material-symbols-outlined text-[#98462f] text-base">local_shipping</span>Fresh Delivery</li>
                        </ul>
                    </div>
                </div>

                <div class="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                    <div class="text-[10px] tracking-[0.3em] uppercase text-white/30 font-label flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                        <span>© ${new Date().getFullYear()} Chav Mayechi</span>
                        <span class="px-2 py-1 border border-white/20 rounded-sm font-bold tracking-widest flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#98462f]"></span> FSSAI: 21521118000524
                        </span>
                    </div>
                    <div class="flex gap-6 text-[10px] tracking-[0.2em] uppercase text-white/30 font-label">
                        <a href="policies.html#privacy" class="hover:text-white/60 transition-colors">Privacy</a>
                        <a href="policies.html#terms" class="hover:text-white/60 transition-colors">Terms</a>
                        <a href="policies.html#shipping" class="hover:text-white/60 transition-colors">Shipping</a>
                    </div>
                </div>
            </div>

            <!-- Decorative radial glow -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#98462f]/5 rounded-full blur-[120px] pointer-events-none"></div>
        </footer>
    `;
}
