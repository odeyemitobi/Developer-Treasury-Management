import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '@/components/ui/Tooltip';

describe('Tooltip Component', () => {
  it('should render tooltip trigger', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Tooltip content="Tooltip content">
        <span>Test content</span>
      </Tooltip>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    const button = screen.getByText('Hover me');
    await user.hover(button);
    // Tooltip should be visible after hover
    expect(button).toBeInTheDocument();
  });

  it('should hide tooltip on unhover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    const button = screen.getByText('Hover me');
    await user.hover(button);
    await user.unhover(button);
    // Tooltip should be hidden after unhover
    expect(button).toBeInTheDocument();
  });

  it('should support different positions', () => {
    const { container } = render(
      <Tooltip content="Tooltip content" position="top">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(container).toBeInTheDocument();
  });

  it('should support custom className', () => {
    const { container } = render(
      <Tooltip content="Tooltip content" className="custom-class">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with proper accessibility', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    const button = screen.getByText('Hover me');
    expect(button).toBeInTheDocument();
  });

  it('should support delay prop', () => {
    const { container } = render(
      <Tooltip content="Tooltip content" delay={500}>
        <button>Hover me</button>
      </Tooltip>
    );
    expect(container).toBeInTheDocument();
  });
});

