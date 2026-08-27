type Props = { children: React.ReactNode; className?: string }

function Ugao({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 7 7"
      aria-hidden="true"
      className={`pointer-events-none absolute size-[0.55vw] max-md:size-[1.8vw] text-champagne transition-transform duration-300 ease-out ${className}`}
    >
      <path d="M0.5 7L0.5 3.5C0.5 1.84315 1.84315 0.5 3.5 0.5L7 0.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

// Korijen je div, ne span: Okvir ponekad obavija kartice i druge blok
// elemente (paketi), a span sa blok djetetom je nevažeći HTML.
export function Okvir({ children, className = '' }: Props) {
  return (
    <div className={`group relative inline-block ${className}`}>
      <Ugao className="top-[-0.4vw] left-[-0.7vw] max-md:top-[-1.2vw] max-md:left-[-2vw] group-hover:-translate-x-[0.2vw] group-hover:-translate-y-[0.2vw] max-md:group-hover:-translate-x-[0.65vw] max-md:group-hover:-translate-y-[0.65vw]" />
      <Ugao className="top-[-0.4vw] right-[-0.7vw] max-md:top-[-1.2vw] max-md:right-[-2vw] -scale-x-100 group-hover:translate-x-[0.2vw] group-hover:-translate-y-[0.2vw] max-md:group-hover:translate-x-[0.65vw] max-md:group-hover:-translate-y-[0.65vw]" />
      <Ugao className="bottom-[-0.4vw] left-[-0.7vw] max-md:bottom-[-1.2vw] max-md:left-[-2vw] -scale-y-100 group-hover:-translate-x-[0.2vw] group-hover:translate-y-[0.2vw] max-md:group-hover:-translate-x-[0.65vw] max-md:group-hover:translate-y-[0.65vw]" />
      <Ugao className="bottom-[-0.4vw] right-[-0.7vw] max-md:bottom-[-1.2vw] max-md:right-[-2vw] rotate-180 group-hover:translate-x-[0.2vw] group-hover:translate-y-[0.2vw] max-md:group-hover:translate-x-[0.65vw] max-md:group-hover:translate-y-[0.65vw]" />
      {children}
    </div>
  )
}
