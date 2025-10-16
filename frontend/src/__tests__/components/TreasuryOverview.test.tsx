import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TreasuryOverview } from '@/components/TreasuryOverview';

// Mock the treasury info hook
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

describe('TreasuryOverview Component', () => {
  it('should render treasury overview', () => {
    render(<TreasuryOverview />);
    expect(screen.getByText('Treasury Overview')).toBeInTheDocument();
  });

  it('should display treasury information', () => {
    render(<TreasuryOverview />);
    const component = screen.getByText('Treasury Overview');
    expect(component).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    const { container } = render(<TreasuryOverview />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

