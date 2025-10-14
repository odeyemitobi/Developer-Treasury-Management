// TypeScript types matching the treasury-core.clar smart contract

// ============================================================================
// CONTRACT CONSTANTS
// ============================================================================

export const ERROR_CODES = {
  ERR_NOT_AUTHORIZED: 100,
  ERR_ALREADY_MEMBER: 101,
  ERR_NOT_MEMBER: 102,
  ERR_INVALID_THRESHOLD: 103,
  ERR_PROPOSAL_NOT_FOUND: 104,
  ERR_PROPOSAL_EXPIRED: 105,
  ERR_ALREADY_VOTED: 106,
  ERR_INSUFFICIENT_APPROVALS: 107,
  ERR_PROPOSAL_ALREADY_EXECUTED: 108,
  ERR_INVALID_AMOUNT: 109,
  ERR_INSUFFICIENT_BALANCE: 110,
} as const;

export const ROLES = {
  ADMIN: 1,
  MEMBER: 2,
  VIEWER: 3,
} as const;

export const PROPOSAL_TYPES = {
  TRANSFER: 1,
  ADD_MEMBER: 2,
  REMOVE_MEMBER: 3,
  CHANGE_THRESHOLD: 4,
} as const;

export const PROPOSAL_DURATION = 1440; // blocks (~10 days)
export const MIN_THRESHOLD = 1;
export const MAX_MEMBERS = 20;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Role = typeof ROLES[keyof typeof ROLES];
export type ProposalType = typeof PROPOSAL_TYPES[keyof typeof PROPOSAL_TYPES];

export interface TreasuryInfo {
  name: string;
  threshold: number;
  memberCount: number;
  stxBalance: bigint;
  isInitialized: boolean;
}

export interface Member {
  address: string;
  role: Role;
  joinedAt: number;
  isActive: boolean;
}

export interface Proposal {
  proposalId: number;
  proposer: string;
  proposalType: ProposalType;
  target?: string;
  amount?: bigint;
  tokenContract?: string;
  newThreshold?: number;
  description: string;
  createdAt: number;
  expiresAt: number;
  executed: boolean;
  approvalCount: number;
}

export interface Vote {
  proposalId: number;
  voter: string;
  approved: boolean;
  votedAt: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRoleName(role: Role): string {
  switch (role) {
    case ROLES.ADMIN:
      return 'Admin';
    case ROLES.MEMBER:
      return 'Member';
    case ROLES.VIEWER:
      return 'Viewer';
    default:
      return 'Unknown';
  }
}

export function getRoleColor(role: Role): string {
  switch (role) {
    case ROLES.ADMIN:
      return 'bg-purple-600';
    case ROLES.MEMBER:
      return 'bg-blue-600';
    case ROLES.VIEWER:
      return 'bg-gray-600';
    default:
      return 'bg-gray-500';
  }
}

export function getProposalTypeName(type: ProposalType): string {
  switch (type) {
    case PROPOSAL_TYPES.TRANSFER:
      return 'STX Transfer';
    case PROPOSAL_TYPES.ADD_MEMBER:
      return 'Add Member';
    case PROPOSAL_TYPES.REMOVE_MEMBER:
      return 'Remove Member';
    case PROPOSAL_TYPES.CHANGE_THRESHOLD:
      return 'Change Threshold';
    default:
      return 'Unknown';
  }
}

export function getProposalTypeColor(type: ProposalType): string {
  switch (type) {
    case PROPOSAL_TYPES.TRANSFER:
      return 'bg-green-600';
    case PROPOSAL_TYPES.ADD_MEMBER:
      return 'bg-blue-600';
    case PROPOSAL_TYPES.REMOVE_MEMBER:
      return 'bg-red-600';
    case PROPOSAL_TYPES.CHANGE_THRESHOLD:
      return 'bg-yellow-600';
    default:
      return 'bg-gray-600';
  }
}

export function getErrorMessage(errorCode: number): string {
  switch (errorCode) {
    case ERROR_CODES.ERR_NOT_AUTHORIZED:
      return 'Not authorized to perform this action';
    case ERROR_CODES.ERR_ALREADY_MEMBER:
      return 'Address is already a member';
    case ERROR_CODES.ERR_NOT_MEMBER:
      return 'Address is not a member';
    case ERROR_CODES.ERR_INVALID_THRESHOLD:
      return 'Invalid threshold value';
    case ERROR_CODES.ERR_PROPOSAL_NOT_FOUND:
      return 'Proposal not found';
    case ERROR_CODES.ERR_PROPOSAL_EXPIRED:
      return 'Proposal has expired';
    case ERROR_CODES.ERR_ALREADY_VOTED:
      return 'You have already voted on this proposal';
    case ERROR_CODES.ERR_INSUFFICIENT_APPROVALS:
      return 'Insufficient approvals to execute';
    case ERROR_CODES.ERR_PROPOSAL_ALREADY_EXECUTED:
      return 'Proposal has already been executed';
    case ERROR_CODES.ERR_INVALID_AMOUNT:
      return 'Invalid amount';
    case ERROR_CODES.ERR_INSUFFICIENT_BALANCE:
      return 'Insufficient treasury balance';
    default:
      return `Error code: ${errorCode}`;
  }
}

