import { NextRequest, NextResponse } from 'next/server';
import { fetchCallReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, CONTRACT_FUNCTIONS, NETWORK } from '@/lib/contract';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = parseInt(params.id);

    if (isNaN(proposalId) || proposalId < 1) {
      return NextResponse.json(
        { error: 'Invalid proposal ID' },
        { status: 400 }
      );
    }

    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: CONTRACT_FUNCTIONS.GET_PROPOSAL,
      functionArgs: [uintCV(proposalId)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    const data = cvToJSON(result);

    if (!data.value) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const proposal = {
      proposalId,
      proposer: data.value.proposer.value,
      proposalType: parseInt(data.value['proposal-type'].value),
      target: data.value.target.value?.value,
      amount: data.value.amount.value ? BigInt(data.value.amount.value.value).toString() : undefined,
      tokenContract: data.value['token-contract'].value?.value,
      newThreshold: data.value['new-threshold'].value ? parseInt(data.value['new-threshold'].value.value) : undefined,
      description: data.value.description.value,
      createdAt: parseInt(data.value['created-at'].value),
      expiresAt: parseInt(data.value['expires-at'].value),
      executed: data.value.executed.value,
      approvalCount: parseInt(data.value['approval-count'].value),
    };

    return NextResponse.json(proposal);
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

