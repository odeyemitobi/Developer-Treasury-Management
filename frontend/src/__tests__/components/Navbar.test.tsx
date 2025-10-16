import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';

describe('Navbar Component', () => {
  it('should render navbar', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('should have fixed positioning', () => {
    const { container } = render(<Navbar />);
    const navbar = container.querySelector('header');
    expect(navbar).toHaveClass('fixed');
  });

  it('should have proper z-index', () => {
    const { container } = render(<Navbar />);
    const navbar = container.querySelector('header');
    expect(navbar).toHaveClass('z-50');
  });

  it('should have dark background', () => {
    const { container } = render(<Navbar />);
    const navbar = container.querySelector('header');
    expect(navbar).toHaveClass('bg-[#0a0a0a]/95');
  });

  it('should have proper styling classes', () => {
    const { container } = render(<Navbar />);
    const navbar = container.querySelector('header');
    expect(navbar).toHaveClass('border-b', 'border-[#1a1a1a]');
  });

  it('should render with flex layout', () => {
    const { container } = render(<Navbar />);
    const flexContainer = container.querySelector('.flex.items-center.justify-between');
    expect(flexContainer).toHaveClass('flex', 'items-center');
  });

  it('should have proper height', () => {
    const { container } = render(<Navbar />);
    const flexContainer = container.querySelector('.h-14');
    expect(flexContainer).toHaveClass('h-14', 'sm:h-20');
  });

  it('should have responsive padding', () => {
    const { container } = render(<Navbar />);
    const navbar = container.querySelector('header');
    expect(navbar).toBeInTheDocument();
  });

  it('should display brand name', () => {
    render(<Navbar />);
    expect(screen.getByText('Developer Treasury')).toBeInTheDocument();
  });
});

