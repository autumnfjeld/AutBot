import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../Footer';

describe('Footer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the footer with all expected links', () => {
    render(<Footer />);
    
    // Check that all main links are present
    expect(screen.getByText('AutBot on GitHub')).toBeInTheDocument();
    expect(screen.getByText('autumnfjeld.com')).toBeInTheDocument();
  });

  it('has correct href for resume download link', () => {
    render(<Footer />);
    
    const resumeLink = screen.getByRole('link', { name: 'Old fashioned resume' });
    expect(resumeLink).toHaveAttribute('href', 'AutumnFjeld_EM_Resume_20250527.pdf');
  });

  it('has download attribute on resume link to force download', () => {
    render(<Footer />);
    
    const resumeLink = screen.getByRole('link', { name: 'Old fashioned resume' });
    expect(resumeLink).toHaveAttribute('download', 'AutumnFjeld_EM_Resume_20250527.pdf');
  });


  it('has all required attributes for PDF download functionality', () => {
    render(<Footer />);
    
    const resumeLink = screen.getByRole('link', { name: 'Old fashioned resume' });
    
    // Verify all attributes needed for download functionality
    expect(resumeLink).toHaveAttribute('href', 'AutumnFjeld_EM_Resume_20250527.pdf');
    expect(resumeLink).toHaveAttribute('download', 'AutumnFjeld_EM_Resume_20250527.pdf');
    expect(resumeLink).toHaveAttribute('target', '_blank');
    expect(resumeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has correct external links with proper attributes', () => {
    render(<Footer />);
    
    // Check GitHub link
    const githubLink = screen.getByRole('link', { name: 'AutBot on GitHub' });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/autumnfjeld/AutBot');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check personal website link
    const websiteLink = screen.getByRole('link', { name: 'autumnfjeld.com' });
    expect(websiteLink).toHaveAttribute('href', 'http://autumnfjeld.com');
    expect(websiteLink).toHaveAttribute('target', '_blank');
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
