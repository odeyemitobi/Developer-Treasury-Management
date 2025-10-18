'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import {
  uintCV,
  principalCV,
  stringAsciiCV,
  boolCV,
  PostConditionMode,
} from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, CONTRACT_FUNCTIONS, NETWORK } from '@/lib/contract';

interface ContractCallData {
  txId: string;
}

export function useContractWrite() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proposeStxTransfer = async (
    recipient: string,
    amount: bigint,
    description: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.PROPOSE_STX_TRANSFER,
        functionArgs: [
          principalCV(recipient),
          uintCV(amount),
          stringAsciiCV(description),
        ],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to propose transfer');
      console.error('Error proposing transfer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const proposeAddMember = async (
    newMember: string,
    role: number,
    description: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.PROPOSE_ADD_MEMBER,
        functionArgs: [
          principalCV(newMember),
          uintCV(role),
          stringAsciiCV(description),
        ],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to propose add member');
      console.error('Error proposing add member:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const proposeRemoveMember = async (
    targetMember: string,
    description: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.PROPOSE_REMOVE_MEMBER,
        functionArgs: [
          principalCV(targetMember),
          stringAsciiCV(description),
        ],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to propose remove member');
      console.error('Error proposing remove member:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const proposeThresholdChange = async (
    newThreshold: number,
    description: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.PROPOSE_THRESHOLD_CHANGE,
        functionArgs: [
          uintCV(newThreshold),
          stringAsciiCV(description),
        ],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to propose threshold change');
      console.error('Error proposing threshold change:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const voteOnProposal = async (proposalId: number, approve: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.VOTE_ON_PROPOSAL,
        functionArgs: [
          uintCV(proposalId),
          boolCV(approve),
        ],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to vote on proposal');
      console.error('Error voting on proposal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeTransferProposal = async (proposalId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.EXECUTE_TRANSFER_PROPOSAL,
        functionArgs: [uintCV(proposalId)],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to execute transfer proposal');
      console.error('Error executing transfer proposal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAddMemberProposal = async (proposalId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.EXECUTE_ADD_MEMBER_PROPOSAL,
        functionArgs: [uintCV(proposalId)],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to execute add member proposal');
      console.error('Error executing add member proposal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeRemoveMemberProposal = async (proposalId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.EXECUTE_REMOVE_MEMBER_PROPOSAL,
        functionArgs: [uintCV(proposalId)],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to execute remove member proposal');
      console.error('Error executing remove member proposal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeThresholdProposal = async (proposalId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.EXECUTE_THRESHOLD_PROPOSAL,
        functionArgs: [uintCV(proposalId)],
        network: NETWORK,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data: ContractCallData) => {
          console.log('Transaction submitted:', data.txId);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to execute threshold proposal');
      console.error('Error executing threshold proposal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    proposeStxTransfer,
    proposeAddMember,
    proposeRemoveMember,
    proposeThresholdChange,
    voteOnProposal,
    executeTransferProposal,
    executeAddMemberProposal,
    executeRemoveMemberProposal,
    executeThresholdProposal,
  };
}

