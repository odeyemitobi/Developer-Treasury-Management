'use client';

import { useWallet } from '@/hooks/useWallet';
import { Button } from './ui/Button';
import { shortenAddress, copyToClipboard } from '@/lib/utils';
import { MdAccountBalanceWallet, MdContentCopy, MdLogout, MdCheckCircle } from 'react-icons/md';
import { useState } from 'react';

export function WalletConnect() {
  const { address, isConnected, isLoading, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (address) {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-neutral-400 hidden sm:inline">Connecting...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Wallet Info Card - Enhanced and Mobile Optimized */}
        <div className="group relative flex items-center gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-[#0a0a0a] to-[#111111] border border-[#1a1a1a] rounded-lg sm:rounded-xl hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-orange-500/20">
          {/* Animated glow on hover */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-600/0 to-orange-500/0 group-hover:from-orange-600/10 group-hover:to-orange-500/10 transition-all duration-300"></div>

          {/* Wallet Icon */}
          <div className="relative p-1.5 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110">
            <MdAccountBalanceWallet className="text-white w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </div>

          {/* Address - Shorter on mobile */}
          <span className="text-white font-mono text-xs sm:text-sm font-medium tracking-tight">
            {shortenAddress(address, 3, 3)}
          </span>

          {/* Copy Button - Hidden on very small screens */}
          <button
            type="button"
            onClick={handleCopy}
            className="hidden xs:block relative p-1.5 text-neutral-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all duration-200 hover:scale-110"
            title="Copy address"
            aria-label="Copy wallet address"
          >
            {copied ? (
              <MdCheckCircle size={14} className="text-green-400" />
            ) : (
              <MdContentCopy size={14} />
            )}
          </button>

          {/* Copied Notification */}
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-200 whitespace-nowrap z-50">
              ✓ Copied!
            </span>
          )}
        </div>

        {/* Disconnect Button - Smaller on mobile */}
        <button
          onClick={disconnect}
          className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg sm:rounded-xl border border-[#1a1a1a] hover:border-red-500/30 transition-all duration-200 hover:scale-105"
          title="Disconnect wallet"
          aria-label="Disconnect wallet"
        >
          <MdLogout className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      variant="primary"
      size="md"
      className="relative group overflow-hidden shadow-lg hover:shadow-orange-500/50"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex items-center gap-2">
        <MdAccountBalanceWallet size={20} />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </div>
    </Button>
  );
}

