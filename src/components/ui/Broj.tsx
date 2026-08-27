type Props = { vrijednost: string; opis: string; naSvijetloj?: boolean }

export function Broj({ vrijednost, opis, naSvijetloj }: Props) {
  return (
    <div className="flex flex-col gap-[0.4vw] max-md:gap-[1.5vw]">
      <span className={`naslov text-[5vw] max-md:text-[14vw] ${naSvijetloj ? 'text-navy' : 'text-champagne'}`}>{vrijednost}</span>
      <span className={`font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.12em] ${naSvijetloj ? 'text-black/60' : 'text-gray'}`}>
        {opis}
      </span>
    </div>
  )
}
