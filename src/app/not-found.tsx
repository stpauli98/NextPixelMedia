import { Dugme } from '@/components/ui/Dugme'

export default function NijePronadjeno() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[2vw] max-md:gap-[6vw] px-[6vw]">
      <h1 className="naslov text-[8vw] max-md:text-[16vw] text-champagne">404</h1>
      <p className="font-body text-[1.1vw] max-md:text-[4vw] text-gray">
        Ova stranica ne postoji.
      </p>
      <Dugme href="/">Nazad na početnu</Dugme>
    </main>
  )
}
