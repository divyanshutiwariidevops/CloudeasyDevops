export function BrandLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Devops Portal"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: 8, display: 'block', objectFit: 'cover' }}
    />
  )
}
