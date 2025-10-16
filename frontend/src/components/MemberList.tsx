'use client';

import { useMemberInfo } from '@/hooks/useTreasury';
import { useWallet } from '@/hooks/useWallet';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';
import { EmptyState } from './ui/EmptyState';
import { getRoleName, getRoleColor } from '@/types/treasury';
import { shortenAddress } from '@/lib/utils';
import { MdPerson, MdVerifiedUser, MdCheckCircle, MdShield, MdVisibility, MdGroups } from 'react-icons/md';

export function MemberList() {
  const { address } = useWallet();
  const { memberInfo, isLoading, error } = useMemberInfo(address);

  if (!address) {
    return (
      <Card title="Your Membership" subtitle="Connect to view your treasury role" variant="elevated">
        <EmptyState
          icon={<MdPerson size={56} />}
          title="Wallet not connected"
          description="Connect your wallet to view membership status"
        />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card title="Your Membership" variant="elevated">
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Spinner size="lg" />
            <p className="text-neutral-400 text-sm">Loading membership...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Your Membership" variant="elevated">
        <EmptyState
          icon={<MdPerson size={56} />}
          title="Error loading membership"
          description={error}
        />
      </Card>
    );
  }

  if (!memberInfo) {
    return (
      <Card title="Your Membership" subtitle="Request access to join" variant="elevated">
        <div className="space-y-6">
          <EmptyState
            icon={<MdGroups size={56} />}
            title="Not a member"
            description="You are not currently a member of this treasury"
          />

          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <p className="text-orange-300 text-sm leading-relaxed">
              💡 <strong>Want to join?</strong> Contact an existing admin to request membership through a proposal.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Role-specific icon
  const getRoleIcon = (role: number) => {
    if (role === 1) return <MdShield size={28} />;
    if (role === 2) return <MdVerifiedUser size={28} />;
    return <MdVisibility size={28} />;
  };

  return (
    <Card
      title="Your Membership"
      subtitle="Your role and permissions"
      variant="elevated"
      className="h-full"
    >
      <div className="space-y-6">
        {/* Member Header with Enhanced Design */}
        <div className="relative group">
          {/* Gradient background */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 blur transition-all duration-300"></div>

          <div className="relative flex items-start gap-4 p-5 bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-xl border border-[#1a1a1a]">
            {/* Role Icon */}
            <div className={`p-4 rounded-xl shadow-2xl bg-gradient-to-br ${
              memberInfo.role === 1
                ? 'from-orange-600 to-orange-500 shadow-orange-500/30'
                : memberInfo.role === 2
                ? 'from-purple-600 to-purple-500 shadow-purple-500/30'
                : 'from-amber-600 to-amber-500 shadow-amber-500/30'
            }`}>
              <div className="text-white">
                {getRoleIcon(memberInfo.role)}
              </div>
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Your Address</p>
              <p className="text-base sm:text-lg font-mono font-bold text-white truncate">
                {shortenAddress(address, 6, 6)}
              </p>

              {/* Role Badge */}
              <Badge className={`${getRoleColor(memberInfo.role)} shadow-lg`}>
                <span className="font-bold text-sm">{getRoleName(memberInfo.role)}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group relative p-4 bg-gradient-to-br from-[#0a0a0a] to-[#111111] border border-[#1a1a1a] rounded-xl hover:border-orange-500/30 transition-all duration-300">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Joined At</p>
            <p className="text-xl font-bold text-white">
              #{memberInfo.joinedAt.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-400 mt-1">Block height</p>
          </div>

          <div className="group relative p-4 bg-gradient-to-br from-[#0a0a0a] to-[#111111] border border-[#1a1a1a] rounded-xl hover:border-green-500/30 transition-all duration-300">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Status</p>
            <div className="flex items-center gap-2">
              {memberInfo.isActive ? (
                <>
                  <MdCheckCircle size={24} className="text-green-400" />
                  <span className="text-xl font-bold text-green-400">Active</span>
                </>
              ) : (
                <span className="text-xl font-bold text-red-400">Inactive</span>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Card - Enhanced */}
        <div className="relative p-5 bg-gradient-to-br from-[#0a0a0a] to-[#111111] border border-[#1a1a1a] rounded-xl">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <MdCheckCircle size={20} className="text-orange-400" />
            <span>Your Permissions</span>
          </h4>

          <div className="space-y-3">
            {memberInfo.role <= 2 && (
              <>
                <div className="flex items-center gap-3 text-sm text-neutral-300 group/perm hover:text-white transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50 group-hover/perm:scale-125 transition-transform"></div>
                  <span className="font-medium">Create and propose new actions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300 group/perm hover:text-white transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50 group-hover/perm:scale-125 transition-transform"></div>
                  <span className="font-medium">Vote on active proposals</span>
                </div>
              </>
            )}

            {memberInfo.role === 1 && (
              <>
                <div className="flex items-center gap-3 text-sm text-neutral-300 group/perm hover:text-white transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 group-hover/perm:scale-125 transition-transform"></div>
                  <span className="font-medium">Propose member removal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300 group/perm hover:text-white transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 group-hover/perm:scale-125 transition-transform"></div>
                  <span className="font-medium">Propose threshold changes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300 group/perm hover:text-white transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 group-hover/perm:scale-125 transition-transform"></div>
                  <span className="font-medium">Full administrative access</span>
                </div>
              </>
            )}

            {memberInfo.role === 3 && (
              <div className="flex items-center gap-3 text-sm text-neutral-400 group/perm hover:text-neutral-300 transition-colors">
                <div className="w-2 h-2 bg-neutral-500 rounded-full group-hover/perm:scale-125 transition-transform"></div>
                <span className="font-medium">View-only access (no voting rights)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

