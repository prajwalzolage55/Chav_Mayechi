/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./products.html",
        "./order.html",
        "./dashboard.html",
        "./admin.html",
        "./login.html",
        "./register.html",
        "./js/**/*.js"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#98462f",
                "on-primary": "#ffffff",
                "primary-container": "#782e19",
                "on-primary-container": "#ffffff",
                "surface": "#fbf9f4",
                "on-surface": "#1c1b1b",
                "surface-bright": "#ffffff",
                "secondary": "#4a4a4a",
                "on-secondary": "#ffffff",
                "outline": "#d1cfc9",
                "outline-variant": "#c4c7c7",
                "surface-container-highest": "#e4e2dd",
                "surface-container-high": "#eae8e3",
                "surface-container-low": "#f5f3ee",
                "surface-container-lowest": "#ffffff",
                "surface-container": "#f0eee9",
                "on-surface-variant": "#444748",
                "background": "#fbf9f4"
            },
            borderRadius: {
                "DEFAULT": "0px",
                "lg": "2px",
                "xl": "4px",
                "full": "9999px"
            },
            fontFamily: {
                "headline": ["Noto Serif", "serif"],
                "body": ["Inter", "sans-serif"],
                "label": ["Inter", "sans-serif"]
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ],
}
