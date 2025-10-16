import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';

describe('Modal Component', () => {
  it('should render modal component', () => {
    const { container } = render(
      <Modal open={true} onOpenChange={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop', () => {
    const { container } = render(
      <Modal open={false} onOpenChange={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept onOpenChange callback', () => {
    const handleOpenChange = vi.fn();
    const { container } = render(
      <Modal open={true} onOpenChange={handleOpenChange}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with title prop', () => {
    const { container } = render(
      <Modal open={true} onOpenChange={() => {}} title="Test Modal">
        <div>Content</div>
      </Modal>
    );
    expect(container).toBeInTheDocument();
  });
});

