type Props = { children: React.ReactNode; className?: string; naSvijetloj?: boolean }

export function Labela({ children, className = '', naSvijetloj }: Props) {
  return (
    <span
      className={`font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] ${naSvijetloj ? 'text-black/60' : 'text-gray'} ${className}`}
    >
      [ {children} ]
    </span>
  )
}
