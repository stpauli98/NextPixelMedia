import Link from 'next/link'
import { Okvir } from './Okvir'

type Props = {
  href: string
  children: React.ReactNode
  varijanta?: 'puno' | 'obris'
}

export function Dugme({ href, children, varijanta = 'obris' }: Props) {
  const osnova =
    'inline-flex items-center gap-[0.5vw] max-md:gap-[2vw] px-[1.4vw] py-[0.7vw] max-md:px-[5vw] max-md:py-[3vw] font-body text-[0.85vw] max-md:text-[3.2vw] uppercase tracking-[0.1em] transition-colors duration-300'

  const stil =
    varijanta === 'puno'
      ? 'bg-champagne text-black hover:bg-white'
      : 'border border-champagne/40 text-white hover:border-champagne'

  return (
    <Okvir>
      <Link href={href} className={`${osnova} ${stil}`}>
        {children}
        <span aria-hidden="true">→</span>
      </Link>
    </Okvir>
  )
}
