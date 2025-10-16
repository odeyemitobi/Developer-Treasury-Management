import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import InitializeTreasury from '@/components/InitializeTreasury';

// Mock the hooks
vi.mock('@/hooks/useContractWrite', () => ({
  useContractWrite: vi.fn(() => ({
    initialize: vi.fn(),
    isLoading: false,
    error: null,
  })),
}));

describe('InitializeTreasury Component', () => {
  it('should render initialize form', () => {
    const { container } = render(<InitializeTreasury />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display component structure', () => {
    const { container } = render(<InitializeTreasury />);
    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<InitializeTreasury />);
    const card = container.querySelector('.rounded-lg');
    expect(card).toBeInTheDocument();
  });
});

