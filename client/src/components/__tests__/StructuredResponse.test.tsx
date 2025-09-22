import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StructuredResponse from '../StructuredResponse'

describe('StructuredResponse', () => {
  it('renders nothing with no response and no error', () => {
    const { container } = render(<StructuredResponse />)
    expect(container.firstChild).toBeNull()
  })

  it('renders error when provided', () => {
    render(<StructuredResponse error="Oops" />)
    expect(screen.getByText('Oops')).toBeInTheDocument()
  })

  it('renders plain text response when not JSON', () => {
    render(<StructuredResponse response="hello world" />)
    expect(screen.getByText('hello world')).toBeInTheDocument()
  })

  it('renders structured fields when JSON', () => {
    const payload = JSON.stringify({ summary: 'Sum', details: 'One\n\nTwo', fun_facts: 'Fun' })
    render(<StructuredResponse response={payload} query="Q?" />)
    expect(screen.getByText('Sum')).toBeInTheDocument()
    expect(screen.getByText('Fun')).toBeInTheDocument()
  })
})

