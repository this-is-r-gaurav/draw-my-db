module.exports = {
    extends: [
        "react-app",
        "react-app/jest"
    ],
    parser: '@typescript-eslint/parser',
    rules: {
    },
    parserOptions: {
        sourceType: "module"
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        },
      },
    },
  }
  