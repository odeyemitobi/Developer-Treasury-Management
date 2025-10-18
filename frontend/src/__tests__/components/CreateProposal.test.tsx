import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CreateProposal } from '@/components/CreateProposal';

// Mock the hooks
vi.mock('@/hooks/useTreasuryInfo', () => ({
  useTreasuryInfo: vi.fn(() => ({
    treasuryName: 'Test Treasury',
    balance: '1000000',
    threshold: 2,
    memberCount: 3,
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/useContractWrite', () => ({
  useContractWrite: vi.fn(() => ({
    proposeTransfer: vi.fn(),
    isLoading: false,
    error: null,
  })),
}));

describe('CreateProposal Component', () => {
  it('should render create proposal form', () => {
    render(<CreateProposal />);
    expect(screen.getByText('Create Proposal')).toBeInTheDocument();
  });

  it('should display component structure', () => {
    const { container } = render(<CreateProposal />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<CreateProposal />);
    const card = container.querySelector('.rounded-lg');
    expect(card).toBeInTheDocument();
  });
});

