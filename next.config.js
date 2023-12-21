// Import statement for Next.js configuration typing
/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
        // First, remove any existing SVG rules
        config.module.rules = config.module.rules.map((rule) => {
            if (rule.test?.toString().includes('svg')) {
                const newRule = {...rule};
                newRule.exclude = /\.svg$/i;
                return newRule;
            }
            return rule;
        });

        config.module.rules.push({
            issuer: /\.[jt]sx?$/,
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        config.module.rules.push({
            issuer: /\.scss$/,
            test: /\.svg$/,
            use: ['url-loader'],
        });

        return config;
    },

    // ESLint configuration to ignore linting during builds
    eslint: {
        ignoreDuringBuilds: true,
    },

    // ...other config
};

module.exports = nextConfig;
