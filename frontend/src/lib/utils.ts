// Utility functions for the treasury application

/**
 * Format microSTX to STX with proper decimal places
 * @param microStx Amount in microSTX (1 STX = 1,000,000 microSTX)
 * @param decimals Number of decimal places to show
 * @returns Formatted STX string
 */
export function formatStx(microStx: bigint | number, decimals: number = 6): string {
  const stx = Number(microStx) / 1_000_000;
  return stx.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Convert STX to microSTX
 * @param stx Amount in STX
 * @returns Amount in microSTX
 */
export function stxToMicroStx(stx: number): bigint {
  return BigInt(Math.floor(stx * 1_000_000));
}

/**
 * Shorten a Stacks address for display
 * @param address Full Stacks address
 * @param chars Number of characters to show on each side
 * @returns Shortened address
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Convert block height to estimated date
 * Assumes 10 minute block time
 * @param blockHeight Block height
 * @param currentBlock Current block height
 * @returns Estimated date
 */
export function blockToDate(blockHeight: number, currentBlock: number): Date {
  const blockDiff = blockHeight - currentBlock;
  const minutesDiff = blockDiff * 10; // 10 minutes per block
  const now = new Date();
  return new Date(now.getTime() + minutesDiff * 60 * 1000);
}

/**
 * Format a date relative to now
 * @param date Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    const absDays = Math.abs(diffDays);
    const absHours = Math.abs(diffHours);
    const absMins = Math.abs(diffMins);
    
    if (absDays > 0) return `${absDays} day${absDays > 1 ? 's' : ''} ago`;
    if (absHours > 0) return `${absHours} hour${absHours > 1 ? 's' : ''} ago`;
    if (absMins > 0) return `${absMins} minute${absMins > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  if (diffMins > 0) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  return 'now';
}

/**
 * Format a date to a readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if a proposal is expired
 * @param expiresAt Expiration block height
 * @param currentBlock Current block height
 * @returns True if expired
 */
export function isProposalExpired(expiresAt: number, currentBlock: number): boolean {
  return currentBlock >= expiresAt;
}

/**
 * Check if a proposal can be executed
 * @param approvalCount Current approval count
 * @param threshold Required threshold
 * @param executed Whether already executed
 * @param expiresAt Expiration block height
 * @param currentBlock Current block height
 * @returns True if can be executed
 */
export function canExecuteProposal(
  approvalCount: number,
  threshold: number,
  executed: boolean,
  expiresAt: number,
  currentBlock: number
): boolean {
  return (
    !executed &&
    approvalCount >= threshold &&
    !isProposalExpired(expiresAt, currentBlock)
  );
}

/**
 * Combine class names
 * @param classes Class names to combine
 * @returns Combined class string
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Copy text to clipboard
 * @param text Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Validate Stacks address format
 * @param address Address to validate
 * @returns True if valid
 */
export function isValidStacksAddress(address: string): boolean {
  // Basic validation: starts with SP or ST, followed by alphanumeric characters
  const regex = /^(SP|ST)[0-9A-Z]{38,41}$/;
  return regex.test(address);
}

/**
 * Parse contract error response
 * @param error Error object
 * @returns Error message
 */
export function parseContractError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  if (error && typeof error === 'object' && 'toString' in error) {
    return (error as { toString(): string }).toString();
  }
  return 'An unknown error occurred';
}

