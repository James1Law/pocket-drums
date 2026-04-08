import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TransportControls } from './TransportControls'
import type { TransportState } from '@/types/recording'

function renderTransport(state: TransportState, hasRecording = false) {
  const props = {
    state,
    hasRecording,
    onRecord: vi.fn(),
    onStop: vi.fn(),
    onPlay: vi.fn(),
    onClear: vi.fn(),
  }
  render(<TransportControls {...props} />)
  return props
}

describe('TransportControls', () => {
  it('renders all 4 buttons', () => {
    renderTransport('idle')
    expect(screen.getByRole('button', { name: /rec/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('in idle state: only REC is enabled', () => {
    renderTransport('idle')
    expect(screen.getByRole('button', { name: /rec/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /stop/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /play/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled()
  })

  it('in recording state: only STOP is enabled', () => {
    renderTransport('recording')
    expect(screen.getByRole('button', { name: /rec/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /stop/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /play/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled()
  })

  it('in stopped state: REC, PLAY, CLEAR are enabled', () => {
    renderTransport('stopped', true)
    expect(screen.getByRole('button', { name: /rec/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /stop/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /play/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /clear/i })).toBeEnabled()
  })

  it('in playing state: STOP and CLEAR are enabled', () => {
    renderTransport('playing', true)
    expect(screen.getByRole('button', { name: /rec/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /stop/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /play/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /clear/i })).toBeEnabled()
  })

  it('fires onRecord when REC is clicked', () => {
    const props = renderTransport('idle')
    fireEvent.click(screen.getByRole('button', { name: /rec/i }))
    expect(props.onRecord).toHaveBeenCalledTimes(1)
  })

  it('fires onStop when STOP is clicked', () => {
    const props = renderTransport('recording')
    fireEvent.click(screen.getByRole('button', { name: /stop/i }))
    expect(props.onStop).toHaveBeenCalledTimes(1)
  })

  it('fires onPlay when PLAY is clicked', () => {
    const props = renderTransport('stopped', true)
    fireEvent.click(screen.getByRole('button', { name: /play/i }))
    expect(props.onPlay).toHaveBeenCalledTimes(1)
  })

  it('fires onClear when CLEAR is clicked', () => {
    const props = renderTransport('stopped', true)
    fireEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(props.onClear).toHaveBeenCalledTimes(1)
  })
})
