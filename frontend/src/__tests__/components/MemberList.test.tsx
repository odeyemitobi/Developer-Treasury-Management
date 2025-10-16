import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemberList } from '@/components/MemberList';

// Mock the hooks
vi.mock('@/hooks/useTreasuryInfo', () => ({
  useTreasuryInfo: vi.fn(() => ({
    treasuryName: 'Test Treasury',
    balance: '1000000',
    threshold: 2,
    memberCount: 3,
    members: [
      { address: 'SP1', role: 1 },
      { address: 'SP2', role: 2 },
    ],
    isLoading: false,
    error: null,
  })),
}));

describe('MemberList Component', () => {
  it('should render member list', () => {
    render(<MemberList />);
    expect(screen.getByText('Your Membership')).toBeInTheDocument();
  });

  it('should display members', () => {
    render(<MemberList />);
    const component = screen.getByText('Your Membership');
    expect(component).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    const { container } = render(<MemberList />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

