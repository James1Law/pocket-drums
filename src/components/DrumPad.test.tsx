import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DrumPad } from './DrumPad'
import type { DrumPadConfig } from '@/types/pad'

const testPad: DrumPadConfig = {
  id: 'kick',
  label: 'KICK',
  color: 'bg-orange-600',
  activeColor: 'bg-orange-400',
}

describe('DrumPad', () => {
  it('renders the pad label', () => {
    render(<DrumPad pad={testPad} onHit={vi.fn()} />)
    expect(screen.getByText('KICK')).toBeInTheDocument()
  })

  it('calls onHit with pad id on pointer down', () => {
    const onHit = vi.fn()
    render(<DrumPad pad={testPad} onHit={onHit} />)
    fireEvent.pointerDown(screen.getByText('KICK'))
    expect(onHit).toHaveBeenCalledWith('kick')
  })

  it('adds active class on pointer down', () => {
    render(<DrumPad pad={testPad} onHit={vi.fn()} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    expect(pad).toHaveAttribute('data-active', 'true')
  })

  it('removes active class on pointer up', () => {
    render(<DrumPad pad={testPad} onHit={vi.fn()} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    fireEvent.pointerUp(pad)
    expect(pad).toHaveAttribute('data-active', 'false')
  })

  it('removes active class on pointer cancel', () => {
    render(<DrumPad pad={testPad} onHit={vi.fn()} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    fireEvent.pointerCancel(pad)
    expect(pad).toHaveAttribute('data-active', 'false')
  })

  it('removes active class on pointer leave', () => {
    render(<DrumPad pad={testPad} onHit={vi.fn()} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    fireEvent.pointerLeave(pad)
    expect(pad).toHaveAttribute('data-active', 'false')
  })
})
