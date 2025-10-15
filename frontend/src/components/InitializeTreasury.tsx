'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { stringAsciiCV, uintCV, principalCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK } from '@/lib/contract';
import { useWallet } from '@/hooks/useWallet';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { MdRocketLaunch } from 'react-icons/md';

export default function InitializeTreasury() {
  const { address, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    treasuryName: 'Developer Treasury',
    threshold: '2',
    foundingMember: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    // Validation
    if (!formData.treasuryName.trim()) {
      setError('Treasury name is required');
      return;
    }

    const threshold = parseInt(formData.threshold);
    if (isNaN(threshold) || threshold < 1) {
      setError('Threshold must be at least 1');
      return;
    }

    if (!formData.foundingMember.trim()) {
      setError('Founding member address is required');
      return;
    }

    // Validate Stacks address format
    if (!formData.foundingMember.startsWith('ST') && !formData.foundingMember.startsWith('SP')) {
      setError('Invalid Stacks address format');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'initialize',
        functionArgs: [
          stringAsciiCV(formData.treasuryName),
          uintCV(threshold),
          principalCV(formData.foundingMember),
        ],
        onFinish: (data) => {
          console.log('Transaction submitted:', data);
          setSuccess(true);
          setIsLoading(false);
        },
        onCancel: () => {
          setIsLoading(false);
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initialize treasury');
      setIsLoading(false);
      console.error('Error initializing treasury:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="relative group">
        {/* Animated gradient border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl opacity-30 blur-xl animate-pulse"></div>

        <Card
          title="🎉 Treasury Initialized!"
          subtitle="Your treasury has been successfully initialized"
          className="relative"
        >
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm shadow-lg shadow-green-500/10">
              <p className="text-green-300 text-sm sm:text-base leading-relaxed">
                ✅ <strong className="font-bold">Success!</strong> The transaction has been submitted to the blockchain. It may take a few moments to be confirmed.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-4 bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-xl border border-[#1a1a1a] hover:border-blue-500/30 transition-all duration-300">
                <span className="text-neutral-400 font-medium">Treasury Name:</span>
                <span className="text-white font-bold">{formData.treasuryName}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-xl border border-[#1a1a1a] hover:border-blue-500/30 transition-all duration-300">
                <span className="text-neutral-400 font-medium">Approval Threshold:</span>
                <span className="text-white font-bold">{formData.threshold}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-xl border border-[#1a1a1a] hover:border-blue-500/30 transition-all duration-300">
                <span className="text-neutral-400 font-medium">Founding Member:</span>
                <span className="text-white font-mono text-xs">{formData.foundingMember}</span>
              </div>
            </div>

            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              className="w-full shadow-xl hover:shadow-blue-500/50"
            >
              <MdRocketLaunch size={20} />
              Refresh Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-300"></div>

      <Card
        title="Initialize Treasury"
        subtitle="Set up your treasury with initial configuration"
        className="relative"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Treasury Name"
            name="treasuryName"
            value={formData.treasuryName}
            onChange={handleChange}
            placeholder="e.g., Developer Treasury"
            required
            helperText="A descriptive name for your treasury"
          />

          <Input
            label="Approval Threshold"
            name="threshold"
            type="number"
            min="1"
            value={formData.threshold}
            onChange={handleChange}
            placeholder="e.g., 2"
            required
            helperText="Number of approvals required to execute proposals"
          />

          <Input
            label="Founding Member Address"
            name="foundingMember"
            value={formData.foundingMember}
            onChange={handleChange}
            placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
            required
            helperText="Stacks address of the first admin member"
          />

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm shadow-lg shadow-red-500/10">
              <p className="text-red-300 text-sm leading-relaxed">
                <strong className="font-bold">❌ Error:</strong> {error}
              </p>
            </div>
          )}

          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl backdrop-blur-sm">
            <p className="text-blue-300 text-sm leading-relaxed">
              <strong className="font-bold">💡 Important:</strong> The treasury can only be initialized once. Make sure all details are correct before submitting.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={!isConnected || isLoading}
            isLoading={isLoading}
            className="w-full shadow-xl hover:shadow-blue-500/50"
          >
            <MdRocketLaunch size={20} />
            Initialize Treasury
          </Button>

          {!isConnected && (
            <p className="text-sm text-neutral-400 text-center">
              Please connect your wallet to initialize the treasury
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}

