module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        "next/core-web-vitals"
    ],
    "overrides": [
        {
            "files": ["*.ts", "*.tsx"],  // This will apply the override to all TS files
            "env": {
                "node": true
            },

            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": ["error", 4], // Standard ESLint indent rule
    },
    "settings": {
        "react": {
            "version": "detect"  // This will automatically detect and set the React version
        }
    }    
}