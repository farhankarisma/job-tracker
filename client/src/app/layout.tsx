import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import { Providers } from './providers'
import { Plus_Jakarta_Sans } from 'next/font/google'

const Jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Job Tracker',
  description: 'Track your job applications efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${Jakarta.className} h-full`}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}