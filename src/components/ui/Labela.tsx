type Props = { children: React.ReactNode; className?: string }

export function Labela({ children, className = '' }: Props) {
  return (
    <span className={`font-body text-[0.75vw] max-md:text-[2.6vw] uppercase tracking-[0.15em] text-gray ${className}`}>
      [ {children} ]
    </span>
  )
}
