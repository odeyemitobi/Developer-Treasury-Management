import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  shortenAddress,
  copyToClipboard,
  formatStx,
  stxToMicroStx,
  isValidStacksAddress,
  isProposalExpired,
  canExecuteProposal,
  cn,
  parseContractError
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('shortenAddress', () => {
    it('should shorten address with default parameters', () => {
      const address = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY6AXVT32AUYP';
      const result = shortenAddress(address);

      expect(result).toContain('...');
      expect(result.length).toBeLessThan(address.length);
    });

    it('should shorten address with custom chars', () => {
      const address = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY6AXVT32AUYP';
      const result = shortenAddress(address, 6);

      expect(result).toContain('...');
    });

    it('should return original address if too short', () => {
      const address = 'SHORT';
      const result = shortenAddress(address, 4);

      expect(result).toBe(address);
    });

    it('should handle empty address', () => {
      const result = shortenAddress('');
      expect(result).toBe('');
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should copy text to clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      await copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should handle empty string', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      await copyToClipboard('');

      expect(mockWriteText).toHaveBeenCalledWith('');
    });
  });

  describe('formatStx', () => {
    it('should format STX amount correctly', () => {
      const result = formatStx(1000000);
      expect(result).toBe('1');
    });

    it('should handle zero amount', () => {
      const result = formatStx(0);
      expect(result).toBe('0');
    });

    it('should handle large amounts', () => {
      const result = formatStx(1000000000);
      expect(result).toBe('1,000');
    });

    it('should handle decimal amounts', () => {
      const result = formatStx(1500000);
      expect(result).toContain('1.5');
    });

    it('should handle custom decimals', () => {
      const result = formatStx(1234567, 2);
      expect(result).toContain('1.23');
    });
  });

  describe('stxToMicroStx', () => {
    it('should convert STX to microSTX', () => {
      const result = stxToMicroStx(1);
      expect(result).toBe(BigInt(1000000));
    });

    it('should handle decimal STX', () => {
      const result = stxToMicroStx(1.5);
      expect(result).toBe(BigInt(1500000));
    });

    it('should handle zero', () => {
      const result = stxToMicroStx(0);
      expect(result).toBe(BigInt(0));
    });
  });

  describe('isValidStacksAddress', () => {
    it('should validate correct SP address', () => {
      const address = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY6AXVT32AUYP';
      expect(isValidStacksAddress(address)).toBe(true);
    });

    it('should validate correct ST address', () => {
      const address = 'ST2PABAF9FTAJYNFZH93XENAJ8FVY6AXVT32AUYP';
      expect(isValidStacksAddress(address)).toBe(true);
    });

    it('should reject invalid address', () => {
      expect(isValidStacksAddress('INVALID')).toBe(false);
    });

    it('should reject empty address', () => {
      expect(isValidStacksAddress('')).toBe(false);
    });
  });

  describe('isProposalExpired', () => {
    it('should return false if not expired', () => {
      expect(isProposalExpired(100, 50)).toBe(false);
    });

    it('should return true if expired', () => {
      expect(isProposalExpired(50, 100)).toBe(true);
    });

    it('should return true if at expiration', () => {
      expect(isProposalExpired(50, 50)).toBe(true);
    });
  });

  describe('canExecuteProposal', () => {
    it('should allow execution when conditions met', () => {
      expect(canExecuteProposal(2, 2, false, 100, 50)).toBe(true);
    });

    it('should prevent execution if already executed', () => {
      expect(canExecuteProposal(2, 2, true, 100, 50)).toBe(false);
    });

    it('should prevent execution if insufficient approvals', () => {
      expect(canExecuteProposal(1, 2, false, 100, 50)).toBe(false);
    });

    it('should prevent execution if expired', () => {
      expect(canExecuteProposal(2, 2, false, 50, 100)).toBe(false);
    });
  });

  describe('cn', () => {
    it('should combine class names', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      const result = cn('class1', false, 'class2', undefined, null, 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  describe('parseContractError', () => {
    it('should parse string error', () => {
      const result = parseContractError('Error message');
      expect(result).toBe('Error message');
    });

    it('should parse error object with message', () => {
      const result = parseContractError({ message: 'Error message' });
      expect(result).toBe('Error message');
    });

    it('should handle unknown error', () => {
      const result = parseContractError({});
      expect(result).toBeDefined();
    });
  });
});

