import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SavedLoops } from './SavedLoops'
import type { SavedLoop } from '@/hooks/useLoopStorage'
import type { Recording } from '@/types/recording'

const testRecording: Recording = {
  hits: [{ padId: 'kick', timestamp: 0 }],
  duration: 1000,
}

const testLoops: SavedLoop[] = [
  { id: '1', name: 'Loop A', recording: testRecording, createdAt: 1000 },
  { id: '2', name: 'Loop B', recording: testRecording, createdAt: 2000 },
]

describe('SavedLoops', () => {
  it('renders nothing when no loops exist', () => {
    const { container } = render(
      <SavedLoops loops={[]} onLoad={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(container.textContent).toBe('')
  })

  it('renders loop names', () => {
    render(
      <SavedLoops loops={testLoops} onLoad={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByText('Loop A')).toBeInTheDocument()
    expect(screen.getByText('Loop B')).toBeInTheDocument()
  })

  it('fires onLoad when play button is clicked', () => {
    const onLoad = vi.fn()
    render(
      <SavedLoops loops={testLoops} onLoad={onLoad} onDelete={vi.fn()} />,
    )
    fireEvent.click(screen.getAllByRole('button', { name: /load/i })[0])
    expect(onLoad).toHaveBeenCalledWith(testRecording)
  })

  it('fires onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <SavedLoops loops={testLoops} onLoad={vi.fn()} onDelete={onDelete} />,
    )
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
