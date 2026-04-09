import { describe, it, expect } from 'vitest'
import { computeDisplayOrder } from './useDragReorder'

describe('computeDisplayOrder', () => {
  it('returns identity order when not dragging', () => {
    expect(computeDisplayOrder(10, -1, -1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('moves item 0 to position 4', () => {
    const order = computeDisplayOrder(10, 0, 4)
    // Item 0 should now be at display position 4
    expect(order[4]).toBe(0)
    // Items 1-4 shift left
    expect(order[0]).toBe(1)
    expect(order[3]).toBe(4)
  })

  it('moves item 4 to position 0', () => {
    const order = computeDisplayOrder(10, 4, 0)
    expect(order[0]).toBe(4)
    expect(order[1]).toBe(0)
    expect(order[4]).toBe(3)
  })

  it('returns identity when draggedIndex equals hoverIndex', () => {
    const order = computeDisplayOrder(10, 3, 3)
    expect(order).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('handles moving last item to first', () => {
    const order = computeDisplayOrder(5, 4, 0)
    expect(order).toEqual([4, 0, 1, 2, 3])
  })

  it('handles moving first item to last', () => {
    const order = computeDisplayOrder(5, 0, 4)
    expect(order).toEqual([1, 2, 3, 4, 0])
  })
})
