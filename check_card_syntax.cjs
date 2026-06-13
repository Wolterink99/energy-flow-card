const fs = require('fs');
try {
  const content = fs.readFileSync('dist/energy-flow-card.js', 'utf8');
  // Use Function constructor to check syntax
  new Function(content);
  console.log('JS syntax is completely valid!');
} catch (e) {
  console.error('JS Syntax Error:', e);
}
