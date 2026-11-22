// Runs before every test file. You don't need to change this file.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Tells React that the tests wrap updates in act() (React Testing Library does it for us).
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Errors thrown inside event handlers (onClick, onChange...) don't reach the test directly.
// We collect them here, and the helpers turn them into a clear test failure.
globalThis.__pageErrors = []
window.addEventListener('error', (event) => {
  globalThis.__pageErrors.push(event.error ?? event.message)
  event.preventDefault()
})

afterEach(() => {
  cleanup()
  globalThis.__pageErrors.length = 0
})
