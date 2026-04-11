import { onAuthChange, logoutUser, getUserData } from './auth-service.js';

/**
 * Injects and manages the Navbar
 */
export function initNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    onAuthChange(async (user) => {
        let userData = null;
        if (user) {
            userData = await getUserData(user.uid);
        }

        renderNavbar(container, user, userData);
    });
}

function renderNavbar(container, user, userData) {
    const isLoginPage = window.location.pathname.includes('login.html');
    const isRegisterPage = window.location.pathname.includes('register.html');
    const isAdmin = userData && userData.role === 'admin';

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
                    <a href="index.html#home" class="text-primary font-semibold border-b-2 border-primary pb-1 font-headline text-lg leading-tight tracking-tight">Home</a>
                    <a href="index.html#about" class="text-on-surface/70 hover:text-primary transition-colors font-headline text-lg leading-tight tracking-tight">Our Story</a>
                    <a href="products.html" class="text-on-surface/70 hover:text-primary transition-colors font-headline text-lg leading-tight tracking-tight">Menu</a>
                    ${user ? `
                        <a href="dashboard.html" class="text-on-surface/70 hover:text-primary transition-colors font-headline text-lg leading-tight tracking-tight">Dashboard</a>
                        ${isAdmin ? `<a href="admin.html" class="text-on-surface/70 hover:text-primary transition-colors font-headline text-lg leading-tight tracking-tight">Admin</a>` : ''}
                        <button id="nav-logout" class="text-secondary hover:text-primary font-headline text-lg leading-tight transition-colors">Logout</button>
                    ` : `
                        <a href="login.html" class="text-on-surface/70 hover:text-primary transition-colors font-headline text-lg leading-tight tracking-tight">Login</a>
                    `}
                </div>

                <div class="hidden lg:flex items-center gap-4">
                    ${!user ? `
                        <a href="register.html" class="bg-primary text-on-primary px-8 py-3 rounded-none font-medium hover:bg-on-surface transition-colors duration-300 active:scale-95 uppercase tracking-widest text-xs">Register</a>
                    ` : ''}
                    <a href="order.html" class="bg-on-surface text-surface px-8 py-3 rounded-none font-medium hover:opacity-80 transition-opacity duration-300 active:scale-95 uppercase tracking-widest text-xs">
                        Order Now
                    </a>
                </div>

                <!-- Mobile Toggle -->
                <button id="mobile-toggle" class="lg:hidden text-on-surface flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                    <span id="mobile-toggle-icon" class="material-symbols-outlined text-3xl font-light">menu</span>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden absolute top-full inset-x-0 bg-surface/95 backdrop-blur-xl border-t border-outline/20 py-8 px-6 flex flex-col gap-6 items-center text-center">
                 <a href="index.html#home" class="font-headline text-xl text-on-surface">Home</a>
                 <a href="index.html#about" class="font-headline text-xl text-on-surface">Our Story</a>
                 <a href="products.html" class="font-headline text-xl text-on-surface">Menu</a>
                 ${user ? `
                    <a href="dashboard.html" class="font-headline text-xl text-on-surface">Dashboard</a>
                    ${isAdmin ? `<a href="admin.html" class="font-headline text-xl text-on-surface">Admin</a>` : ''}
                    <button id="nav-logout-mobile" class="font-headline text-primary font-bold text-xl">Logout</button>
                 ` : `
                    <a href="login.html" class="font-headline text-xl text-on-surface">Login</a>
                    <a href="register.html" class="bg-primary text-on-primary w-full max-w-[200px] text-center px-4 py-3 text-xs uppercase tracking-widest">Register</a>
                 `}
                 <a href="order.html" class="bg-on-surface text-surface w-full max-w-[200px] text-center px-4 py-3 text-xs uppercase tracking-widest">Order Now</a>
            </div>
        </nav>
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
