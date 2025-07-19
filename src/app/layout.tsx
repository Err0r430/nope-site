import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch('https://api.nope.rs/')
  const data = await res.json()

  return {
    title: 'Nope.rs - For when you need to decline with pazazz',
    description: data.data.nope ?? "Nope...",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
    </html>
  )
}