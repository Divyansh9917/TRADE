import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import './globals.css'

export const metadata = {
  title: 'Prop Trading',
  description: 'proprietary trading platform.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
      variables: { colorPrimary: '#10b981' }, 
      elements: { card: 'bg-zinc-900 border border-zinc-800' }
    }}>
      <html lang="en" className="dark">
        <body className="bg-black text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}