module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-parse|remark-rehype|rehype-parse|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-stringify-position|mdast-util-from-markdown|mdast-util-to-markdown|mdast-util-to-hast|hast-util-to-jsx-runtime|micromark|decode-named-character-reference|character-entities|zwitch|longest-streak|mdast-util-to-string|unist-util-visit|unist-util-is|unist-util-visit-parents|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|hast-util-parse-selector|hastscript|web-namespaces|html-void-elements)/)'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'mjs'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.{test,spec}.{js,jsx}',
    '!src/__tests__/**',
    '!src/__mocks__/**'
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  },
  verbose: true,
  testTimeout: 10000
}; 