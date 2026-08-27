import { Hero } from '@/components/sections/Hero'
import { MarqueeSlika } from '@/components/sections/MarqueeSlika'
import { Statement } from '@/components/sections/Statement'
import { Vizir } from '@/components/sections/Vizir'
import { MrezaRadova } from '@/components/sections/MrezaRadova'
import { Intro } from '@/components/sections/Intro'
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
      <GalerijaCTA />
    </main>
  )
}
