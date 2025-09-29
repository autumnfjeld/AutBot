import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryForm from '../QueryForm';

describe('QueryForm', () => {
  it('renders an input and submit button', () => {
    const onSubmit = vi.fn();
    render(<QueryForm onSubmit={onSubmit} isLoading={false} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask/i })).toBeInTheDocument();
  });

  it('submits text and clears input', () => {
    const onSubmit = vi.fn();
    render(<QueryForm onSubmit={onSubmit} isLoading={false} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(input.closest('form')!);

    expect(onSubmit).toHaveBeenCalledWith('Hello');
    expect(input.value).toBe('');
  });

  it('disables submit while loading', () => {
    const onSubmit = vi.fn();
    render(<QueryForm onSubmit={onSubmit} isLoading={true} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => expect(btn).toBeDisabled());
  });
});
