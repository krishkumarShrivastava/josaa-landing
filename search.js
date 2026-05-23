const fs = require('fs');
const path = require('path');
const file = path.join('c:\\Users\\Admin\\.gemini\\antigravity\\brain\\15c3c594-e0a5-46d9-b160-b42578c9f70c\\browser\\josaa-landing', 'src', 'app', 'college', '[id]', 'page.tsx');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('Round 1 Cutoffs')) {
        console.log(Line : );
    }
    if (line.includes('activeTab ===')) {
        console.log(Line : );
    }
});
