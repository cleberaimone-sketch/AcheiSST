interface LogoProps {
  className?: string
  textClassName?: string
}

export default function Logo({ className = '', textClassName = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex items-baseline font-black tracking-tight leading-none select-none ${textClassName} ${className}`}
    >
      <span style={{ color: '#1a2e6e' }}>Achei</span>
      <span style={{ color: '#3ab54a' }}>SST</span>
    </span>
  )
}
