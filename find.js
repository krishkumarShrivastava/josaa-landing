const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, 'src/app/college/[id]/page.tsx'), 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Round 1 Cutoffs')) {
        console.log(Line : );
        // Print context
        for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 35); j++) {
            console.log(${j + 1}: );
        }
        break;
    }
}
