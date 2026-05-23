const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const htmlPath = path.join('c:\\Users\\Admin\\.gemini\\antigravity\\brain\\15c3c594-e0a5-46d9-b160-b42578c9f70c\\browser\\josaa-landing', 'JoSAA.html');
const jsonPath = path.join('c:\\Users\\Admin\\.gemini\\antigravity\\brain\\15c3c594-e0a5-46d9-b160-b42578c9f70c\\browser\\josaa-landing', 'src', 'data', 'round1_cutoffs.json');

console.log('Loading HTML file...');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('Parsing HTML...');
const $ = cheerio.load(html);

const data = [];
// Assuming the table might have id 'GridView1', or we just look for all rows.
// Let's look for rows with exactly 7 columns where the first column contains 'Institute'.
let rows = $('#GridView1 tr');
if (rows.length === 0) {
    // Fallback if ID is different
    rows = $('table tr');
}

console.log('Found ' + rows.length + ' rows to process.');

rows.each((i, row) => {
    const cols = $(row).find('td');
    if (cols.length >= 7) {
        data.push({
            "Institute": $(cols[0]).text().trim(),
            "Academic Program Name": $(cols[1]).text().trim(),
            "Quota": $(cols[2]).text().trim(),
            "Seat Type": $(cols[3]).text().trim(),
            "Gender": $(cols[4]).text().trim(),
            "Opening Rank": $(cols[5]).text().trim(),
            "Closing Rank": $(cols[6]).text().trim()
        });
    }
});

console.log('Extracted ' + data.length + ' valid data rows.');

if (data.length > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log('Saved to src/data/round1_cutoffs.json');
} else {
    console.log('No data found! Check the HTML structure.');
}
