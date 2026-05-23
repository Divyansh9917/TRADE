import { UserButton } from "@clerk/nextjs";

export default function TradeTerminal() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-zinc-100">
      
      {/* 1. Left Sidebar (Global Navigation) */}
      <aside className="w-16 border-r border-zinc-800 flex flex-col items-center py-4 bg-zinc-950">
        <div className="text-emerald-500 font-bold text-xl mb-8 tracking-tighter">PT</div>
        
        {/* Clerk Profile Button - Automatically handles user sessions & sign out */}
        <div className="mt-auto mb-4">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </aside>

      {/* 2. Main Center Column (Chart & Positions) */}
      <main className="flex-1 flex flex-col border-r border-zinc-800">
        
        {/* Top Header: Ticker & Live Price */}
        <header className="h-16 border-b border-zinc-800 flex items-center px-6 bg-zinc-950">
          <h1 className="text-2xl font-bold">BTC/USD</h1>
          <div className="ml-6 flex flex-col">
            <span className="text-emerald-400 font-semibold">$64,231.50</span>
            <span className="text-xs text-zinc-500">Live Market</span>
          </div>
        </header>

        {/* Charting Area (Takes up majority of vertical space) */}
        <div className="flex-1 p-4">
          <div className="w-full h-full bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-600 font-mono">
            [ Lightweight Charts Canvas Will Go Here ]
          </div>
        </div>

        {/* Bottom Panel: Open Positions / History */}
        <div className="h-72 border-t border-zinc-800 p-4 bg-zinc-950">
          <div className="w-full h-full bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-600 font-mono">
            [ Positions & Trade History Table ]
          </div>
        </div>
      </main>

      {/* 3. Right Sidebar (Order Entry Panel) */}
      <aside className="w-80 bg-zinc-950 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-6">Order Entry</h2>
        
        <div className="flex-1 bg-zinc-900/50 rounded-lg border border-zinc-800 p-4 flex flex-col justify-end">
           <div className="text-center text-zinc-600 font-mono mb-4">
             [ Order Input Form Goes Here ]
           </div>

           {/* Dummy Buttons for Visual Layout */}
           <div className="flex gap-2 mt-4">
             <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded font-semibold transition-colors">
               BUY
             </button>
             <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded font-semibold transition-colors">
               SELL
             </button>
           </div>
        </div>
      </aside>

    </div>
  );
}