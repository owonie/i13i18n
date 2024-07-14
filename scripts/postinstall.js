const fs = require('fs');
const path = require('path');

const defaultConfig = {
  sourceDirectory: './src',
  outputDirectory: './outputs',
  transpileOptions: {
    presets: ['@babel/preset-env'],
    plugins: [],
  },
  targetExtensions: ['.t.jsx', '.t.tsx'],
};

const configPath = path.resolve(process.cwd(), 'i13i18n.config.json');

fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
console.log('\x1b[32m', 'i13i18n.config.json has been created successfully.');
