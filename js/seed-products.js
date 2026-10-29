import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const PRODUCTS = [
    {
        name: "Methi Laddu",
        description: "मेथीचे लाडू — Made with fenugreek, jaggery & pure ghee. Great for health and taste.",
        price: "₹700",
        unit: "/kg",
        category: "Laddu",
        image: "/images/Methi_laddu.webp",
        badge: "Bestseller",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Nachani Laddu",
        description: "नाचणीचे लाडू — Packed with iron and calcium. A nutritious traditional delight.",
        price: "₹600",
        unit: "/kg",
        category: "Laddu",
        image: "/images/Nachani_laddu.webp",
        badge: "Healthy",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Dryfruit Laddu",
        description: "ड्रायफ्रूट लाडू — Loaded with almonds, cashews, dates & pistachios. Pure indulgence.",
        price: "₹1200",
        unit: "/kg",
        category: "Laddu",
        image: "/images/Dryfruit.webp",
        badge: "Premium",
        badgeColor: "bg-amber-700 text-white"
    },
    {
        name: "Khajur Laddu",
        description: "खजूराचे लाडू — Naturally sweetened with dates. Healthy, sugar-free & delicious.",
        price: "₹500",
        unit: "/kg",
        category: "Laddu",
        image: "/images/Khajur.webp",
        badge: "No Sugar",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Besan Laddu",
        description: "बेसनाचे लाडू — The timeless classic made with roasted gram flour, ghee & cardamom.",
        price: "₹500",
        unit: "/kg",
        category: "Laddu",
        image: "/images/Besan.webp",
        badge: "Classic",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Rava Laddu",
        description: "रव्याचे लाडू — Crispy, melt-in-mouth treats made with semolina and coconut.",
        price: "₹600",
        unit: "/kg",
        category: "Laddu",
        image: "/images/Rava.webp",
        badge: "Popular",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Kothimbir Papad",
        description: "कोथिंबीर पापड — Unique, crispy papads with the fresh flavor of coriander.",
        price: "₹400",
        unit: "/kg",
        category: "Papad",
        image: "/images/Kothimbir.webp",
        badge: "Snack",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Palak Papad",
        description: "पालक पापड — Healthy and crispy spinach flavored papads.",
        price: "₹400",
        unit: "/kg",
        category: "Papad",
        image: "/images/Palak.webp",
        badge: "Fresh",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Masala Papad",
        description: "मसाला पापड — Crunchy and spicy papads flavored with authentic homemade masala.",
        price: "₹400",
        unit: "/kg",
        category: "Papad",
        image: "/images/Masala.webp",
        badge: "New",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Udit Papad",
        description: "उडदाचे पापड — Crispy, authentic urad dal papads made with traditional spices.",
        price: "₹450",
        unit: "/kg",
        category: "Papad",
        image: "/images/Udit.webp",
        badge: "Special",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Nachani Pith",
        description: "नाचणी पीठ — Ragi (Finger Millet) flour with a distinct earthy brown colour. A gluten-free, calcium-rich nutritional powerhouse.",
        price: "₹150",
        unit: "/kg",
        category: "Flours",
        image: "/images/Nachani_pith.webp",
        badge: "Gluten Free",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Modak Pith",
        description: "मोदक पीठ — Specially milled, fine rice flour for the soft, delicate shell of Ukadiche Modak, the traditional Maharashtrian steamed sweet dumpling.",
        price: "₹120",
        unit: "/kg",
        category: "Flours",
        image: "/images/Modak_pith.webp",
        badge: "Festival Special",
        badgeColor: "bg-amber-700 text-white"
    },
    {
        name: "Jowar Kurmura",
        description: "ज्वारी कुरमुरा — Puffed sorghum (jowar) that is light, crunchy, and naturally gluten-free. A wholesome traditional snack.",
        price: "₹70",
        unit: "/pack",
        category: "Kurmure",
        image: "/images/Jowar_kurmura.webp",
        badge: "Crunchy",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Nachani Kurmura",
        description: "नाचणी कुरमुरे — Puffed ragi (finger millet) with a light, airy crunch. A calcium-rich, gluten-free snack alternative.",
        price: "₹70",
        unit: "/pack",
        category: "Kurmure",
        image: "/images/Nachani_kurmura.webp",
        badge: "Superfood",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Roasted Bajra",
        description: "भाजलेले बाजरी — Dry-roasted pearl millet with an earthy, toasted taste. Rich in iron, magnesium, and dietary fiber.",
        price: "₹80",
        unit: "/pack",
        category: "Kurmure",
        image: "/images/Roasted_bajra.webp",
        badge: "Nutritious",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Roasted Jowar",
        description: "भाजलेली ज्वारी — Slow-roasted sorghum grains with a deep, nutty flavor. High in fiber and perfect as a healthy snack.",
        price: "₹80",
        unit: "/pack",
        category: "Kurmure",
        image: "/images/Roasted_jowar.webp",
        badge: "Roasted",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Bhajka Poha",
        description: "भाजका पोहा — Roasted flattened rice with a crispy, toasted texture. Great for chivda, trail mixes, and instant snacking.",
        price: "₹100",
        unit: "/kg",
        category: "Kurmure",
        image: "/images/Bhajka_poha.webp",
        badge: "Roasted",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "White Poha",
        description: "पांढरे पोहे — Classic flattened rice, light and fluffy. Perfect for batata poha, chivda, and quick breakfast preparations.",
        price: "₹100",
        unit: "/kg",
        category: "Kurmure",
        image: "/images/Poha.webp",
        badge: "Staple",
        badgeColor: "bg-primary text-on-primary"
    },
    {
        name: "Red Poha",
        description: "लाल पोहे — Traditional red rice flattened flakes with higher iron and fiber content. Authentic Konkan-style nutritious poha.",
        price: "₹150",
        unit: "/kg",
        category: "Kurmure",
        image: "/images/red_poha.webp",
        badge: "Healthy",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Kadve Vaal",
        description: "कडवे वाल — Butter beans rich in protein, fiber, vitamins & minerals. A nutritious plant-based protein source for vegetarians.",
        price: "₹500",
        unit: "/kg",
        category: "Pulses",
        image: "/images/Vaal.webp",
        badge: "Protein Rich",
        badgeColor: "bg-green-700 text-white"
    },
    {
        name: "Gavran Mataki",
        description: "गवरान मटकी — Native, unpolished, small-sized moth beans. A staple in traditional Maharashtrian cuisine for usal and misal.",
        price: "₹400",
        unit: "/kg",
        category: "Pulses",
        image: "/images/Mataki.webp",
        badge: "Gavthi",
        badgeColor: "bg-amber-700 text-white"
    },
    {
        name: "Kombadi Vade",
        description: "कोंबडी वडे पीठ — Special multigrain flour blend for authentic, fluffy Konkan Kombadi Vade.",
        price: "₹200",
        unit: "/kg",
        category: "Flours",
        image: "/images/placeholder.svg",
        badge: "Konkan Special",
        badgeColor: "bg-amber-700 text-white"
    }
];

const statusDiv = document.getElementById('status');
const seedBtn = document.getElementById('seed-btn');

function log(message, type = 'info') {
    if (!statusDiv) return;
    statusDiv.classList.remove('hidden');
    const colors = {
        info: 'text-secondary',
        success: 'text-green-700',
        error: 'text-red-600',
        warn: 'text-amber-600'
    };
    statusDiv.innerHTML += `<p class="text-sm ${colors[type] || 'text-secondary'}"><span class="material-symbols-outlined text-sm align-middle mr-1">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : type === 'warn' ? 'warning' : 'info'}</span>${message}</p>`;
    statusDiv.scrollTop = statusDiv.scrollHeight;
}

window.seedProducts = async function() {
    if (!seedBtn) return;
    seedBtn.disabled = true;
    seedBtn.innerHTML = '<span class="animate-spin material-symbols-outlined">sync</span> Syncing...';

    try {
        // Check auth
        const user = auth.currentUser;
        if (!user) {
            log('Not logged in! Please log in as admin first.', 'error');
            seedBtn.disabled = false;
            seedBtn.innerHTML = '<span class="material-symbols-outlined">database</span> Seed / Sync All Products';
            return;
        }

        log(`Authenticated as ${user.email}`, 'info');

        // Get existing products to update or add missing
        const existingSnap = await getDocs(collection(db, 'products'));
        const existingMap = new Map();
        existingSnap.docs.forEach(d => {
            const data = d.data();
            if (data.name) existingMap.set(data.name, { docId: d.id, ...data });
        });

        log(`Found ${existingMap.size} existing products in Firestore`, 'info');

        let added = 0;
        let updated = 0;
        let unchanged = 0;

        const findExisting = (pName) => {
            if (existingMap.has(pName)) return existingMap.get(pName);
            for (const [key, val] of existingMap.entries()) {
                if (key.toLowerCase().trim() === pName.toLowerCase().trim()) return val;
                if (key.toLowerCase().includes("nachani kurmur") && pName.toLowerCase().includes("nachani kurmur")) return val;
            }
            return null;
        };

        for (const product of PRODUCTS) {
            const existing = findExisting(product.name);
            if (existing) {
                await updateDoc(doc(db, 'products', existing.docId), {
                    name: product.name,
                    price: product.price,
                    unit: product.unit,
                    description: product.description,
                    category: product.category,
                    badge: product.badge,
                    badgeColor: product.badgeColor,
                    ...(product.image ? { image: product.image } : {})
                });
                if (existing.price !== product.price || existing.unit !== product.unit) {
                    log(`✓ Updated "${existing.name}" price: ${existing.price} → ${product.price}`, 'success');
                    updated++;
                } else {
                    log(`• "${existing.name}" refreshed (${product.price} ${product.unit})`, 'info');
                    unchanged++;
                }
                continue;
            }

            await addDoc(collection(db, 'products'), {
                ...product,
                timestamp: serverTimestamp(),
                active: true
            });
            log(`+ Added "${product.name}" — ${product.price} ${product.unit}`, 'success');
            added++;
        }

        log(`\nSync complete! Added: ${added}, Updated: ${updated}, Refreshed: ${unchanged}.`, 'success');
        log('Visit the Products page to see them live →', 'success');

    } catch (err) {
        log(`Error: ${err.message}`, 'error');
        console.error(err);
    }

    if (seedBtn) {
        seedBtn.disabled = false;
        seedBtn.innerHTML = '<span class="material-symbols-outlined">database</span> Seed / Sync All Products';
    }
};

if (seedBtn) {
    seedBtn.addEventListener('click', window.seedProducts);
}

// Check auth on load
onAuthStateChanged(auth, (user) => {
    if (user) {
        log(`Logged in as: ${user.email}`, 'info');
    } else {
        log('Not logged in. Please <a href="login.html" class="text-primary underline">login as admin</a> first to sync to Firestore.', 'warn');
    }
});
