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
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-neutral-400 hidden sm:inline">Connecting...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Wallet Info Card - Enhanced */}
        <div className="group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-[#0a0a0a] to-[#111111] border border-[#1a1a1a] rounded-xl hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
          {/* Animated glow on hover */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600/0 to-blue-500/0 group-hover:from-blue-600/10 group-hover:to-blue-500/10 transition-all duration-300"></div>

          {/* Wallet Icon */}
          <div className="relative p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
            <MdAccountBalanceWallet size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
          </div>

          {/* Address */}
          <span className="text-white font-mono text-xs sm:text-sm font-medium tracking-tight">
            {shortenAddress(address, 4, 4)}
          </span>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="relative p-1.5 text-neutral-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all duration-200 hover:scale-110"
            title="Copy address"
            aria-label="Copy wallet address"
          >
            {copied ? (
              <MdCheckCircle size={16} className="text-green-400" />
            ) : (
              <MdContentCopy size={16} />
            )}
          </button>

          {/* Copied Notification */}
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-200">
              ✓ Copied!
            </span>
          )}
        </div>

        {/* Disconnect Button */}
        <button
          onClick={disconnect}
          className="p-2 sm:p-2.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-[#1a1a1a] hover:border-red-500/30 transition-all duration-200 hover:scale-105"
          title="Disconnect wallet"
          aria-label="Disconnect wallet"
        >
          <MdLogout size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      variant="primary"
      size="md"
      className="relative group overflow-hidden shadow-lg hover:shadow-blue-500/50"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex items-center gap-2">
        <MdAccountBalanceWallet size={20} />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </div>
    </Button>
  );
}

