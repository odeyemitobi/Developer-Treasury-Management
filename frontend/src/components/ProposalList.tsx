'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useProposal, useProposalNonce } from '@/hooks/useTreasury';
import { useContractWrite } from '@/hooks/useContractWrite';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { Spinner } from './ui/Spinner';
import { EmptyState } from './ui/EmptyState';
import { Proposal, PROPOSAL_TYPES, getProposalTypeName, getProposalTypeColor } from '@/types/treasury';
import { formatStx, shortenAddress, canExecuteProposal } from '@/lib/utils';
import { MdThumbUp, MdThumbDown, MdPlayArrow, MdRefresh, MdDescription, MdAccessTime } from 'react-icons/md';

function ProposalCard({ proposal, onVote, onExecute, isLoading }: {
  proposal: Proposal;
  onVote: (proposalId: number, approve: boolean) => void;
  onExecute: (proposalId: number, type: number) => void;
  isLoading: boolean;
}) {
  const currentBlock = 1000; // In production, fetch from blockchain
  const threshold = 2; // In production, fetch from treasury info
  const canExecute = canExecuteProposal(
    proposal.approvalCount,
    threshold,
    proposal.executed,
    proposal.expiresAt,
    currentBlock
  );

  const isExpired = !proposal.executed && currentBlock >= proposal.expiresAt;
  const progressPercentage = Math.round((proposal.approvalCount / threshold) * 100);

  return (
    <div className="group relative">
      {/* Animated gradient border on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>

      <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#111111] border border-[#1a1a1a] rounded-xl p-5 sm:p-6 hover:border-orange-500/30 transition-all duration-300 shadow-lg hover:shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Proposal #{proposal.proposalId}
              </h3>
              <Badge className={`${getProposalTypeColor(proposal.proposalType)} shadow-lg`}>
                {getProposalTypeName(proposal.proposalType)}
              </Badge>
            </div>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">{proposal.description}</p>
          </div>

          <div className="flex sm:flex-col gap-2 sm:ml-4 flex-shrink-0">
            {proposal.executed && (
              <Badge variant="success" className="whitespace-nowrap shadow-lg shadow-green-500/20">
                ✓ Executed
              </Badge>
            )}
            {isExpired && (
              <Badge variant="danger" className="whitespace-nowrap shadow-lg shadow-red-500/20">
                ⏰ Expired
              </Badge>
            )}
            {!proposal.executed && !isExpired && (
              <Badge variant="warning" className="whitespace-nowrap shadow-lg shadow-amber-500/20">
                ⏳ Pending
              </Badge>
            )}
          </div>
        </div>

      {/* Progress Bar */}
      {!proposal.executed && (
        <div className="mb-5">
          <ProgressBar
            value={proposal.approvalCount}
            max={threshold}
            label="Approval Progress"
            color={progressPercentage >= 100 ? 'green' : 'orange'}
          />
        </div>
      )}

      {/* Details Grid - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-orange-500/20 transition-all duration-300">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Proposer</p>
          <p className="text-sm text-white font-mono">{shortenAddress(proposal.proposer, 6)}</p>
        </div>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-orange-500/20 transition-all duration-300">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Expires At</p>
          <p className="text-sm text-white font-semibold">Block #{proposal.expiresAt.toLocaleString()}</p>
        </div>
        {proposal.target && (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-orange-500/20 transition-all duration-300">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Target</p>
            <p className="text-sm text-white font-mono">{shortenAddress(proposal.target, 6)}</p>
          </div>
        )}
        {proposal.amount && (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-green-500/20 transition-all duration-300">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Amount</p>
            <p className="text-sm text-green-400 font-bold">{formatStx(proposal.amount, 2)} STX</p>
          </div>
        )}
        {proposal.newThreshold && (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-purple-500/20 transition-all duration-300">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">New Threshold</p>
            <p className="text-sm text-purple-400 font-bold">{proposal.newThreshold}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!proposal.executed && !isExpired && (
        <div className="flex flex-wrap gap-2 sm:gap-3 pt-5 border-t border-[#1a1a1a]">
          <Button
            variant="success"
            size="sm"
            onClick={() => onVote(proposal.proposalId, true)}
            isLoading={isLoading}
            className="flex-1 sm:flex-initial shadow-lg hover:shadow-green-500/30"
          >
            <MdThumbUp size={18} />
            <span>Approve</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onVote(proposal.proposalId, false)}
            isLoading={isLoading}
            className="flex-1 sm:flex-initial shadow-lg hover:shadow-red-500/30"
          >
            <MdThumbDown size={18} />
            <span>Reject</span>
          </Button>
          {canExecute && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onExecute(proposal.proposalId, proposal.proposalType)}
              isLoading={isLoading}
              className="w-full sm:w-auto sm:ml-auto shadow-lg hover:shadow-orange-500/30"
            >
              <MdPlayArrow size={18} />
              <span>Execute Proposal</span>
            </Button>
          )}
        </div>
      )}
    </div>
    </div>
  );
}

export function ProposalList() {
  const { address, userSession } = useWallet();
  const { nonce, refetch: refetchNonce } = useProposalNonce();
  const contractWrite = useContractWrite(userSession);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);

  // Fetch all proposals based on nonce
  useEffect(() => {
    const fetchProposals = async () => {
      if (nonce === 0) {
        setIsLoadingProposals(false);
        return;
      }

      setIsLoadingProposals(true);
      const proposalPromises = [];
      
      // Fetch last 10 proposals or all if less than 10
      const startId = Math.max(1, nonce - 9);
      for (let i = nonce; i >= startId; i--) {
        proposalPromises.push(
          fetch(`/api/proposal/${i}`).then(res => res.json()).catch(() => null)
        );
      }

      const results = await Promise.all(proposalPromises);
      setProposals(results.filter(p => p !== null));
      setIsLoadingProposals(false);
    };

    fetchProposals();
  }, [nonce]);

  const handleVote = async (proposalId: number, approve: boolean) => {
    await contractWrite.voteOnProposal(proposalId, approve);
    refetchNonce();
  };

  const handleExecute = async (proposalId: number, proposalType: number) => {
    if (proposalType === PROPOSAL_TYPES.TRANSFER) {
      await contractWrite.executeTransferProposal(proposalId);
    } else if (proposalType === PROPOSAL_TYPES.ADD_MEMBER) {
      await contractWrite.executeAddMemberProposal(proposalId);
    } else if (proposalType === PROPOSAL_TYPES.REMOVE_MEMBER) {
      await contractWrite.executeRemoveMemberProposal(proposalId);
    } else if (proposalType === PROPOSAL_TYPES.CHANGE_THRESHOLD) {
      await contractWrite.executeThresholdProposal(proposalId);
    }
    refetchNonce();
  };

  if (!address) {
    return (
      <Card title="Proposals" subtitle="Connect to view and vote" variant="elevated">
        <EmptyState
          icon={<MdDescription size={56} />}
          title="Wallet not connected"
          description="Connect your wallet to view and vote on proposals"
        />
      </Card>
    );
  }

  return (
    <Card
      title="Proposals"
      subtitle={`${nonce} total proposal${nonce !== 1 ? 's' : ''}`}
      variant="elevated"
      action={
        <Button onClick={refetchNonce} variant="ghost" size="sm" className="group/refresh">
          <MdRefresh size={20} className="group-hover/refresh:rotate-180 transition-transform duration-500" />
          <span className="hidden md:inline">Refresh</span>
        </Button>
      }
    >
      {isLoadingProposals ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Spinner size="lg" />
            <p className="text-neutral-400 text-sm">Loading proposals...</p>
          </div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            icon={<MdDescription size={56} />}
            title="No proposals yet"
            description="Create the first proposal to get started with treasury governance"
          />
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <p className="text-orange-300 text-sm leading-relaxed text-center">
              💡 <strong>Get started:</strong> Use the "Create Proposal" section to submit your first treasury action
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.proposalId}
              proposal={proposal}
              onVote={handleVote}
              onExecute={handleExecute}
              isLoading={contractWrite.isLoading}
            />
          ))}
        </div>
      )}

      {contractWrite.error && (
        <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm shadow-lg shadow-red-500/10">
          <p className="text-red-300 text-sm leading-relaxed">
            <strong className="font-bold">❌ Error:</strong> {contractWrite.error}
          </p>
        </div>
      )}
    </Card>
  );
}

