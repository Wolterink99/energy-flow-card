const fs = require('fs');
const content = fs.readFileSync('src/components/house-svg.ts', 'utf8');
const occurrences = [];
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('overheadWire')) {
    occurrences.push({ lineNum: idx + 1, content: line });
  }
});
console.log(occurrences);
