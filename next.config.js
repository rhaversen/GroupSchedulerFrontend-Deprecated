// Import statement for Next.js configuration typing
/** @type {import('next').NextConfig} */

const nextConfig = {
    // ESLint configuration to ignore linting during builds
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,

    // ...other config
};

module.exports = nextConfig;
