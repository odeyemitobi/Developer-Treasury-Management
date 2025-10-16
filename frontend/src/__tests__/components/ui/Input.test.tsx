import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should accept placeholder prop', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should accept value prop', () => {
    render(<Input value="test value" readOnly />);
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('should handle onChange event', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    await userEvent.type(screen.getByRole('textbox'), 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should support different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('should have proper input styling', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-[#0a0a0a]', 'text-white');
  });

  it('should handle focus event', async () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} />);
    
    await userEvent.click(screen.getByRole('textbox'));
    expect(handleFocus).toHaveBeenCalled();
  });

  it('should handle blur event', async () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should support required attribute', () => {
    render(<Input required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('should support min and max attributes for number input', () => {
    render(<Input type="number" min="0" max="100" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should support pattern attribute', () => {
    render(<Input pattern="[0-9]+" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[0-9]+');
  });

  it('should clear input value', async () => {
    const { rerender } = render(<Input value="test" onChange={() => {}} />);
    rerender(<Input value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});

