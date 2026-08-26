'use client'

export default function Greska({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[2vw] max-md:gap-[6vw] px-[6vw] text-center">
      <h1 className="naslov text-[5vw] max-md:text-[10vw] text-champagne">Nešto je puklo</h1>
      <p className="font-body text-[1.1vw] max-md:text-[4vw] text-gray">
        Pokušaj ponovo. Ako se ponovi, javi se na nikola@nextpixel.media
      </p>
      <button
        type="button"
        onClick={reset}
        className="border border-champagne/40 px-[1.5vw] py-[0.7vw] max-md:px-[6vw] max-md:py-[3vw] font-body text-[0.9vw] max-md:text-[3.5vw] uppercase tracking-[0.1em] text-white hover:border-champagne"
      >
        Pokušaj ponovo
      </button>
    </main>
  )
}
