const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const original = process.argv[2];
const originalSource = process.argv[3] || path.join(original, 'src');
const parser = require(path.join(original, 'node_modules/@babel/parser'));
let components = 0;
let styles = 0;
const changed = [];
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['start', 'end', 'loc', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments'].includes(key))
    .map(([key, item]) => [key, clean(item)]));
}
function jsx(source, team) {
  const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const nodes = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
      if (team) removeUnusedRef(node);
      nodes.push(clean(node));
      return;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else visit(value);
    }
  }
  function removeUnusedRef(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXOpeningElement') node.attributes = node.attributes.filter(a => a.name?.name !== 'ref');
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(removeUnusedRef);
      else removeUnusedRef(value);
    }
  }
  visit(ast);
  return nodes;
}
function walk(dir) {
  for (const entry of fs.readdirSync(path.join(originalSource, dir), { withFileTypes: true })) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(relative); continue; }
    const before = fs.readFileSync(path.join(originalSource, relative));
    const after = fs.readFileSync(path.join(__dirname, 'src', relative));
    if (!before.equals(after)) changed.push(relative);
    if (relative.endsWith('.css')) { assert.deepEqual(after, before, relative); styles++; }
    if (relative.endsWith('.jsx')) {
      assert.deepEqual(jsx(after.toString(), relative.endsWith('Team.jsx')), jsx(before.toString(), relative.endsWith('Team.jsx')), relative);
      components++;
    }
  }
}
walk('');
console.log(`PASS: ${components} JSX trees equivalent (excluding unused Team ref); ${styles} CSS files byte-identical. All other existing assets byte-identical.`);
console.log('Changed source files:', changed.join(', '));
(async () => {
  const { matchesDoctor } = await import('./src/utils/doctors.js');
  const doctors = JSON.parse(fs.readFileSync(path.join(original, 'public/doctors.json')));
  for (const query of ['', ' ', 'Dr.', 'Leila', 'cardiology', 'DERM', 'unknown', '  Omar ']) {
    const q = query.trim().toLowerCase();
    const oldMatch = d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q);
    assert.deepEqual(doctors.filter(d => matchesDoctor(d, q)).slice(0, 6), doctors.filter(oldMatch).slice(0, 6));
    assert.deepEqual(doctors.find(d => matchesDoctor(d, q)), doctors.find(oldMatch));
  }
  const { readStoredValue } = await import('./src/utils/storage.js');
  assert.equal(readStoredValue('x', 'fallback'), 'fallback');
  global.window = {};
  for (const stored of [null, '', 'en', 'ar', 'dark']) {
    global.localStorage = { getItem: () => stored };
    assert.equal(readStoredValue('x', 'fallback'), stored || 'fallback');
  }
  global.localStorage = { getItem: () => { throw new Error('blocked'); } };
  assert.equal(readStoredValue('x', 'fallback'), 'fallback');
  console.log('PASS: doctor suggestion/search parity and storage fallback cases.');
})();
