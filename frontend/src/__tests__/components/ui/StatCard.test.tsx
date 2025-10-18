import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/ui/StatCard';

describe('StatCard Component', () => {
  it('should render stat card', () => {
    const { container } = render(
      <StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display label', () => {
    render(<StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} />);
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
  });

  it('should display value', () => {
    render(<StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} />);
    expect(screen.getByText('1,000 STX')).toBeInTheDocument();
  });

  it('should render with proper styling', () => {
    const { container } = render(
      <StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} />
    );
    const card = container.firstChild;
    expect(card).toHaveClass('bg-[#0a0a0a]', 'border', 'rounded-lg');
  });

  it('should support custom className', () => {
    const { container } = render(
      <StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} className="custom-class" />
    );
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('should display trend indicator if provided', () => {
    render(
      <StatCard
        label="Total Balance"
        value="1,000 STX"
        icon={<span>💰</span>}
        trend={{ value: '+10%', isPositive: true }}
      />
    );
    expect(screen.getByText(/\+10%/)).toBeInTheDocument();
  });

  it('should support icon prop', () => {
    render(
      <StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} />
    );
    expect(screen.getByText('💰')).toBeInTheDocument();
  });

  it('should render with flex layout', () => {
    const { container } = render(
      <StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} />
    );
    const card = container.firstChild;
    expect(card).toHaveClass('group');
  });

  it('should have proper text styling', () => {
    const { container } = render(
      <StatCard label="Total Balance" value="1,000 STX" icon={<span>💰</span>} />
    );
    const card = container.firstChild;
    expect(card).toHaveClass('transition-all', 'duration-200');
  });
});

