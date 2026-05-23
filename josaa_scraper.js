const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting JoSAA Scraper...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Navigate to JoSAA portal
  await page.goto('https://josaa.admissions.nic.in/applicant/SeatAllotmentResult/CurrentORCR.aspx', { waitUntil: 'networkidle2' });
  console.log('Page loaded.');

  try {
    // 1. Select Round 1
    console.log('Selecting Round 1...');
    await page.select('#ctl00_ContentPlaceHolder1_ddlroundno', '1');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(e => console.log('Navigation wait timeout, continuing...'));
    await new Promise(r => setTimeout(r, 2000));

    // 2. Select Institute Type (IITs)
    console.log('Selecting Institute Type...');
    const iitOption = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('#ctl00_ContentPlaceHolder1_ddlInstype option'));
        const iitOpt = options.find(o => o.text.includes('Indian Institute of Technology'));
        return iitOpt ? iitOpt.value : 'ALL';
    });
    await page.select('#ctl00_ContentPlaceHolder1_ddlInstype', iitOption);
    await new Promise(r => setTimeout(r, 2000));

    // 3. Select Institute Name (ALL)
    console.log('Selecting Institute Name...');
    await page.select('#ctl00_ContentPlaceHolder1_ddlInstitute', 'ALL');
    await new Promise(r => setTimeout(r, 2000));

    // 4. Select Academic Program (ALL)
    console.log('Selecting Academic Program...');
    await page.select('#ctl00_ContentPlaceHolder1_ddlBranch', 'ALL');
    await new Promise(r => setTimeout(r, 2000));

    // 5. Select Seat Type (ALL)
    console.log('Selecting Seat Type...');
    await page.select('#ctl00_ContentPlaceHolder1_ddlSeattype', 'ALL');
    await new Promise(r => setTimeout(r, 2000));

    // 6. Click Submit
    console.log('Submitting...');
    await page.click('#ctl00_ContentPlaceHolder1_btnSubmit');
    await page.waitForSelector('#GridView1', { timeout: 30000 });
    console.log('Table loaded!');

    // 7. Parse Table
    const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#GridView1 tr'));
        const result = [];
        
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].querySelectorAll('td');
            if (cols.length >= 7) {
                result.push({
                    "Institute": cols[0].innerText.trim(),
                    "Academic Program Name": cols[1].innerText.trim(),
                    "Quota": cols[2].innerText.trim(),
                    "Seat Type": cols[3].innerText.trim(),
                    "Gender": cols[4].innerText.trim(),
                    "Opening Rank": cols[5].innerText.trim(),
                    "Closing Rank": cols[6].innerText.trim()
                });
            }
        }
        return result;
    });

    console.log("Extracted " + data.length + " records!");
    
    // Save to JSON
    const jsonPath = path.join('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\15c3c594-e0a5-46d9-b160-b42578c9f70c\\browser\\josaa-landing', 'src', 'data', 'round1_cutoffs.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log('Saved to src/data/round1_cutoffs.json');

  } catch (error) {
    console.error('Scraping Error:', error);
  } finally {
    await browser.close();
  }
})();
