import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              SM
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SMUNI-Market
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <span className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer">Browse</span>
            <span className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer">Track Order</span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-xl mb-2">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              SMUNI-Market
            </h1>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Online Shopping and Inventory Management System. Backend REST API is being set up in Phase 1.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Local Client Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Active (Vite)
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Backend API Connection:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                Pending Setup
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 px-4 rounded-xl text-sm font-semibold transition active:scale-95"
            >
              Test Counter: {count}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Alyah Innovation Hub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
