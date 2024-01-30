/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                'White': '#FFFFFF',
                'Link-Bright': '#90DBEE',
                'Highlights': '#007BFF',
                'Highlights-hover': '#0456B5',
                'Dark': '#0F3B6E',
                'Gray': '#292D3B',
                'Black': '#1A1A1A',
                'Logo': '#E3B50F',
            },        
        },
    },
    plugins: [],
}
