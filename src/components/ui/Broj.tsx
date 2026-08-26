type Props = { vrijednost: string; opis: string }

export function Broj({ vrijednost, opis }: Props) {
  return (
    <div className="flex flex-col gap-[0.4vw] max-md:gap-[1.5vw]">
      <span className="naslov text-champagne text-[5vw] max-md:text-[14vw]">{vrijednost}</span>
      <span className="font-body text-[0.8vw] max-md:text-[3vw] uppercase tracking-[0.12em] text-gray">
        {opis}
      </span>
    </div>
  )
}
