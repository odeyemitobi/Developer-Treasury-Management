// Contract configuration and network settings

import { STACKS_TESTNET } from '@stacks/network';
import type { StacksNetwork } from '@stacks/network';

// Contract details
// Deployed to testnet with Xverse wallet
export const CONTRACT_ADDRESS = 'ST5EAVJBC71RBNWJF7Z5P7WJT73GFVQS48XXD8B0';
export const CONTRACT_NAME = 'treasury-core';

// Network configuration
// IMPORTANT: Choose the correct network for your environment
// - STACKS_DEVNET: For local Clarinet devnet (requires Docker)
// - STACKS_TESTNET: For public testnet (no Docker needed!)
// - STACKS_MAINNET: For production deployment
export const NETWORK: StacksNetwork = STACKS_TESTNET;

// App configuration for Stacks Connect
export const APP_CONFIG = {
  name: 'Developer Treasury Management',
  icon: '/logo.png', // Add your logo
};

// Contract function names
export const CONTRACT_FUNCTIONS = {
  // Public functions
  INITIALIZE: 'initialize',
  PROPOSE_ADD_MEMBER: 'propose-add-member',
  PROPOSE_REMOVE_MEMBER: 'propose-remove-member',
  PROPOSE_STX_TRANSFER: 'propose-stx-transfer',
  PROPOSE_THRESHOLD_CHANGE: 'propose-threshold-change',
  VOTE_ON_PROPOSAL: 'vote-on-proposal',
  EXECUTE_TRANSFER_PROPOSAL: 'execute-transfer-proposal',
  EXECUTE_ADD_MEMBER_PROPOSAL: 'execute-add-member-proposal',
  EXECUTE_REMOVE_MEMBER_PROPOSAL: 'execute-remove-member-proposal',
  EXECUTE_THRESHOLD_PROPOSAL: 'execute-threshold-proposal',
  
  // Read-only functions
  GET_TREASURY_INFO: 'get-treasury-info',
  GET_MEMBER_INFO: 'get-member-info',
  GET_PROPOSAL: 'get-proposal',
  GET_VOTE: 'get-vote',
  IS_MEMBER: 'is-member',
  HAS_ROLE_CHECK: 'has-role-check',
  GET_PROPOSAL_NONCE: 'get-proposal-nonce',
  CAN_EXECUTE_PROPOSAL: 'can-execute-proposal',
} as const;

