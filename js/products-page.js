import { initNavbar, initFooter, showToast } from './ui.js';
import { getAllProducts } from './products-service.js';
import { addToCart } from './cart-service.js';

// Initialize Shared Global Navbar & Footer
initNavbar('navbar-placeholder');
initFooter('footer-placeholder');

// Dynamic Product Injection via the 'Sweet Endings' Premium Layout Strategy
const productGrid = document.getElementById('product-grid');
let allProducts = [];
let currentCategory = 'all';
let searchQuery = '';

async function loadProducts() {
    if (!productGrid) return;

    // Show skeletons
    productGrid.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        productGrid.innerHTML += `
        <div class="animate-pulse flex flex-col">
            <div class="aspect-square bg-surface-container-high mb-3 sm:mb-6 border border-outline-variant/20 rounded-sm"></div>
            <div class="h-6 sm:h-8 bg-surface-container-high w-3/4 mb-2 rounded-sm"></div>
            <div class="h-4 bg-surface-container-high w-full mb-2 rounded-sm"></div>
            <div class="h-4 bg-surface-container-high w-5/6 mb-6 mt-auto rounded-sm"></div>
            <div class="mt-auto flex justify-between items-center bg-surface-container-low p-2 sm:p-4 rounded-sm border border-outline-variant/30">
                <div class="h-6 sm:h-8 bg-surface-container-high w-20 rounded-sm"></div>
                <div class="h-8 sm:h-10 bg-surface-container-high w-24 rounded-sm"></div>
            </div>
        </div>
        `;
    }

    allProducts = await getAllProducts();
    renderProducts();
}

function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    let filteredProducts = currentCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === currentCategory);

    if (searchQuery) {
        const term = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(term) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
    }

    if (filteredProducts && filteredProducts.length > 0) {
        filteredProducts.forEach((product, idx) => {
            const badgeHtml = product.badge ? `<span class="absolute top-2 left-2 sm:top-4 sm:left-4 ${product.badgeColor || 'bg-primary text-on-primary'} px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold shadow-lg z-10">${product.badge}</span>` : '';

            const card = document.createElement('div');
            card.className = "group opacity-0 translate-y-8 animate-fade-in";
            card.style.animationDelay = `${idx * 0.05}s`;

            card.innerHTML = `
                <div class="aspect-square overflow-hidden mb-3 sm:mb-6 relative bg-surface-container shadow-sm border border-outline-variant/20">
                    <a href="product.html?id=${product.id}" class="block w-full h-full">
                        <img src="${product.image}" loading="lazy" alt="${product.name}" class="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-all duration-1000">
                    </a>
                    ${badgeHtml}
                </div>
                <div class="text-left px-1 sm:px-2 flex-1 flex flex-col">
                    <a href="product.html?id=${product.id}" class="hover:text-primary transition-colors">
                        <h4 class="font-headline text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-on-surface hover:text-primary transition-colors">${product.name}</h4>
                    </a>
                    <p class="font-body text-xs sm:text-sm text-on-surface-variant mb-3 sm:mb-6 line-clamp-1 sm:line-clamp-2 leading-relaxed opacity-90">${product.description}</p>
                    <div class="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 bg-surface-container-low p-2 sm:p-4 rounded-sm border border-outline-variant/30">
                        <span class="font-label font-bold text-sm sm:text-lg text-primary">${product.price}<span class="text-[8px] sm:text-[10px] text-on-surface-variant font-normal ml-0.5 sm:ml-1">(${product.unit})</span></span>
                        <button class="add-to-cart-btn w-full sm:w-auto font-label text-[8px] sm:text-[10px] uppercase tracking-widest border border-primary text-primary px-4 sm:px-6 py-2 sm:py-2.5 hover:bg-primary hover:text-on-primary transition-colors font-bold flex items-center justify-center gap-1" data-product-id="${product.id}">
                            <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    } else {
        productGrid.innerHTML = '<div class="col-span-full text-center py-10 opacity-50">No products available in this category.</div>';
    }

    // Wire "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.productId;
            const product = filteredProducts.find(p => p.id === id);
            if (product) {
                addToCart(product);
                showToast(`${product.name} added to cart!`);
            }
        });
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Filter Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('border-primary', 'text-primary');
            b.classList.add('border-transparent', 'text-on-surface-variant');
        });
        e.target.classList.remove('border-transparent', 'text-on-surface-variant');
        e.target.classList.add('border-primary', 'text-primary');

        // Filter products
        currentCategory = e.target.dataset.category;
        renderProducts();
    });
});

// Search Logic
const searchInput = document.getElementById('product-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderProducts();
    });
}

loadProducts();
