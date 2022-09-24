import deepmerge from 'deepmerge';
import type { KitaGenerator } from './generator';
import type * as Prettier from 'prettier';

/**
 * The kita config interface. all possible customizations are done through this interface.
 */
export interface KitaConfig {
  /**
   * The tsconfig path
   *
   * @default './tsconfig.json'
   */
  tsconfig: string;

  routes: {
    /**
     * Where to emit the generated routes file
     *
     * @default './src/routes.ts'
     */
    output: string;

    /**
     * If the generated code should be formatted with prettier
     */
    format: false | Prettier.Options;
  };

  controllers: {
    /**
     * The regex to match all files to parse
     *
     * @default ['src/routes/⁎⁎/⁎.ts','routes/⁎⁎/⁎.ts']
     */
    glob: string[];

    /**
     * The regex to extract the route controller pathname from the absolute path
     *
     * @default /(?:.*src)?\/?(?:routes\/?)/
     */
    prefix: string;
  };

  /**
   * The parameter name and its path
   *
   * @default {}
   */
  params: Record<string, string>;

  // Want more listeners? Create a PR!
  // :)

  /**
   * Customize directly the kita generator, when it is created.
   *
   * Here you can add custom routes or custom parameters.
   *
   * @example
   *
   * ```ts
   * module.exports = {
   *   onCreate({ routes }) {
   *    routes.push(new CustomRouterThatIWrote());
   *   }
   * }
   * ```
   */
   onCreate?: (kg: KitaGenerator) => void;

   /**
   * Called when the generator finished building / updating its routes AST.
   * 
   * You can use this to modify the AST before it gets emitted.
   *
   * @example
   *
   * ```ts
   * module.exports = {
   *   onAstUpdate({ ast }) {
   *    ast.addImport(`import './custom-code`);
   *   }
   * }
   * ```
   */
  onAstUpdate?: (kg: KitaGenerator) => void | Promise<void>;

  /**
   * Returns a custom generator, instead of the default {@link KitaGenerator}.
   * 
   * @example
   *
   * ```ts
   * const { KitaGenerator } = require('@kitajs/generator');
   * 
   * module.exports = {
   *   customGenerator: class CustomGenerator extends KitaGenerator {
   *      // ... custom code
   *    }
   *  }
   * ```
   */
   customGenerator?: typeof KitaGenerator;
}

export const DefaultConfig: KitaConfig = {
  params: {},
  tsconfig: './tsconfig.json',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  routes: {
    output: './src/routes.ts',
    format: { parser: 'typescript' }
  }
};

export function mergeDefaults(config?: Partial<KitaConfig>): KitaConfig {
  return deepmerge(DefaultConfig, config || {}, { arrayMerge: (_, b) => b });
}

export function importConfig(path: string) {
  try {
    return mergeDefaults(require(path));
  } catch (e) {
    return DefaultConfig;
  }
}
