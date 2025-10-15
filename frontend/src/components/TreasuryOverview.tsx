'use client';

import { useTreasuryInfo } from '@/hooks/useTreasury';
import { Card } from './ui/Card';
import { StatCard } from './ui/StatCard';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';
import { EmptyState } from './ui/EmptyState';
import { formatStx } from '@/lib/utils';
import { MdAccountBalance, MdPeople, MdVerifiedUser, MdRefresh, MdCheckCircle, MdTrendingUp } from 'react-icons/md';
import { Button } from './ui/Button';

export function TreasuryOverview() {
  const { treasuryInfo, isLoading, error, refetch } = useTreasuryInfo();

  if (isLoading) {
    return (
      <Card title="Treasury Overview" variant="elevated">
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Spinner size="lg" />
            <p className="text-neutral-400 text-sm">Loading treasury data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Treasury Overview" variant="elevated">
        <EmptyState
          icon={<MdRefresh size={64} />}
          title="Failed to load treasury data"
          description={error}
          action={
            <Button onClick={refetch} variant="primary" size="sm">
              <MdRefresh size={18} />
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  if (!treasuryInfo) {
    return (
      <Card title="Treasury Overview" variant="elevated">
        <EmptyState
          icon={<MdAccountBalance size={64} />}
          title="No treasury data available"
          description="Initialize the treasury to get started"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Card - Enhanced with gradient */}
      <div className="relative group">
        {/* Animated gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all duration-300"></div>

        <Card variant="glass" className="relative bg-gradient-to-br from-[#0a0a0a] to-[#111111]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-3">
              {/* Treasury Name with gradient text */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent truncate">
                {treasuryInfo.name}
              </h2>

              {/* Status badges */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {treasuryInfo.isInitialized ? (
                  <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1.5 shadow-lg shadow-green-500/20">
                    <MdCheckCircle size={16} />
                    <span className="font-semibold">Active Treasury</span>
                  </Badge>
                ) : (
                  <Badge variant="warning" className="px-3 py-1.5 shadow-lg shadow-amber-500/20">
                    <span className="font-semibold">Not Initialized</span>
                  </Badge>
                )}

                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                  <MdPeople size={16} className="text-blue-400" />
                  <span className="text-sm text-neutral-300 font-medium">
                    {treasuryInfo.memberCount} member{treasuryInfo.memberCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={refetch}
              variant="ghost"
              size="sm"
              className="self-end sm:self-auto group/refresh"
            >
              <MdRefresh size={20} className="group-hover/refresh:rotate-180 transition-transform duration-500" />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Stats Grid - Enhanced with better responsive design */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {/* Total Balance - Most Important Stat */}
        <div className="xs:col-span-2 lg:col-span-1">
          <StatCard
            label="Total Balance"
            value={`${formatStx(treasuryInfo.stxBalance, 2)} STX`}
            icon={<MdAccountBalance className="text-white w-7 h-7 sm:w-8 sm:h-8" />}
            iconColor="blue"
            trend={{
              value: '12.5%',
              isPositive: true,
              icon: <MdTrendingUp size={16} />
            }}
            className="h-full"
          />
        </div>

        {/* Active Members */}
        <StatCard
          label="Active Members"
          value={treasuryInfo.memberCount}
          icon={<MdPeople className="text-white w-6 h-6 sm:w-7 sm:h-7" />}
          iconColor="purple"
          description={`${treasuryInfo.memberCount} voting member${treasuryInfo.memberCount !== 1 ? 's' : ''}`}
        />

        {/* Approval Threshold */}
        <StatCard
          label="Approval Threshold"
          value={`${treasuryInfo.threshold}/${treasuryInfo.memberCount}`}
          icon={<MdVerifiedUser className="text-white w-6 h-6 sm:w-7 sm:h-7" />}
          iconColor="green"
          description={`${treasuryInfo.threshold} approval${treasuryInfo.threshold !== 1 ? 's' : ''} required`}
        />

        {/* Treasury Status */}
        <StatCard
          label="Treasury Status"
          value={treasuryInfo.isInitialized ? 'Active' : 'Inactive'}
          icon={<MdCheckCircle className="text-white w-6 h-6 sm:w-7 sm:h-7" />}
          iconColor={treasuryInfo.isInitialized ? 'green' : 'amber'}
          description={treasuryInfo.isInitialized ? 'Fully operational' : 'Awaiting initialization'}
        />
      </div>
    </div>
  );
}

