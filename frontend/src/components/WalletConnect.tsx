'use client';

import { useWallet } from '@/hooks/useWallet';
import { Button } from './ui/Button';
import { shortenAddress, copyToClipboard } from '@/lib/utils';
import { MdAccountBalanceWallet, MdContentCopy, MdLogout } from 'react-icons/md';
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
      <Button variant="secondary" disabled>
        <MdAccountBalanceWallet size={20} />
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
          <MdAccountBalanceWallet size={20} className="text-blue-400" />
          <span className="text-white font-mono text-sm">
            {shortenAddress(address)}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors"
            title="Copy address"
          >
            <MdContentCopy size={16} />
          </button>
          {copied && (
            <span className="text-xs text-green-400">Copied!</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnect}
          title="Disconnect wallet"
        >
          <MdLogout size={18} />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connect} variant="primary">
      <MdAccountBalanceWallet size={20} />
      Connect Wallet
    </Button>
  );
}

