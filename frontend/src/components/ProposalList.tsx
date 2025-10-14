'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useProposal, useProposalNonce } from '@/hooks/useTreasury';
import { useContractWrite } from '@/hooks/useContractWrite';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Proposal, PROPOSAL_TYPES, getProposalTypeName, getProposalTypeColor } from '@/types/treasury';
import { formatStx, shortenAddress, canExecuteProposal } from '@/lib/utils';
import { MdThumbUp, MdThumbDown, MdPlayArrow, MdRefresh } from 'react-icons/md';

function ProposalCard({ proposal, onVote, onExecute, isLoading }: {
  proposal: Proposal;
  onVote: (proposalId: number, approve: boolean) => void;
  onExecute: (proposalId: number, type: number) => void;
  isLoading: boolean;
}) {
  const currentBlock = 1000; // In production, fetch from blockchain
  const canExecute = canExecuteProposal(
    proposal.approvalCount,
    2, // In production, fetch from treasury info
    proposal.executed,
    proposal.expiresAt,
    currentBlock
  );

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">
              Proposal #{proposal.proposalId}
            </h3>
            <Badge className={getProposalTypeColor(proposal.proposalType)}>
              {getProposalTypeName(proposal.proposalType)}
            </Badge>
            {proposal.executed && (
              <Badge variant="success">Executed</Badge>
            )}
            {!proposal.executed && currentBlock >= proposal.expiresAt && (
              <Badge variant="danger">Expired</Badge>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-3">{proposal.description}</p>
        </div>
      </div>

      {/* Proposal Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-700">
        <div>
          <p className="text-xs text-gray-500 mb-1">Proposer</p>
          <p className="text-sm text-white font-mono">{shortenAddress(proposal.proposer)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Approvals</p>
          <p className="text-sm text-white font-semibold">{proposal.approvalCount}</p>
        </div>
        {proposal.target && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Target</p>
            <p className="text-sm text-white font-mono">{shortenAddress(proposal.target)}</p>
          </div>
        )}
        {proposal.amount && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className="text-sm text-white font-semibold">{formatStx(proposal.amount, 2)} STX</p>
          </div>
        )}
        {proposal.newThreshold && (
          <div>
            <p className="text-xs text-gray-500 mb-1">New Threshold</p>
            <p className="text-sm text-white font-semibold">{proposal.newThreshold}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!proposal.executed && currentBlock < proposal.expiresAt && (
        <div className="flex gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={() => onVote(proposal.proposalId, true)}
            isLoading={isLoading}
          >
            <MdThumbUp size={16} />
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onVote(proposal.proposalId, false)}
            isLoading={isLoading}
          >
            <MdThumbDown size={16} />
            Reject
          </Button>
          {canExecute && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onExecute(proposal.proposalId, proposal.proposalType)}
              isLoading={isLoading}
              className="ml-auto"
            >
              <MdPlayArrow size={16} />
              Execute
            </Button>
          )}
        </div>
      )}
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
      <Card title="Proposals">
        <div className="text-center py-8">
          <p className="text-gray-400">Connect your wallet to view proposals</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Proposals"
      subtitle={`${nonce} total proposal${nonce !== 1 ? 's' : ''}`}
      action={
        <Button onClick={refetchNonce} variant="ghost" size="sm">
          <MdRefresh size={18} />
        </Button>
      }
    >
      {isLoadingProposals ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400">No proposals yet</p>
          <p className="text-sm text-gray-500 mt-2">Create the first proposal to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
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
        <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{contractWrite.error}</p>
        </div>
      )}
    </Card>
  );
}

