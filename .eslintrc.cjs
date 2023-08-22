module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
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
        "react",
    ],
    "rules": {
        'no-mutate-config-get/no-mutate-config-get': 'warn'
    },
    "settings": {
        'import/resolver': {
          node: {
            paths: ['eslint-rules']
          }
        },
        "react": {
            "version": "detect"  // This will automatically detect and set the React version
        }
    }    
}
