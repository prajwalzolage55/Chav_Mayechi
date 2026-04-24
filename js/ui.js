import { onAuthChange, logoutUser, getUserData } from './auth-service.js';
import { initChatbot } from './chatbot.js';

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
                            <li><a href="#" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>Instagram</a></li>
                            <li><a href="#" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>Facebook</a></li>
                            <li><a href="#" class="hover:text-[#ffceb8] transition-colors duration-300 flex items-center gap-2 group"><span class="w-0 group-hover:w-3 h-px bg-[#98462f] transition-all duration-300"></span>YouTube</a></li>
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

                <!-- Bottom Bar -->
                <div class="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                    <div class="text-[10px] tracking-[0.3em] uppercase text-white/30 font-label">
                        © ${new Date().getFullYear()} Chav Mayechi — The Digital Atelier of Homemade Heritage
                    </div>
                    <div class="flex gap-6 text-[10px] tracking-[0.2em] uppercase text-white/30 font-label">
                        <a href="#" class="hover:text-white/60 transition-colors">Privacy</a>
                        <a href="#" class="hover:text-white/60 transition-colors">Terms</a>
                        <a href="#" class="hover:text-white/60 transition-colors">Shipping</a>
                    </div>
                </div>
            </div>

            <!-- Decorative radial glow -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#98462f]/5 rounded-full blur-[120px] pointer-events-none"></div>
        </footer>
    `;
}
