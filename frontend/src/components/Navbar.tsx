'use client';

import { WalletConnect } from './WalletConnect';
import Image from 'next/image';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-xl z-50 shadow-xl">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo & Brand - Optimized for mobile */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex place-items-center relative cursor-pointer">
              <Image
                src="/coins.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-2xl font-bold text-white tracking-tight truncate bg-gradient-to-r from-white to-orange-200 bg-clip-text">
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

