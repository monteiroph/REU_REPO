import '@testing-library/jest-dom'

// Provide minimal env vars for modules that depend on Vite import.meta.env
if (typeof import.meta !== 'undefined' && import.meta.env) {
  import.meta.env.VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost'
  import.meta.env.VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'anon'
}
