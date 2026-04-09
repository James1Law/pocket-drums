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

const defaultProps = {
  pad: testPad,
  editMode: false,
  index: 0,
  onHit: vi.fn(),
}

describe('DrumPad', () => {
  it('renders the pad label', () => {
    render(<DrumPad {...defaultProps} />)
    expect(screen.getByText('KICK')).toBeInTheDocument()
  })

  it('calls onHit with pad id on pointer down', () => {
    const onHit = vi.fn()
    render(<DrumPad {...defaultProps} onHit={onHit} />)
    fireEvent.pointerDown(screen.getByText('KICK'))
    expect(onHit).toHaveBeenCalledWith('kick')
  })

  it('adds active class on pointer down', () => {
    render(<DrumPad {...defaultProps} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    expect(pad).toHaveAttribute('data-active', 'true')
  })

  it('removes active class on pointer up', () => {
    render(<DrumPad {...defaultProps} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    fireEvent.pointerUp(pad)
    expect(pad).toHaveAttribute('data-active', 'false')
  })

  it('removes active class on pointer cancel', () => {
    render(<DrumPad {...defaultProps} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    fireEvent.pointerCancel(pad)
    expect(pad).toHaveAttribute('data-active', 'false')
  })

  it('removes active class on pointer leave', () => {
    render(<DrumPad {...defaultProps} />)
    const pad = screen.getByText('KICK')
    fireEvent.pointerDown(pad)
    fireEvent.pointerLeave(pad)
    expect(pad).toHaveAttribute('data-active', 'false')
  })

  it('does not call onHit in edit mode', () => {
    const onHit = vi.fn()
    render(<DrumPad {...defaultProps} editMode={true} onHit={onHit} />)
    fireEvent.pointerDown(screen.getByText('KICK'))
    expect(onHit).not.toHaveBeenCalled()
  })

  it('applies jiggle animation in edit mode', () => {
    render(<DrumPad {...defaultProps} editMode={true} />)
    const pad = screen.getByText('KICK')
    expect(pad).toHaveClass('animate-jiggle')
  })

  it('does not apply jiggle animation outside edit mode', () => {
    render(<DrumPad {...defaultProps} editMode={false} />)
    const pad = screen.getByText('KICK')
    expect(pad).not.toHaveClass('animate-jiggle')
  })

  it('calls onDragStart on pointer down in edit mode', () => {
    const onDragStart = vi.fn()
    render(<DrumPad {...defaultProps} editMode={true} onDragStart={onDragStart} />)
    fireEvent.pointerDown(screen.getByText('KICK'))
    expect(onDragStart).toHaveBeenCalled()
  })

  it('applies custom style prop', () => {
    render(<DrumPad {...defaultProps} style={{ opacity: 0 }} />)
    const pad = screen.getByText('KICK')
    expect(pad.style.opacity).toBe('0')
  })

  it('forwards ref to the DOM element', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<DrumPad {...defaultProps} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
