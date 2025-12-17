import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock supabase auth calls used by AuthProvider
vi.mock('@/lib/customSupabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    }
  }
}))

describe('AuthContext', () => {
  it('throws when used outside AuthProvider', () => {
    function Test() {
      useAuth()
      return null
    }

    expect(() => render(<Test />)).toThrow('useAuth must be used within an AuthProvider')
  })

  it('provides loading state and user when wrapped by AuthProvider', async () => {
    function ShowAuth() {
      const { loading, user } = useAuth()
      return (
        <div>
          <span data-testid="loading">{String(loading)}</span>
          <span data-testid="user">{String(!!user)}</span>
        </div>
      )
    }

    render(
      <AuthProvider>
        <ShowAuth />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('false')
  })
})
