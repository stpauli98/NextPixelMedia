import Link from 'next/link'
import { RUTE } from '@/content/rute'
import { tekstovi } from '@/content/tekstovi'

export function Footer() {
  return (
    <footer className="isolate w-full bg-black px-[4vw] pt-[5vw] pb-[2vw] max-md:px-[6vw] max-md:pt-[14vw] max-md:pb-[8vw]">
      <div className="flex items-start justify-between gap-[4vw] max-md:flex-col max-md:gap-[10vw]">
        <h2 className="naslov text-[9vw] max-md:text-[16vw] leading-[0.8] text-white">
          NextPixel<span className="text-champagne">.</span>
          <br />
          Media
        </h2>

        <div className="flex flex-col items-end gap-[2vw] max-md:items-start max-md:gap-[6vw]">
          <div className="border border-champagne/30 px-[2vw] py-[1.5vw] max-md:px-[6vw] max-md:py-[5vw]">
            <p className="font-body text-[1vw] max-md:text-[4vw] text-white">
              {tekstovi.footerKartica.naslov}
            </p>
            <a
              href={`https://${tekstovi.footerKartica.link}`}
              className="font-body text-[1vw] max-md:text-[4vw] text-champagne hover:text-white"
            >
              → {tekstovi.footerKartica.link}
            </a>
          </div>

          <nav className="flex flex-col items-end gap-[0.3vw] max-md:items-start max-md:gap-[2vw]">
            {RUTE.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="font-body text-[0.9vw] max-md:text-[3.5vw] text-gray hover:text-champagne"
              >
                {r.naziv}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-[4vw] flex items-center justify-between border-t border-white/10 pt-[1.5vw] max-md:mt-[12vw] max-md:flex-col max-md:gap-[3vw] max-md:pt-[5vw]">
        <span className="font-body text-[0.75vw] max-md:text-[2.8vw] text-gray">
          {tekstovi.chrome.footer.copyright}
        </span>
        <div className="flex gap-[1.5vw] max-md:gap-[5vw]">
          <Link href="/uslovi" className="font-body text-[0.75vw] max-md:text-[2.8vw] text-gray hover:text-champagne">
            {tekstovi.chrome.footer.uslovi}
          </Link>
          <Link href="/privatnost" className="font-body text-[0.75vw] max-md:text-[2.8vw] text-gray hover:text-champagne">
            {tekstovi.chrome.footer.privatnost}
          </Link>
        </div>
      </div>
    </footer>
  )
}
