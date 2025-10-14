'use client';

import { useTreasuryInfo } from '@/hooks/useTreasury';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatStx } from '@/lib/utils';
import { MdAccountBalance, MdPeople, MdVerifiedUser, MdRefresh } from 'react-icons/md';
import { Button } from './ui/Button';

export function TreasuryOverview() {
  const { treasuryInfo, isLoading, error, refetch } = useTreasuryInfo();

  if (isLoading) {
    return (
      <Card title="Treasury Overview">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Treasury Overview">
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={refetch} variant="secondary" size="sm">
            <MdRefresh size={18} />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!treasuryInfo) {
    return (
      <Card title="Treasury Overview">
        <div className="text-center py-8">
          <p className="text-gray-400">No treasury data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Treasury Overview"
      subtitle={treasuryInfo.name}
      action={
        <Button onClick={refetch} variant="ghost" size="sm">
          <MdRefresh size={18} />
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Balance */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MdAccountBalance size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-2xl font-bold text-white">
                {formatStx(treasuryInfo.stxBalance, 2)} STX
              </p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <MdPeople size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Members</p>
              <p className="text-2xl font-bold text-white">
                {treasuryInfo.memberCount}
              </p>
            </div>
          </div>
        </div>

        {/* Threshold */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <MdVerifiedUser size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Approval Threshold</p>
              <p className="text-2xl font-bold text-white">
                {treasuryInfo.threshold}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <p className="text-sm text-gray-400 mb-2">Status</p>
              {treasuryInfo.isInitialized ? (
                <Badge variant="success">Initialized</Badge>
              ) : (
                <Badge variant="warning">Not Initialized</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

