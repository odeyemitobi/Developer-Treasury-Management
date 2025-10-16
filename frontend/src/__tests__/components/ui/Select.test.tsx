import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components/ui/Select';

describe('Select Component', () => {
  it('should render select element', () => {
    const { container } = render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    expect(container.querySelector('select')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should set selected value', () => {
    const { container } = render(
      <Select value="2">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  it('should call onChange when value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <Select value="1" onChange={onChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = container.querySelector('select') as HTMLSelectElement;
    await user.selectOptions(select, '2');
    expect(onChange).toHaveBeenCalled();
  });

  it('should have proper styling', () => {
    const { container } = render(
      <Select>
        <option value="1">Option 1</option>
      </Select>
    );
    const select = container.querySelector('select');
    expect(select).toHaveClass('w-full', 'px-4', 'py-2', 'border', 'rounded-lg');
  });

  it('should support disabled state', () => {
    const { container } = render(
      <Select disabled>
        <option value="1">Option 1</option>
      </Select>
    );
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('should support custom className', () => {
    const { container } = render(
      <Select className="custom-class">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = container.querySelector('select');
    expect(select).toHaveClass('custom-class');
  });

  it('should support label', () => {
    render(
      <Select label="Choose an option">
        <option value="1">Option 1</option>
      </Select>
    );
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });
});

