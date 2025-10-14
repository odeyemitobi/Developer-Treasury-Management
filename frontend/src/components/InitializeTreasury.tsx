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
    } catch (err: any) {
      setError(err.message || 'Failed to initialize treasury');
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
      <Card
        title="Treasury Initialized! 🎉"
        subtitle="Your treasury has been successfully initialized"
      >
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">
              The transaction has been submitted to the blockchain. It may take a few moments to be confirmed.
            </p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Treasury Name:</span>
              <span className="text-white font-medium">{formData.treasuryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Approval Threshold:</span>
              <span className="text-white font-medium">{formData.threshold}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Founding Member:</span>
              <span className="text-white font-mono text-xs">{formData.foundingMember}</span>
            </div>
          </div>

          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            className="w-full"
          >
            Refresh Page
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Initialize Treasury"
      subtitle="Set up your treasury with initial configuration"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            <strong>Note:</strong> The treasury can only be initialized once. Make sure all details are correct before submitting.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={!isConnected || isLoading}
          isLoading={isLoading}
          className="w-full"
        >
          <MdRocketLaunch className="mr-2" />
          Initialize Treasury
        </Button>

        {!isConnected && (
          <p className="text-sm text-gray-400 text-center">
            Please connect your wallet to initialize the treasury
          </p>
        )}
      </form>
    </Card>
  );
}

