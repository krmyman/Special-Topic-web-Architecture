const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'i18n.js'), 'utf8'), sandbox);
const data = sandbox.window.TEA_SENSE_DATA;
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('shared drink catalog satisfies the schema', () => {
  assert.deepEqual(Array.from(sandbox.window.validateTeaSenseData(data)), []);
});

test('catalog IDs are unique and all records are usable by ranking and recommendation', () => {
  const ids = data.drinks.map(drink => drink.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const drink of data.drinks) {
    assert.ok(drink.votes);
    assert.ok(drink.tag);
    assert.ok(drink.reason);
    assert.ok(drink.nutrition.label);
  }
});

test('graph references resolve to catalog nodes and drinks', () => {
  const nodes = new Set(Object.keys(data.graphConnections));
  for (const [from, to, strength] of data.graphEdges) {
    assert.ok(nodes.has(from), `missing source node ${from}`);
    assert.ok(nodes.has(to), `missing target node ${to}`);
    assert.ok(strength >= 1 && strength <= 5);
  }
});

test('validator reports malformed records', () => {
  const invalid = { schemaVersion: 1, drinks: [{ id: 'x', name: 'bad', category: 'dessert' }], graphConnections: {}, graphDrinkMatches: {} };
  assert.ok(sandbox.window.validateTeaSenseData(invalid).some(issue => issue.includes('category is invalid')));
});

test('HTML loads shared data and translations before the app', () => {
  const dataScript = html.indexOf('src="data.js"');
  const localeScript = html.indexOf('src="i18n.js"');
  const appScript = html.indexOf('src="app.js"');
  assert.ok(dataScript >= 0 && dataScript < appScript);
  assert.ok(localeScript >= 0 && localeScript < appScript);
});

test('deferred classic scripts do not redeclare top-level lexical bindings', () => {
  const scripts = ['data.js', 'i18n.js', 'app.js'].map(file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8'));
  assert.doesNotThrow(() => new vm.Script(scripts.join('\n')));
});

test('weighted edge catalog matches the inline SVG segment count', () => {
  const graphStart = html.indexOf('class="graph-edges"');
  const graphEnd = html.indexOf('</g><g class="graph-nodes"', graphStart);
  const pathData = html.slice(graphStart, graphEnd).match(/d="([^"]+)"/)?.[1] || '';
  const segmentCount = (pathData.match(/M/g) || []).length;
  assert.equal(data.graphEdges.length, segmentCount);
});

test('interactive flavor nodes remain keyboard reachable and labeled', () => {
  const nodes = html.match(/<g[^>]*class="graph-node(?:\s|\")[^>]*>/g) || [];
  assert.ok(nodes.length > 0);
  for (const node of nodes) {
    assert.match(node, /tabindex="0"/);
    assert.match(node, /role="button"/);
    assert.match(node, /aria-pressed=/);
  }
});

test('reduced-motion support and generation cancellation control exist', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(html, /id="stopGeneration"/);
});

test('catalog display strings have translations in all supported locales', () => {
  const dictionaries = sandbox.window.TEA_SENSE_I18N.translations;
  const sources = new Set(data.drinks.flatMap(drink => [drink.name, drink.detail, drink.tag, drink.caffeineLabel, drink.sweetness, drink.nutrition.label, drink.reason, drink.adjustment, ...drink.flavors, ...drink.allergens]));
  for (const locale of ['en', 'ja', 'ko']) {
    for (const source of sources) assert.ok(dictionaries[locale][source], `${locale} is missing: ${source}`);
  }
});
