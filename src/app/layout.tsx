import type { Metadata } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import '@/styles/globals.css'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Preloader } from '@/components/layout/Preloader'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NextPixel Media — foto, video i dron produkcija',
  description:
    'Sadržaj za firme, nekretnine i događaje. Gradiška, Banja Luka i okolina.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" className={`${montserrat.variable} ${poppins.variable}`}>
      <body className="bg-black text-white antialiased">
        <SmoothScroll>
          <Preloader />
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
