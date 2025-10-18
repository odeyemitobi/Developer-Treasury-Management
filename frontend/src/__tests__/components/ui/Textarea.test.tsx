import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@/components/ui/Textarea';

describe('Textarea Component', () => {
  it('should render textarea element', () => {
    const { container } = render(<Textarea value="" onChange={() => {}} />);
    expect(container.querySelector('textarea')).toBeInTheDocument();
  });

  it('should display placeholder text', () => {
    const { container } = render(
      <Textarea placeholder="Enter text here" value="" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('Enter text here');
  });

  it('should set value', () => {
    const { container } = render(
      <Textarea value="Test content" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Test content');
  });

  it('should call onChange when value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <Textarea value="" onChange={onChange} />
    );
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.type(textarea, 'New text');
    expect(onChange).toHaveBeenCalled();
  });

  it('should support disabled state', () => {
    const { container } = render(
      <Textarea value="" onChange={() => {}} disabled />
    );
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
  });

  it('should have proper styling', () => {
    const { container } = render(
      <Textarea value="" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('w-full', 'px-4', 'py-2', 'border', 'rounded-lg');
  });

  it('should support custom className', () => {
    const { container } = render(
      <Textarea value="" onChange={() => {}} className="custom-class" />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('custom-class');
  });

  it('should support rows attribute', () => {
    const { container } = render(
      <Textarea value="" onChange={() => {}} rows={5} />
    );
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(5);
  });

  it('should handle focus event', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Textarea value="" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    await user.click(textarea);
    expect(textarea).toHaveFocus();
  });
});

