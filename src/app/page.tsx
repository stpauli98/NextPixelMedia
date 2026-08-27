import { Hero } from '@/components/sections/Hero'
import { MarqueeSlika } from '@/components/sections/MarqueeSlika'
import { Statement } from '@/components/sections/Statement'
import { Vizir } from '@/components/sections/Vizir'
import { MrezaRadova } from '@/components/sections/MrezaRadova'
import { Intro } from '@/components/sections/Intro'
import { Proces } from '@/components/sections/Proces'
import { Citat } from '@/components/sections/Citat'
import { TriUsluge } from '@/components/sections/TriUsluge'
import { GalerijaCTA } from '@/components/sections/GalerijaCTA'

export default function Pocetna() {
  return (
    <main>
      <Hero />
      <MarqueeSlika />
      <Statement />
      <Vizir />
      <MrezaRadova />
      <Intro />
      <Proces />
      <Citat />
      <TriUsluge />
      <GalerijaCTA />
    </main>
  )
}
