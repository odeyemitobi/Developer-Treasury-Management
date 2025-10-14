'use client';

import { useMemberInfo } from '@/hooks/useTreasury';
import { useWallet } from '@/hooks/useWallet';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { getRoleName, getRoleColor } from '@/types/treasury';
import { shortenAddress } from '@/lib/utils';
import { MdPerson, MdVerifiedUser } from 'react-icons/md';

export function MemberList() {
  const { address } = useWallet();
  const { memberInfo, isLoading, error } = useMemberInfo(address);

  if (!address) {
    return (
      <Card title="Your Membership">
        <div className="text-center py-8">
          <p className="text-gray-400">Connect your wallet to view membership status</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card title="Your Membership">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Your Membership">
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      </Card>
    );
  }

  if (!memberInfo) {
    return (
      <Card title="Your Membership">
        <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-700">
          <MdPerson size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 mb-2">You are not a member of this treasury</p>
          <p className="text-sm text-gray-500">
            Contact an admin to request membership
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Your Membership">
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <MdVerifiedUser size={32} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p className="text-lg font-mono text-white">{shortenAddress(address, 6)}</p>
            </div>
          </div>
          <Badge className={getRoleColor(memberInfo.role)}>
            {getRoleName(memberInfo.role)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700">
          <div>
            <p className="text-sm text-gray-400 mb-1">Joined At Block</p>
            <p className="text-white font-semibold">#{memberInfo.joinedAt.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            {memberInfo.isActive ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="danger">Inactive</Badge>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Permissions</p>
          <div className="space-y-2">
            {memberInfo.role <= 2 && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Can create proposals
              </div>
            )}
            {memberInfo.role <= 2 && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Can vote on proposals
              </div>
            )}
            {memberInfo.role === 1 && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Can propose member removal
              </div>
            )}
            {memberInfo.role === 1 && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Can propose threshold changes
              </div>
            )}
            {memberInfo.role === 3 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                View-only access
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

