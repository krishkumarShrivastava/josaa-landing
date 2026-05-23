const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src/app/college/[id]/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Normalize newlines
content = content.replace(/\\r\\n/g, '\\n');

if (!content.includes('const round1Cutoffs1 = ROUND_1_CUTOFFS_DATA.filter')) {
    content = content.replace(
        'const basicInfo = getCollegeBasicInfo(activeCollege.id, activeCollege.name, activeCollege.type);',
        \const basicInfo = getCollegeBasicInfo(activeCollege.id, activeCollege.name, activeCollege.type);
    
    const round1Cutoffs1 = ROUND_1_CUTOFFS_DATA.filter(row => 
      row.Institute && row.Institute.toLowerCase().replace(/,/g, '') === instName.toLowerCase().replace(/,/g, '')
    );\
    );
}

if (!content.includes('const instName2 = DATA.fullName;')) {
    content = content.replace(
        'return (\\n    <main',
        \const instName2 = DATA.fullName;
  const round1Cutoffs2 = ROUND_1_CUTOFFS_DATA.filter(row => 
    row.Institute && row.Institute.toLowerCase().replace(/,/g, '') === instName2.toLowerCase().replace(/,/g, '')
  );

  return (\\n    <main\
    );
}

const newBlock1 = \) : activeTab === 'Round 1 Cutoffs' ? (
              <div className="flex flex-col gap-8 min-w-0 animate-in fade-in duration-500">
                {round1Cutoffs1.length > 0 ? (
                  <div className={\\\order-[1px] \ bg-[#0A0A0A]\\\}>
                    <div className={\\\p-8 md:p-12 border-b-[1px] \ bg-[#111111] flex flex-wrap justify-between items-center gap-4\\\}>
                      <div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Round 1 Cutoffs</h2>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-50 mt-2">JoSAA 2024 · Round 1 Data</p>
                      </div>
                      <span className={\\\\ font-mono text-sm uppercase tracking-widest border-[1px] \ px-4 py-2\\\}>Official Data</span>
                    </div>
                    <div className="w-full overflow-x-auto no-scrollbar">
                      <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                          <tr className="bg-[#1E293B]">
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Branch Program</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Quota</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Seat Type</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Gender</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Opening</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest opacity-50">Closing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {round1Cutoffs1.map((c, i) => (
                            <tr key={i} className={\\\order-b-[1px] \ \ \ transition-none cursor-default\\\}>
                              <td className="p-6 text-lg md:text-xl font-bold uppercase tracking-tighter border-r-[1px] border-neutral-800 break-words">{c["Academic Program Name"]}</td>
                              <td className="p-6 text-sm font-mono uppercase border-r-[1px] border-neutral-800 opacity-80">{c["Quota"]}</td>
                              <td className="p-6 text-sm font-mono uppercase border-r-[1px] border-neutral-800 opacity-80">{c["Seat Type"]}</td>
                              <td className="p-6 text-sm font-mono uppercase border-r-[1px] border-neutral-800 opacity-80">{c["Gender"]}</td>
                              <td className={\\\p-6 text-2xl font-black tracking-tighter \ border-r-[1px] border-neutral-800\\\}>{c["Opening Rank"]}</td>
                              <td className={\\\p-6 text-3xl font-black tracking-tighter \\\\}>{c["Closing Rank"]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className={\\\p-12 border-[1px] \ text-center text-neutral-500 font-mono text-sm uppercase tracking-widest bg-[#0A0A0A]\\\}>
                    Cutoff data for this institute is not available in the current dataset.
                  </div>
                )}
              </div>
            \;

const newBlock2 = \) : activeTab === 'Round 1 Cutoffs' ? (
            <div className="flex flex-col gap-8 min-w-0 animate-in fade-in duration-500">
                {round1Cutoffs2.length > 0 ? (
                  <div className="border-[1px] border-[#1E293B] bg-[#0A0A0A]">
                    <div className="p-8 md:p-12 border-b-[1px] border-[#1E293B] bg-[#111111] flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Round 1 Cutoffs</h2>
                        <p className="font-mono text-sm uppercase tracking-widest opacity-50 mt-2">JoSAA 2024 · Round 1 Data</p>
                      </div>
                      <span className="text-[#3B82F6] font-mono text-sm uppercase tracking-widest border-[1px] border-[#3B82F6] px-4 py-2">Official Data</span>
                    </div>
                    <div className="w-full overflow-x-auto no-scrollbar">
                      <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                          <tr className="bg-[#1E293B]">
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Branch Program</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Quota</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Seat Type</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Gender</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest border-r-[1px] border-[#0A0A0A] opacity-50">Opening</th>
                            <th className="p-6 text-sm font-mono uppercase tracking-widest opacity-50">Closing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {round1Cutoffs2.map((c, i) => (
                            <tr key={i} className={\\\order-b-[1px] border-[#1E293B] \ hover:bg-[#3B82F6] hover:text-black transition-none cursor-default\\\}>
                              <td className="p-6 text-lg md:text-xl font-bold uppercase tracking-tighter border-r-[1px] border-neutral-800 break-words">{c["Academic Program Name"]}</td>
                              <td className="p-6 text-sm font-mono uppercase border-r-[1px] border-neutral-800 opacity-80">{c["Quota"]}</td>
                              <td className="p-6 text-sm font-mono uppercase border-r-[1px] border-neutral-800 opacity-80">{c["Seat Type"]}</td>
                              <td className="p-6 text-sm font-mono uppercase border-r-[1px] border-neutral-800 opacity-80">{c["Gender"]}</td>
                              <td className="p-6 text-2xl font-black tracking-tighter text-[#3B82F6] border-r-[1px] border-neutral-800 hover:text-black">{c["Opening Rank"]}</td>
                              <td className="p-6 text-3xl font-black tracking-tighter text-[#3B82F6] hover:text-black">{c["Closing Rank"]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 border-[1px] border-[#1E293B] text-center text-neutral-500 font-mono text-sm uppercase tracking-widest bg-[#0A0A0A]">
                    Cutoff data for this institute is not available in the current dataset.
                  </div>
                )}
              </div>
          \;

let idx1Start = content.indexOf(") : activeTab === 'Cutoffs' ? (");
if (idx1Start !== -1) {
    let searchStr = ") : (\\n              <div className={\\\lex-1 flex flex-col items-center justify-center";
    let nextFallbackStart = content.indexOf(searchStr, idx1Start);
    if (nextFallbackStart !== -1) {
        content = content.substring(0, idx1Start) + newBlock1 + "\\n            " + content.substring(nextFallbackStart);
        console.log('Replaced block 1 successfully');
    } else {
        console.log('Could not find end of block 1');
    }
}

let idx2Start = content.indexOf(') : activeTab === "Cutoffs" ? (');
if (idx2Start !== -1) {
    let nextTabStart = content.indexOf(') : activeTab === "Placements" ? (', idx2Start);
    if (nextTabStart !== -1) {
        content = content.substring(0, idx2Start) + newBlock2 + '\\n          ' + content.substring(nextTabStart);
        console.log('Replaced block 2 successfully');
    } else {
        console.log('Could not find end of block 2');
    }
}

fs.writeFileSync(pagePath, content);
