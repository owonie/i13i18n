# My Package

"I'm too lazy to use i18n." If you feel the same way, then this package is for you! i13i18n simplifies the process of internationalization, making it easy and straightforward to use without the hassle. Let's be lazy together and make i18n effortless!

## Installation

You can install this package using npm:

```sh
npm install i13i18n
```

## Usage

```sh
npm run ton   # Enable translation with i18n.
npm run toff  # Disable translation with i18n.
```

## Configuration

This package supports configuration via a i13i18n.config.json file. Here is an example configuration:

```json
{
  "sourceDirectory": "./src",
  "outputDirectory": "./outputs",
  "transpileOptions": {
    "presets": ["@babel/preset-env"],
    "plugins": []
  },
  "targetExtensions": [".t.jsx", ".t.tsx"],
  "exclude": ["node_modules"]
}
```

### License

This project is licensed under the MIT License. See the LICENSE file for details.
