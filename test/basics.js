import Tests from '@lumjs/tests';
import ET from '../lib/index.js';
import { isTypList, isTypItem } from '@lumjs/typdef/base';

const plan = 10;
const t = Tests.new({ module: import.meta, plan });

t.isa(ET, 'object', 'default export is an object');

const be = ET.BaseEncodings;

t.isa(be, 'array', 'BaseEncodings is an array');
t.ok(isTypList(be), 'BaseEncodings is a TypDefList');
t.isa(be.byVal, Map, 'BaseEncodings.byVal is a Map');

let dataenc = '~G8fV<+{EGNw2]VooMwZf';
let dataobj = {hello: 'World'};
let datastr = JSON.stringify(dataobj);

// Test encoding.
let encoder = be.Base91;
t.ok(isTypItem(encoder), 'BaseEncodings.Base91 is a TypDefItem');
t.is(encoder.val, 0, 'Base91.val is correct');
let encoded = encoder.encode(datastr);
t.is(encoded, dataenc, 'Data encoded properly');

// Test decoding.
let decoder = be[0]; // Using the array offset index.
t.is(decoder, encoder, 'decoder is encoder');
t.is(be.byVal.get(0), decoder, 'be.byVal.get(0) == be[0]');
let decoded = decoder.decode(encoded);
t.is(decoded, datastr, 'Data decoded properly');

// TODO: other TypDef lists, etc.

t.done();
export default t;
