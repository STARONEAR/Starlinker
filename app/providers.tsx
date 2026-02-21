'use client'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/styles/theme'
import { CartProvider } from '@/lib/hooks/useCart'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  )
}
