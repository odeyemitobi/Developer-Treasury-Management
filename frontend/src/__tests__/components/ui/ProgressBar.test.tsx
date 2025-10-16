import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/components/ui/ProgressBar';

describe('ProgressBar Component', () => {
  it('should render progress bar', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with correct value', () => {
    render(<ProgressBar value={75} max={100} />);
    expect(screen.getByText(/75\/100/)).toBeInTheDocument();
  });

  it('should render with min value', () => {
    render(<ProgressBar value={0} max={100} />);
    expect(screen.getByText(/0\/100/)).toBeInTheDocument();
  });

  it('should render with max value', () => {
    render(<ProgressBar value={100} max={100} />);
    expect(screen.getByText(/100\/100/)).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);
    const progressBar = container.firstChild;
    expect(progressBar).toHaveClass('w-full');
  });

  it('should render progress fill', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);
    const fill = container.querySelector('.bg-blue-600');
    expect(fill).toBeInTheDocument();
  });

  it('should update fill width based on value', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);
    const fill = container.querySelector('.bg-blue-600');
    expect(fill).toHaveStyle({ width: '50%' });
  });

  it('should handle custom className', () => {
    const { container } = render(<ProgressBar value={50} max={100} className="custom-class" />);
    const progressBar = container.firstChild;
    expect(progressBar).toHaveClass('custom-class');
  });
});

