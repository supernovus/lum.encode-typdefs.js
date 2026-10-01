import '@happy-dom/global-registrator/register.js';
import Tests from '@lumjs/tests';
import ET from '../lib/dom.js';

const plan = 8;
const t = Tests.new({ module: import.meta, plan });

t.isa(ET, 'object', 'dom module default export is an object');

const be = ET.BaseEncodings;

t.isa(be, 'array', 'BaseEncodings is an array');
t.isa(be.domElements, 'function', 'be.domElements() is ok');
t.ok(Object.hasOwn(be, 'elements'), 'be.elements exists');

let elems = be.domElements((item) => {
  let elem = document.createElement('li');
  elem.id = `t-${item.key}-${item.val+1}`;
  elem.innerText = item.label;
  return elem;
});

t.is(elems.length, 6, 'elems.length');

let list = document.createElement('ul');
list.append(...elems);

let html = '<ul><li id="t-Base91-1">Base91</li>';
html += '<li id="t-Base64u-2">Base64-URL</li>';
html += '<li id="t-Base64-3">Base64</li>';
html += '<li id="t-Base32-4">Base32</li>';
html += '<li id="t-CBase32-5">CBase32</li>';
html += '<li id="t-ZBase32-6">ZBase32</li></ul>';

t.is(list.outerHTML, html, 'list HTML is ok');

let elems2 = be.elements;

t.isnt(elems[0], elems2[0], 'be.elements returns clones');

let list2 = document.createElement('ul');
list2.append(...elems2);

t.is(list2.outerHTML, html, 'clone HTML is the same');

t.done();
export default t;
