import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// JSDOM already available via setup

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('hides SamplePrompts after receiving a response when clicking a sample prompt', async () => {
    const user = userEvent.setup();

    // Mock fetch used in useQuery
    const fetchMock = vi
      .spyOn(globalThis as unknown as { fetch: typeof fetch }, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => ({ response: 'Test response' }),
      } as Response);

    render(<App />);

    // Sample prompts visible at first
    expect(screen.getByText('Try asking:')).toBeInTheDocument();

    // Click first sample prompt button
    const firstPromptButton = screen
      .getAllByRole('button')
      .find(btn =>
        btn.textContent?.includes('How does Autumn navigate ambiguity?')
      )!;
    await user.click(firstPromptButton);

    // Submit the form (Ask button)
    const askButton = screen.getByRole('button', { name: /ask/i });
    await user.click(askButton);

    // Wait for response to show
    await waitFor(() => {
      expect(screen.getByText('Test response')).toBeInTheDocument();
    });

    // After response, sample prompts should be hidden
    expect(screen.queryByText('Try asking:')).toBeNull();

    // Ensure fetch was called with expected endpoint
    expect(fetchMock).toHaveBeenCalled();
  });

  it('hides SamplePrompts after receiving a response when typing input', async () => {
    const user = userEvent.setup();

    // Mock fetch used in useQuery
    const fetchMock = vi
      .spyOn(globalThis as unknown as { fetch: typeof fetch }, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => ({ response: 'Typed response' }),
      } as Response);

    render(<App />);

    // Sample prompts visible at first
    expect(screen.getByText('Try asking:')).toBeInTheDocument();

    // Type into the textbox and submit
    const input = screen.getByRole('textbox');
    await user.type(input, 'Who is Autumn?');
    const askButton = screen.getByRole('button', { name: /ask/i });
    await user.click(askButton);

    // Wait for response to show
    await waitFor(() => {
      expect(screen.getByText('Typed response')).toBeInTheDocument();
    });

    // Prompts should now be hidden
    expect(screen.queryByText('Try asking:')).toBeNull();

    // Ensure fetch was called
    expect(fetchMock).toHaveBeenCalled();
  });
});
