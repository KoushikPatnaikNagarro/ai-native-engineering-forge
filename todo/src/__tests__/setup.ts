import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Mock sessionStorage
const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

beforeEach(() => {
  Object.defineProperty(window, 'sessionStorage', {
    value: mockStorage,
    writable: true,
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})