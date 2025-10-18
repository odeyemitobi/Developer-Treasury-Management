'use client';

import { useState, useEffect, useCallback } from 'react';
import { cvToJSON, fetchCallReadOnlyFunction } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, CONTRACT_FUNCTIONS, NETWORK } from '@/lib/contract';
import { TreasuryInfo, Member, Proposal, Role, ProposalType } from '@/types/treasury';

export function useTreasuryInfo() {
  const [treasuryInfo, setTreasuryInfo] = useState<TreasuryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreasuryInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.GET_TREASURY_INFO,
        functionArgs: [],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const data = cvToJSON(result);

      if (data.value) {
        setTreasuryInfo({
          name: data.value.name.value,
          threshold: parseInt(data.value.threshold.value),
          memberCount: parseInt(data.value['member-count'].value),
          stxBalance: BigInt(data.value['stx-balance'].value),
          isInitialized: data.value['is-initialized'].value,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to fetch treasury info');
      console.error('Error fetching treasury info:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreasuryInfo();
  }, [fetchTreasuryInfo]);

  return { treasuryInfo, isLoading, error, refetch: fetchTreasuryInfo };
}

export function useMemberInfo(address: string | null) {
  const [memberInfo, setMemberInfo] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberInfo = useCallback(async () => {
    if (!address) {
      setMemberInfo(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { principalCV } = await import('@stacks/transactions');

      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.GET_MEMBER_INFO,
        functionArgs: [principalCV(address)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const data = cvToJSON(result);

      if (data.value) {
        setMemberInfo({
          address,
          role: parseInt(data.value.role.value) as Role,
          joinedAt: parseInt(data.value['joined-at'].value),
          isActive: data.value['is-active'].value,
        });
      } else {
        setMemberInfo(null);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to fetch member info');
      console.error('Error fetching member info:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchMemberInfo();
  }, [fetchMemberInfo]);

  return { memberInfo, isLoading, error, refetch: fetchMemberInfo };
}

export function useProposal(proposalId: number | null) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = useCallback(async () => {
    if (proposalId === null) {
      setProposal(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { uintCV } = await import('@stacks/transactions');

      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.GET_PROPOSAL,
        functionArgs: [uintCV(proposalId)],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const data = cvToJSON(result);

      if (data.value) {
        setProposal({
          proposalId,
          proposer: data.value.proposer.value,
          proposalType: parseInt(data.value['proposal-type'].value) as ProposalType,
          target: data.value.target.value?.value,
          amount: data.value.amount.value ? BigInt(data.value.amount.value.value) : undefined,
          tokenContract: data.value['token-contract'].value?.value,
          newThreshold: data.value['new-threshold'].value ? parseInt(data.value['new-threshold'].value.value) : undefined,
          description: data.value.description.value,
          createdAt: parseInt(data.value['created-at'].value),
          expiresAt: parseInt(data.value['expires-at'].value),
          executed: data.value.executed.value,
          approvalCount: parseInt(data.value['approval-count'].value),
        });
      } else {
        setProposal(null);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to fetch proposal');
      console.error('Error fetching proposal:', err);
    } finally {
      setIsLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return { proposal, isLoading, error, refetch: fetchProposal };
}

export function useProposalNonce() {
  const [nonce, setNonce] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNonce = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.GET_PROPOSAL_NONCE,
        functionArgs: [],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS,
      });

      const data = cvToJSON(result);
      setNonce(parseInt(data.value));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to fetch proposal nonce');
      console.error('Error fetching proposal nonce:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNonce();
  }, [fetchNonce]);

  return { nonce, isLoading, error, refetch: fetchNonce };
}

