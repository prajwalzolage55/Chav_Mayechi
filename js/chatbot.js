/**
 * Chav Mayechi — AI Customer Support Chatbot
 * Powered by Gemini API
 */

// ── Configuration ──────────────────────────────────────────────
const GEMINI_API_KEY = 'AIzaSyCHrmSNFaCuAPrtUah2aJWrD7_oL6yd_Kw'; // Replace with your actual API key
const GEMINI_MODEL = 'gemini-flash-latest';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ── Product Knowledge Base (auto-synced) ──────────────────────
import { productsData } from './products-data.js';

function buildProductContext() {
    return productsData.map(p =>
        `• ${p.name} — ${p.price} ${p.unit} | ${p.description}`
    ).join('\n');
}

const SYSTEM_PROMPT = `You are "Chav", the friendly and helpful AI assistant for Chav Mayechi — a premium Maharashtrian homemade food brand.

## About Chav Mayechi
- We sell handcrafted Maharashtrian laddus, papads, flours, poha, kurmure, and roasted grains
- All products are made with traditional recipes, pure ingredients, and a mother's love
- We deliver across India
- For ordering, customers can use our website (order page) or WhatsApp: +91 82085 19403
- Email: chavmayechifoods@gmail.com

## Our Products & Pricing
${buildProductContext()}

## Your Behavior Guidelines
1. Be warm, friendly, and helpful — like talking to a caring family member
2. Answer questions about products, pricing, ingredients, ordering, and delivery
3. If asked about specific products, share the price and a brief description
4. For orders, guide customers to the Order page or WhatsApp
5. Keep responses SHORT and complete — maximum 3-4 sentences. ALWAYS finish your sentence completely, never cut off mid-word or mid-sentence
6. Use occasional Marathi words like "Dhanyavad" (thank you), "Namaskar" (hello) for warmth
7. If you don't know something, say so honestly and suggest contacting via WhatsApp
8. NEVER make up prices or products not in the list above
9. You can recommend products based on customer preferences
10. For bulk/catering orders, direct them to WhatsApp
11. CRITICAL: Always write complete, finished sentences. Never leave a response incomplete.

Respond in a conversational, warm tone. Use emojis sparingly but naturally.`;

// ── Chat State ─────────────────────────────────────────────────
let chatHistory = [];
let isOpen = false;
let isTyping = false;

// ── Gemini API Call ────────────────────────────────────────────
async function sendToGemini(userMessage) {
    chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

    const requestBody = {
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: chatHistory,
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API error:', errorData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that. Please try again!';

        chatHistory.push({ role: 'model', parts: [{ text: reply }] });
        return reply;
    } catch (error) {
        console.error('Chatbot error:', error);
        // Remove the failed user message from history
        chatHistory.pop();
        return "I'm having trouble connecting right now. Please try again in a moment, or reach out to us on WhatsApp at +91 82085 19403 🙏";
    }
}

// ── Format message text (markdown-lite) ────────────────────────
function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// ── UI Injection ───────────────────────────────────────────────
export function initChatbot() {
    // Don't init on admin page
    if (window.location.pathname.includes('admin.html')) return;

    const chatHTML = `
        <!-- Chat Toggle Button -->
        <button id="chatbot-toggle" aria-label="Open customer support chat"
            class="fixed bottom-24 right-5 sm:bottom-28 sm:right-7 z-[998] w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-500 hover:scale-110 active:scale-95"
            style="background: linear-gradient(135deg, #98462f 0%, #b5593b 100%); box-shadow: 0 8px 32px rgba(152,70,47,0.35);">
            <span id="chatbot-icon" class="material-symbols-outlined" style="font-size:26px; transition: transform 0.3s ease;">smart_toy</span>
            <!-- Pulse ring -->
            <span id="chatbot-pulse" class="absolute inset-0 rounded-full animate-ping opacity-20" style="background: #98462f;"></span>
        </button>

        <!-- Chat Panel -->
        <div id="chatbot-panel"
            class="fixed bottom-[7.5rem] sm:bottom-36 right-5 sm:right-7 z-[997] w-[calc(100vw-2.5rem)] sm:w-[400px] max-h-[70vh] sm:max-h-[520px] rounded-2xl overflow-hidden flex flex-col
            opacity-0 scale-95 translate-y-4 pointer-events-none transition-all duration-300 origin-bottom-right"
            style="box-shadow: 0 24px 80px rgba(28,27,27,0.25), 0 0 0 1px rgba(209,207,201,0.2);">

            <!-- Header -->
            <div class="relative px-5 py-4 flex items-center gap-3 text-white shrink-0"
                 style="background: linear-gradient(135deg, #1c1b1b 0%, #2a2524 100%);">
                <div class="relative">
                    <img src="/images/logo.png" alt="Chav" class="w-10 h-10 rounded-full object-contain bg-white/10 p-1 border border-white/10">
                    <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1c1b1b]"></span>
                </div>
                <div class="flex-1">
                    <h3 class="font-headline text-base font-bold tracking-tight leading-tight">Chav Assistant</h3>
                    <p class="text-[10px] text-white/50 uppercase tracking-[0.15em] font-label mt-0.5">Always here to help</p>
                </div>
                <button id="chatbot-clear" title="Clear chat" class="text-white/40 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
                    <span class="material-symbols-outlined text-lg">delete_sweep</span>
                </button>
            </div>

            <!-- Messages Area -->
            <div id="chatbot-messages" class="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                 style="background: linear-gradient(180deg, #fbf9f4 0%, #f5f3ee 100%); min-height: 250px;">

                <!-- Welcome message -->
                <div class="chatbot-msg-bot flex gap-2.5 items-end">
                    <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                         style="background: linear-gradient(135deg, #98462f, #b5593b);">C</div>
                    <div class="bg-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] text-sm text-[#1c1b1b] leading-relaxed shadow-sm border border-[#e4e2dd]/50">
                        Namaskar! 🙏 Welcome to <strong>Chav Mayechi</strong>.<br><br>
                        I can help you with our products, prices, ordering, or anything else. What would you like to know?
                    </div>
                </div>

                <!-- Quick Actions -->
                <div id="chatbot-quick-actions" class="flex flex-wrap gap-2 pl-9">
                    <button class="chatbot-quick-btn px-3 py-1.5 text-xs font-semibold rounded-full border border-[#98462f]/20 text-[#98462f] bg-[#98462f]/5 hover:bg-[#98462f]/10 transition-colors">
                        📋 Show Products
                    </button>
                    <button class="chatbot-quick-btn px-3 py-1.5 text-xs font-semibold rounded-full border border-[#98462f]/20 text-[#98462f] bg-[#98462f]/5 hover:bg-[#98462f]/10 transition-colors">
                        🛒 How to Order?
                    </button>
                    <button class="chatbot-quick-btn px-3 py-1.5 text-xs font-semibold rounded-full border border-[#98462f]/20 text-[#98462f] bg-[#98462f]/5 hover:bg-[#98462f]/10 transition-colors">
                        📞 Contact Info
                    </button>
                </div>
            </div>

            <!-- Input Area -->
            <div class="px-4 py-3 bg-white border-t border-[#e4e2dd]/50 shrink-0">
                <form id="chatbot-form" class="flex items-center gap-2">
                    <input id="chatbot-input" type="text" placeholder="Ask me anything..."
                        autocomplete="off"
                        class="flex-1 bg-[#f5f3ee] text-[#1c1b1b] text-sm px-4 py-2.5 rounded-xl border border-transparent focus:border-[#98462f]/30 focus:ring-0 outline-none transition-colors placeholder:text-[#4a4a4a]/40">
                    <button type="submit" id="chatbot-send"
                        class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        style="background: linear-gradient(135deg, #98462f, #b5593b);">
                        <span class="material-symbols-outlined text-lg">send</span>
                    </button>
                </form>
                <p class="text-[9px] text-center mt-2 text-[#4a4a4a]/40 uppercase tracking-widest font-label">Powered by Gemini AI</p>
            </div>
        </div>
    `;

    // Inject into DOM
    const container = document.createElement('div');
    container.id = 'chatbot-container';
    container.innerHTML = chatHTML;
    document.body.appendChild(container);

    // ── Event Bindings ────────────────────────────────────────
    const toggle = document.getElementById('chatbot-toggle');
    const panel = document.getElementById('chatbot-panel');
    const icon = document.getElementById('chatbot-icon');
    const pulse = document.getElementById('chatbot-pulse');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messagesArea = document.getElementById('chatbot-messages');
    const clearBtn = document.getElementById('chatbot-clear');

    // Toggle chat
    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            panel.classList.remove('opacity-0', 'scale-95', 'translate-y-4', 'pointer-events-none');
            panel.classList.add('opacity-100', 'scale-100', 'translate-y-0');
            icon.textContent = 'close';
            icon.style.transform = 'rotate(0deg)';
            if (pulse) pulse.style.display = 'none';
            setTimeout(() => input.focus(), 300);
        } else {
            panel.classList.add('opacity-0', 'scale-95', 'translate-y-4', 'pointer-events-none');
            panel.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            icon.textContent = 'smart_toy';
            icon.style.transform = 'rotate(0deg)';
        }
    });

    // Send message
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text || isTyping) return;

        // Hide quick actions after first message
        const quickActions = document.getElementById('chatbot-quick-actions');
        if (quickActions) quickActions.remove();

        appendMessage('user', text);
        input.value = '';
        input.disabled = true;
        document.getElementById('chatbot-send').disabled = true;

        // Show typing indicator
        showTyping();

        const reply = await sendToGemini(text);

        removeTyping();
        appendMessage('bot', reply);

        input.disabled = false;
        document.getElementById('chatbot-send').disabled = false;
        input.focus();
    });

    // Quick action buttons
    document.querySelectorAll('.chatbot-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.textContent.trim();
            form.dispatchEvent(new Event('submit'));
        });
    });

    // Clear chat
    clearBtn.addEventListener('click', () => {
        chatHistory = [];
        messagesArea.innerHTML = `
            <div class="chatbot-msg-bot flex gap-2.5 items-end">
                <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                     style="background: linear-gradient(135deg, #98462f, #b5593b);">C</div>
                <div class="bg-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] text-sm text-[#1c1b1b] leading-relaxed shadow-sm border border-[#e4e2dd]/50">
                    Chat cleared! How can I help you? 😊
                </div>
            </div>
        `;
    });
}

// ── UI Helpers ─────────────────────────────────────────────────
function appendMessage(role, text) {
    const messagesArea = document.getElementById('chatbot-messages');

    const wrapper = document.createElement('div');
    wrapper.className = `flex gap-2.5 items-end ${role === 'user' ? 'justify-end' : ''} animate-fade-msg`;

    if (role === 'user') {
        wrapper.innerHTML = `
            <div class="rounded-2xl rounded-br-md px-4 py-3 max-w-[85%] text-sm text-white leading-relaxed shadow-sm"
                 style="background: linear-gradient(135deg, #98462f, #b5593b);">
                ${escapeHtml(text)}
            </div>
        `;
    } else {
        wrapper.innerHTML = `
            <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                 style="background: linear-gradient(135deg, #98462f, #b5593b);">C</div>
            <div class="bg-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] text-sm text-[#1c1b1b] leading-relaxed shadow-sm border border-[#e4e2dd]/50">
                ${formatMessage(text)}
            </div>
        `;
    }

    messagesArea.appendChild(wrapper);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function showTyping() {
    isTyping = true;
    const messagesArea = document.getElementById('chatbot-messages');
    const typing = document.createElement('div');
    typing.id = 'chatbot-typing';
    typing.className = 'flex gap-2.5 items-end animate-fade-msg';
    typing.innerHTML = `
        <div class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
             style="background: linear-gradient(135deg, #98462f, #b5593b);">C</div>
        <div class="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[#e4e2dd]/50 flex items-center gap-1.5">
            <span class="typing-dot w-2 h-2 rounded-full bg-[#98462f]/40" style="animation: typingBounce 1.4s infinite ease-in-out;"></span>
            <span class="typing-dot w-2 h-2 rounded-full bg-[#98462f]/40" style="animation: typingBounce 1.4s infinite ease-in-out 0.2s;"></span>
            <span class="typing-dot w-2 h-2 rounded-full bg-[#98462f]/40" style="animation: typingBounce 1.4s infinite ease-in-out 0.4s;"></span>
        </div>
    `;
    messagesArea.appendChild(typing);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function removeTyping() {
    isTyping = false;
    document.getElementById('chatbot-typing')?.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ── Inject Chatbot Styles ──────────────────────────────────────
const chatStyles = document.createElement('style');
chatStyles.textContent = `
    @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
    }
    @keyframes fadeMsg {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-msg {
        animation: fadeMsg 0.3s ease-out forwards;
    }
    #chatbot-messages::-webkit-scrollbar { width: 4px; }
    #chatbot-messages::-webkit-scrollbar-track { background: transparent; }
    #chatbot-messages::-webkit-scrollbar-thumb { background: rgba(152,70,47,0.2); border-radius: 99px; }
    #chatbot-messages::-webkit-scrollbar-thumb:hover { background: rgba(152,70,47,0.4); }
`;
document.head.appendChild(chatStyles);
