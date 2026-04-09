import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PadGrid } from './PadGrid'
import { DEFAULT_PAD_ORDER } from '@/config/pads'

const defaultProps = {
  padOrder: DEFAULT_PAD_ORDER,
  editMode: false,
  onPadHit: vi.fn(),
  onSwap: vi.fn(),
}

describe('PadGrid', () => {
  it('renders all 10 drum pads', () => {
    render(<PadGrid {...defaultProps} />)
    expect(screen.getByText('KICK')).toBeInTheDocument()
    expect(screen.getByText('SNARE')).toBeInTheDocument()
    expect(screen.getByText('HI-HAT')).toBeInTheDocument()
    expect(screen.getByText('OPEN HAT')).toBeInTheDocument()
    expect(screen.getByText('TOM')).toBeInTheDocument()
    expect(screen.getByText('CLAP')).toBeInTheDocument()
    expect(screen.getByText('LOW TOM')).toBeInTheDocument()
    expect(screen.getByText('FLOOR TOM')).toBeInTheDocument()
    expect(screen.getByText('COWBELL')).toBeInTheDocument()
    expect(screen.getByText('RIDE')).toBeInTheDocument()
  })

  it('calls onPadHit with correct pad id when a pad is pressed', () => {
    const onPadHit = vi.fn()
    render(<PadGrid {...defaultProps} onPadHit={onPadHit} />)
    fireEvent.pointerDown(screen.getByText('SNARE'))
    expect(onPadHit).toHaveBeenCalledWith('snare')
  })

  it('renders pads in a grid container', () => {
    const { container } = render(<PadGrid {...defaultProps} />)
    const grid = container.firstElementChild
    expect(grid).toHaveClass('grid')
  })

  it('does not fire onPadHit in edit mode', () => {
    const onPadHit = vi.fn()
    render(<PadGrid {...defaultProps} editMode={true} onPadHit={onPadHit} />)
    fireEvent.pointerDown(screen.getByText('SNARE'))
    expect(onPadHit).not.toHaveBeenCalled()
  })
})
