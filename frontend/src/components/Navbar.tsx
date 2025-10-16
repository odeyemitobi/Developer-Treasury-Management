'use client';

import { WalletConnect } from './WalletConnect';
import { MdAccountBalance } from 'react-icons/md';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-xl z-50 shadow-xl">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo & Brand - Optimized for mobile */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="relative group cursor-pointer flex-shrink-0">
              {/* Animated glow effect - Orange */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg sm:rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-300 animate-pulse"></div>
              <div className="relative p-2 sm:p-3 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 shadow-orange-500/40">
                <MdAccountBalance className="text-white w-5 h-5 sm:w-7 sm:h-7" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-2xl font-bold text-white tracking-tight truncate bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Developer Treasury
              </h1>
              <p className="text-xs text-neutral-500 font-medium hidden md:block">
                Multi-signature treasury on Stacks
              </p>
            </div>
          </div>

          {/* Navigation & Wallet */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}

