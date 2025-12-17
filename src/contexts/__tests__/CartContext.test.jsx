import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CartProvider, useCart } from '../CartContext'
import { AuthProvider } from '../AuthContext'

// Mock supabase used by CartProvider
vi.mock('@/lib/customSupabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'http://example.com/image.png' } })
      })
    }
  }
}))

describe('CartContext', () => {
  it('throws when used outside CartProvider', () => {
    function Test() {
      useCart()
      return null
    }

    expect(() => render(<Test />)).toThrow('useCart must be used within a CartProvider')
  })

  it('provides lists and loading when wrapped by AuthProvider and CartProvider', async () => {
    function ShowCart() {
      const { loading, categories, miniatures } = useCart()
      return (
        <div>
          <span data-testid="loading">{String(loading)}</span>
          <span data-testid="categories">{String(categories.length)}</span>
          <span data-testid="miniatures">{String(miniatures.length)}</span>
        </div>
      )
    }

    render(
      <AuthProvider>
        <CartProvider>
          <ShowCart />
        </CartProvider>
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('categories').textContent).toBe('0')
    expect(screen.getByTestId('miniatures').textContent).toBe('0')
  })
})
