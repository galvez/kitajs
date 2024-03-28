import fs from 'node:fs';
import path from 'node:path';

let version = '0.0.0';

try {
  version = require('../../package.json').version;
} catch {
  // Ignore when version could not be found
}

/**
 * This theme was generously provided by the Scalar team to be used in our Scalar UI.
 *
 * Go give them a shout out at:
 *
 * @link https://twitter.com/scalar
 * @link https://scalar.com
 */
export const ScalarUiTheme = fs
  .readFileSync(path.resolve(__dirname, '../../../assets/swagger.css'), 'utf-8')
  // Simple minification step to reduce the size of the theme
  .trim()
  .replace(/\n/g, '')
  .replace(/\s+/g, ' ')
  .replace(/\/\*.*?\*\//g, '')
  .replace(/; /g, ';');

export const DefaultOpenApiInfo = {
  title: 'API Reference',
  description: 'Powered by [Scalar](https://scalar.com/) & Generated by [KitaJS](https://kita.js.org/)',
  version
};