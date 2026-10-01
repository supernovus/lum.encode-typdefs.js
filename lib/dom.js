import { TypDef, TypDOM } from '@lumjs/typdef/dom';
import * as data from './data.js';

/**
 * A module that adds DOM support to the encoding typedefs.
 * @module @lumjs/encode-typdefs/dom
 */

/**
 * A version of TypDef() that provides a value map by default,
 * uses the TypDOM extension, and has an `elements` accessor that
 * acts as a shortcut to the `domElements()` method.
 * 
 * See the `@lumjs/typdef` docs for arguments and return values.
 * @type {function}
 */
export const EncDef = TypDef(TypDef.Opts({
  setupList: [
    TypDOM,
    function(list) {
      Object.defineProperty(list, 'elements', {
        get() {
          return this.domElements(true);
        },
        set(v) {
          return this.domElements(v);
        },
      });
    },
  ],
  valMap: true,
}));

/** The TypDef list datasets with DOM extensions. */
export const sets = data.make(EncDef, ...data.sets);
export default sets;
