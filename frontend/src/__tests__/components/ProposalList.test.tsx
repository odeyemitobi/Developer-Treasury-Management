import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProposalList } from '@/components/ProposalList';

// Mock the hooks
vi.mock('@/hooks/useTreasuryInfo', () => ({
  useTreasuryInfo: vi.fn(() => ({
    treasuryName: 'Test Treasury',
    balance: '1000000',
    threshold: 2,
    memberCount: 3,
    proposals: [
      { id: 1, type: 1, status: 'pending' },
      { id: 2, type: 2, status: 'executed' },
    ],
    isLoading: false,
    error: null,
  })),
}));

describe('ProposalList Component', () => {
  it('should render proposal list', () => {
    render(<ProposalList />);
    expect(screen.getByText('Proposals')).toBeInTheDocument();
  });

  it('should display proposals', () => {
    render(<ProposalList />);
    const component = screen.getByText('Proposals');
    expect(component).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    const { container } = render(<ProposalList />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

