import React from 'react'
import { render } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

function Probe() {
  const auth = useAuth()
  // expose for assertions
  // eslint-disable-next-line no-undef
  globalThis.__AUTH = auth
  return null
}

describe('AuthContext', () => {
  it('provides register/login/logout functions', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )

    expect(typeof globalThis.__AUTH.register).toBe('function')
    expect(typeof globalThis.__AUTH.login).toBe('function')
    expect(typeof globalThis.__AUTH.logout).toBe('function')
  })
})
