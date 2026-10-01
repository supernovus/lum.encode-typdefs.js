import { TypDef } from '@lumjs/typdef';
import * as data from './data.js';

/**
 * The default module provides a set of encoding TypDef lists.
 * @module @lumjs/encode-typdefs
 */

/**
 * A version of TypDef() that provides a value map by default.
 * See the `@lumjs/typdef` docs for arguments and return values.
 * @type {function}
 */
export const EncDef = TypDef(TypDef.Opts({
  valMap: true,
}));

/** The default TypDef list datasets. */
export const sets = data.make(EncDef, ...data.sets);
export default sets;
