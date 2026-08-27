import { Dugme } from '@/components/ui/Dugme'
import { tekstovi } from '@/content/tekstovi'

export default function NijePronadjeno() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[2vw] max-md:gap-[6vw] px-[4vw] max-md:px-[6vw]">
      <h1 className="naslov text-[8vw] max-md:text-[16vw] text-champagne">{tekstovi.chrome.nijePronadjeno.naslov}</h1>
      <p className="font-body text-[1.1vw] max-md:text-[4vw] text-gray">
        {tekstovi.chrome.nijePronadjeno.opis}
      </p>
      <Dugme href="/">{tekstovi.chrome.nijePronadjeno.dugme}</Dugme>
    </main>
  )
}
