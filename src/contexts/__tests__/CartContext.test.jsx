import React from 'react'
import { render } from '@testing-library/react'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'

function Probe() {
  const cart = useCart()
  // eslint-disable-next-line no-undef
  globalThis.__CART = cart
  return null
}

describe('CartContext', () => {
  it('provides cart APIs', () => {
    render(
      <AuthProvider>
        <CartProvider>
          <Probe />
        </CartProvider>
      </AuthProvider>
    )

    expect(typeof globalThis.__CART.addReservation).toBe('function')
    expect(Array.isArray(globalThis.__CART.miniatures)).toBe(true)
    expect(typeof globalThis.__CART.getAllReservations).toBe('function')
  })
})
