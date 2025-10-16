import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/ui/EmptyState';

describe('EmptyState Component', () => {
  it('should render empty state', () => {
    const { container } = render(
      <EmptyState icon={<span>📭</span>} title="No items" description="There are no items to display" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display title', () => {
    render(
      <EmptyState icon={<span>📭</span>} title="No items" description="There are no items to display" />
    );
    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('should display description', () => {
    render(
      <EmptyState icon={<span>📭</span>} title="No items" description="There are no items to display" />
    );
    expect(screen.getByText('There are no items to display')).toBeInTheDocument();
  });

  it('should render with proper styling', () => {
    const { container } = render(
      <EmptyState icon={<span>📭</span>} title="No items" description="There are no items to display" />
    );
    const emptyState = container.firstChild;
    expect(emptyState).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  it('should render with text center alignment', () => {
    const { container } = render(
      <EmptyState icon={<span>📭</span>} title="No items" description="There are no items to display" />
    );
    const emptyState = container.firstChild;
    expect(emptyState).toHaveClass('text-center');
  });

  it('should render with padding', () => {
    const { container } = render(
      <EmptyState icon={<span>📭</span>} title="No items" description="There are no items to display" />
    );
    const emptyState = container.firstChild;
    expect(emptyState).toHaveClass('py-12');
  });

  it('should render icon', () => {
    render(
      <EmptyState icon={<span>📭</span>} title="No items" description="There are no items to display" />
    );
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('should support action prop', () => {
    render(
      <EmptyState
        icon={<span>📭</span>}
        title="No items"
        description="There are no items to display"
        action={<button>Create Item</button>}
      />
    );
    expect(screen.getByText('Create Item')).toBeInTheDocument();
  });
});

