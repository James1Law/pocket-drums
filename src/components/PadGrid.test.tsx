import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PadGrid } from './PadGrid'

describe('PadGrid', () => {
  it('renders all 6 drum pads', () => {
    render(<PadGrid onPadHit={vi.fn()} />)
    expect(screen.getByText('KICK')).toBeInTheDocument()
    expect(screen.getByText('SNARE')).toBeInTheDocument()
    expect(screen.getByText('HI-HAT')).toBeInTheDocument()
    expect(screen.getByText('OPEN HAT')).toBeInTheDocument()
    expect(screen.getByText('TOM')).toBeInTheDocument()
    expect(screen.getByText('CLAP')).toBeInTheDocument()
  })

  it('calls onPadHit with correct pad id when a pad is pressed', () => {
    const onPadHit = vi.fn()
    render(<PadGrid onPadHit={onPadHit} />)
    fireEvent.pointerDown(screen.getByText('SNARE'))
    expect(onPadHit).toHaveBeenCalledWith('snare')
  })

  it('renders pads in a grid container', () => {
    const { container } = render(<PadGrid onPadHit={vi.fn()} />)
    const grid = container.firstElementChild
    expect(grid).toHaveClass('grid')
  })
})
