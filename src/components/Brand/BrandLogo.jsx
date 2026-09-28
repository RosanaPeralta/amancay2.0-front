import mark from '../../assets/brand/amancay_mark.png'

const variants = {
  // multiply blends the mark's white background into the cream navbar
  light: { image: 'mix-blend-multiply', text: 'text-primary' },
  dark: { image: 'rounded-lg bg-white p-1', text: 'text-white' },
}

function BrandLogo({ variant = 'light', compact = false, className = '' }) {
  const styles = variants[variant]
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <img src={mark} alt="" className={`h-9 w-auto ${styles.image}`} />
      <span className={`text-xl font-extrabold tracking-wide ${styles.text} ${compact ? 'hidden sm:inline' : ''}`}>AMANCAY</span>
    </span>
  )
}

export default BrandLogo
