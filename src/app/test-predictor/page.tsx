'use client';

import React, { useState, useEffect, useMemo } from 'react';

export default function TestPredictor() {
  const [round, setRound] = useState(5);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRank, setUserRank] = useState('');
  const [isIIT, setIsIIT] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCutoffData = async (roundNumber: number) => {
      setLoading(true);
      try {
        const mod = await import(`../../data/round${roundNumber}_cutoffs.json`);
        if (isMounted) {
          setData(mod.default || mod);
        }
      } catch (error) {
        console.error("Failed to load round data:", error);
        if (isMounted) setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCutoffData(round);
    return () => { isMounted = false; };
  }, [round]);

  const matches = useMemo(() => {
    if (!userRank || isNaN(Number(userRank)) || data.length === 0) return [];
    const rankNum = Number(userRank);

    return data.filter((item) => {
      const institute = (item['Institute'] || '').toLowerCase();
      const isItemIIT = institute.includes('indian institute of technology');
      if (isIIT !== isItemIIT) return false;

      const seatType = (item['Seat Type'] || '').toLowerCase();
      if (seatType !== 'open') return false;

      const gender = (item['Gender'] || '').toLowerCase();
      if (!gender.includes('gender-neutral')) return false;

      const closingRankStr = item['Closing Rank'] || '';
      const match = String(closingRankStr).match(/\d+/);
      if (!match) return false;
      
      const closingRank = parseInt(match[0], 10);
      return closingRank >= rankNum;
    });
  }, [data, userRank, isIIT]);

  return (
    <div className="min-h-screen bg-blue-600 text-black p-4 md:p-8 font-mono">
      <div className="max-w-5xl mx-auto border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
        <header className="mb-10 border-b-8 border-black pb-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-blue-600">
            Rank Predictor
          </h1>
          <p className="text-xl font-bold uppercase mt-2 bg-black text-white inline-block px-3 py-1">
            Engine Test Page
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="flex-[2]">
            <label className="block text-2xl font-black mb-3 uppercase tracking-tight">Your Rank</label>
            <input 
              type="number"
              value={userRank}
              onChange={(e) => setUserRank(e.target.value)}
              placeholder="Enter your JEE Rank..."
              className="w-full border-4 border-black p-4 text-2xl font-bold outline-none focus:bg-yellow-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-2xl font-black mb-3 uppercase tracking-tight">Target Type</label>
            <div className="flex border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button 
                onClick={() => setIsIIT(true)}
                className={`flex-1 p-4 text-xl font-black uppercase transition-colors ${isIIT ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
              >
                IIT
              </button>
              <div className="w-1 bg-black"></div>
              <button 
                onClick={() => setIsIIT(false)}
                className={`flex-1 p-4 text-xl font-black uppercase transition-colors ${!isIIT ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
              >
                Non-IIT
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-2xl font-black mb-3 uppercase tracking-tight">Select Round</label>
            <div className="relative">
              <select 
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="w-full border-4 border-black p-4 text-xl font-black uppercase appearance-none bg-white cursor-pointer hover:bg-yellow-300 transition-colors outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {[1, 2, 3, 4, 5, 6].map(r => (
                  <option key={r} value={r}>Round {r}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black border-l-4 border-black bg-gray-200 font-bold">
                ▼
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="border-4 border-black p-10 bg-yellow-400 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8">
            <h2 className="text-4xl font-black uppercase animate-pulse tracking-widest">Loading Round Data...</h2>
            <p className="text-xl font-bold uppercase mt-4">Hang tight, pulling massive files.</p>
          </div>
        ) : (
          <div className="mt-10">
            <div className="mb-6 border-b-4 border-black pb-2">
              <h2 className="text-3xl font-black uppercase">
                {matches.length > 0 ? (
                  <span className="bg-green-400 px-3 py-1 border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {matches.length} Safe Matches
                  </span>
                ) : (
                  userRank ? 'No safe matches found.' : 'Enter a rank to see matches.'
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
              {matches.map((item, idx) => (
                <div key={idx} className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-green-400 border-l-4 border-b-4 border-black px-4 py-2 font-black uppercase text-sm z-10">
                    Safe Match
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-3 pr-28 uppercase leading-none">
                    {item['Institute']}
                  </h3>
                  <p className="text-lg md:text-xl font-bold mb-6 bg-blue-100 inline-block px-3 py-2 border-2 border-black">
                    {item['Academic Program Name']}
                  </p>
                  <div className="flex flex-wrap gap-4 text-base font-black uppercase">
                    <span className="border-2 border-black px-3 py-1 bg-gray-100 flex items-center">
                      Quota: {item['Quota']}
                    </span>
                    <span className="border-2 border-black px-3 py-1 bg-gray-100 flex items-center">
                      Category: {item['Seat Type']}
                    </span>
                    <span className="border-2 border-black px-3 py-1 bg-green-300 text-black flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Closing Rank: {item['Closing Rank']}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fff; border-left: 4px solid #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border: 2px solid #fff; }
      `}} />
    </div>
  );
}
