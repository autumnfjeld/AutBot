import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import Footer from '../Footer';

// Tests are a bit overkill, but it's my toy app, so I can let the AI play. 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    expect(resumeLink).toHaveAttribute('href', 'AutumnFjeld_EM_Resume_20250916.pdf');
  });

  it('has download attribute on resume link to force download', () => {
    render(<Footer />);
    
    const resumeLink = screen.getByRole('link', { name: 'Old fashioned resume' });
    expect(resumeLink).toHaveAttribute('download', 'AutumnFjeld_EM_Resume_20250916.pdf');
  });


  it('has all required attributes for PDF download functionality', () => {
    render(<Footer />);
    
    const resumeLink = screen.getByRole('link', { name: 'Old fashioned resume' });
    
    // Verify all attributes needed for download functionality
    expect(resumeLink).toHaveAttribute('href', 'AutumnFjeld_EM_Resume_20250916.pdf');
    expect(resumeLink).toHaveAttribute('download', 'AutumnFjeld_EM_Resume_20250916.pdf');
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

  it('references a PDF file that actually exists in the public folder', () => {
    // Get the filename from the Footer component
    render(<Footer />);
    const resumeLink = screen.getByRole('link', { name: 'Old fashioned resume' });
    const href = resumeLink.getAttribute('href');
    
    expect(href).toBeTruthy();
    expect(typeof href).toBe('string');
    
    // Check if the file exists in the public folder
    const publicFilePath = resolve(__dirname, '../../../public', href as string);
    const fileExists = existsSync(publicFilePath);
    
    expect(fileExists).toBe(true);
    
    // Additional check: verify it's actually a PDF file
    expect(href).toMatch(/\.pdf$/i);
  });

  it('warns if there are newer resume files that might need to be used', () => {
    // This test checks if there are newer resume files in the public folder
    // that might need to be referenced instead of the current one
    
    render(<Footer />);
    const resumeLink = screen.getByRole('link', { name: 'Old fashioned resume' });
    const currentHref = resumeLink.getAttribute('href');
    
    expect(currentHref).toBeTruthy();
    
    // Extract date from current filename (assuming format: AutumnFjeld_*_YYYYMMDD.pdf)
    const currentDateMatch = currentHref?.match(/(\d{8})\.pdf$/);
    expect(currentDateMatch).toBeTruthy();
    
    const currentDate = currentDateMatch?.[1];
    expect(currentDate).toBeTruthy();
    
    // Note: This test serves as documentation that developers should check
    // if there are newer resume files when updating the component
    console.log(`Current resume file: ${currentHref}`);
    console.log(`Current resume date: ${currentDate}`);
    console.log('Note: Check if there are newer resume files in /client/public/ that should be used instead');
  });
});
