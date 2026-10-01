/**
 * A semi-private module providing the raw datasets and a function used
 * to create the actual TypDef list objects exported by the primary modules.
 * If you aren't making a direct extension of this package, you will never
 * need to directly work with this module.
 * @module @lumjs/encode-typdefs/data
 */

import core from '@lumjs/core';
import { Base32, Base64, Base91 } from '@lumjs/encode/base';
export { Base32, Base64, Base91 } // Re-exporting for convenience.

const B32C = Base32.TYPES.crockford;
const B32Z = Base32.TYPES.zbase32;
const b64decode = (v, string = true) => Base64.decodeText(v, { string });
const { isObj } = core.types;

/**
 * Internal function used to register datasets.
 * @param {function} def - A TypDef function with options applied.
 * @param {...object} datasets - Objects containing the sets to be defined.
 * @returns {object} The named TypDef list objects.
 * @throws {TypeError} If any arguments are invalid.
 * @throws {RangeError} If any datasets have duplicate property names.
 */
export function make(def, ...datasets) {
  if (datasets.length === 0 || typeof def !== 'function') {
    console.error({ def, datasets });
    throw new TypeError('Invalid arguments');
  }

  let out = {}; // Will be populated below.

  for (let dataset of datasets) {
    if (!isObj(dataset)) {
      console.error({ dataset });
      throw new TypeError('Invalid dataset');
    }

    for (let key in dataset) {
      let val = dataset[key];
      if (Array.isArray(val)) {
        if (out[key] !== undefined) {
          console.error({ key, dataset, out });
          throw new RangeError('Duplicate dataset property name');
        }

        // Use string properties as references to a previous TypDef.
        let list = val.map(it => (typeof it === 'string') ? out[it] : it);
        out[key] = def(...list);
      }
    }
  }

  return out;
}

/**
 * A list of base encoding/decoding algorithms.
 * 
 * Item methods:
 * - encode(mixed): string
 * - decode(string, [asString]): mixed
 * - hash(hashifier): Promise<string>
 * 
 * The hash() method expects to be passed a `@lumjs/encode/hash` instance
 * that has had data added via its `add()` method. As every hash generation
 * method in that class is async, this will always return a Promise.
 */
export const BaseEncodings = [
  {
    key: 'Base91',
    desc: 'Uses all letters and numbers, plus 29 symbols.',
    encode: v => Base91.encode(v),
    decode: (v, string = true) =>
      Base91.decode(v, string ? { string } : { uint: true }),
    hash: hash => hash.base91(null),
  },
  {
    key: 'Base64u',
    desc: 'A variant of Base64 designed for URLs. All letters and numbers, plus 2 symbols.',
    label: 'Base64-URL',
    encode: v => Base64.encodeText(v, { url: true }),
    decode: b64decode,
    hash: hash => hash.base64(null, { url: true }),
  },
  {
    key: 'Base64',
    desc: 'The classic encoding! All letters and numbers, plus 3 symbols.',
    encode: v => Base64.encodeText(v),
    decode: b64decode,
    hash: hash => hash.base64(null),
  },
  {
    key: 'Base32',
    desc: 'The standard version of Base32. All uppercase letters, some numbers, and 1 symbol.',
    encode: v => Base32.encode(v),
    decode: (v, string = true) => Base32.decode(v, { string }),
    hash: hash => hash.base32(null),
  },
  {
    key: 'CBase32',
    desc: "A variation of Douglas Crockford's Base32. All numbers, some uppercase letters, no symbols.",
    encode: v => Base32.encode(v, { type: B32C, pad: false }),
    decode: (v, string = true) => Base32.decode(v, { string, type: B32C }),
    hash: hash => hash.base32(null, { type: B32C, pad: false }),
  },
  {
    key: 'ZBase32',
    desc: 'A third variation of Base32. A mix of some lowercase letters and some numbers.',
    encode: v => Base32.encode(v, { type: B32Z, pad: false }),
    decode: (v, string = true) => Base32.decode(v, { string, type: B32Z }),
    hash: hash => hash.base32(null, { type: B32Z, pad: false }),
  },
];

/**
 * Algorithms that can be used for generating hashes.
 * 
 * This has all of BaseEncodings, plus `Hex` which has a `desc` property,
 * and a hash() method, but not encode() or decode().
 */
export const HashEncodings = [
  'BaseEncodings', // A string will use the compiled TypDef object of that name.
  {
    key: 'Hex',
    desc: 'A hexidecimal number. All numbers plus A through F.',
    hash: hash => hash.hex(null),
  },
];

/**
 * A list of valid hash algorithms.
 * 
 * The `key` may be passed when creating a Hashifier instance as the
 * `algo` option value.
 */
export const HashAlgos = [
  { key: 'SHA-256' },
  { key: 'SHA-368' },
  { key: 'SHA-512' },
  { key: 'SHA-1', label: 'SHA-1 (160 bit)' },
];

/**
 * Key formats.
 * 
 * Optional boolean property `storable` indicates that the key data may
 * be stored as a JS object value rather than needing to be encoded.
 */
export const KeyFormats = [
  { key: 'raw', label: 'Raw' },
  { key: 'pkcs8', label: 'PKCS #8' },
  { key: 'spki', label: 'SPKI' },
  { key: 'json', label: 'JSON Web Key', storable: true },
];

/**
 * Algorithms for encrypting/decrypting data.
 */
export const EncryptAlgos = [
  { key: 'RSA-OAEP' },
  { key: 'AES-CTR' },
  { key: 'AES-CBC' },
  { key: 'AES-GCM' },
];

/**
 * Algorithms for creating digital signatures from arbitrary data.
 */
export const SignAlgos = [
  { key: 'RSASSA-PKCS1-v1_5', label: 'RSA PKCS v1.5' },
  { key: 'RSA-PSS' },
  { key: 'ECDSA' },
  { key: 'Ed25519' },
  { key: 'HMAC', private: true },
];

// Method for making a typed array of a specific length.
function getTypedArray() {
  let tac = globalThis[this.key];
  if (typeof tac === 'function') {
    return new tac(...arguments);
  }
  else {
    throw new TypeError(this.key + ' class not found');
  }
}

// Helper function for the IntArrays and FloatArrays lists.
export const taType = (key) => { return { key, make: getTypedArray } };

/**
 * TypedArray classes that represent integer values.
 */
export const IntArrays = [
  taType('Int8Array'),
  taType('Uint8Array'),
  taType('Uint8ClampedArray'),
  taType('Int16Array'),
  taType('Uint16Array'),
  taType('Int32Array'),
  taType('Uint32Array'),
  taType('BigInt64Array'),
  taType('BigUint64Array'),
];

/**
 * TypedArray classes that represent floating point values.
 */
export const FloatArrays = [
  taType('Float16Array'),
  taType('Float32Array'),
  taType('Float64Array'),
];

/**
 * The dataset definitions to make into typdefs.
 */
export const sets = [
  { BaseEncodings },
  {
    HashEncodings,
    HashAlgos,
    KeyFormats,
    EncryptAlgos,
    SignAlgos,
    IntArrays,
    FloatArrays,
  }
];
