/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'dm-sans': ['DM Sans', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            },
            animation: {
                'twinkle': 'twinkle 3s ease-in-out infinite',
                'float': 'float 20s ease-in-out infinite',
                'drift': 'drift 25s linear infinite',
            },
            keyframes: {
                twinkle: {
                    '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.3)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                drift: {
                    '0%': { transform: 'translateX(-100px)' },
                    '100%': { transform: 'translateX(calc(100vw + 100px))' },
                },
            },
        },
    },
    plugins: [],
}
