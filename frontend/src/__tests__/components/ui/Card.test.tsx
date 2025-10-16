import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card Component', () => {
  it('should render card with content', () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const cardElement = container.querySelector('.custom-class');
    expect(cardElement).toBeInTheDocument();
  });

  it('should have proper card styling', () => {
    const { container } = render(<Card>Content</Card>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('rounded-lg', 'overflow-hidden');
  });

  it('should render card with title', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('should render card with subtitle', () => {
    render(<Card title="Title" subtitle="Subtitle">Content</Card>);
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('should render card with action', () => {
    render(
      <Card title="Title" action={<button>Action</button>}>
        Content
      </Card>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('should support different variants', () => {
    const { container: container1 } = render(<Card variant="elevated">Content</Card>);
    const { container: container2 } = render(<Card variant="glass">Content</Card>);
    
    expect(container1.firstChild).toHaveClass('shadow-xl');
    expect(container2.firstChild).toHaveClass('backdrop-blur-xl');
  });

  it('should support noPadding prop', () => {
    const { container } = render(<Card noPadding>Content</Card>);
    const contentDiv = container.querySelector('div > div:last-child');
    expect(contentDiv).not.toHaveClass('p-3');
  });
});

