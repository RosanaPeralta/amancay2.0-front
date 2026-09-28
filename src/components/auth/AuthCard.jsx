import Container from '../ui/Container'
import BrandLogo from '../Brand/BrandLogo'
import defaultImage from '../../assets/gallery/gallery1.png'

function AuthImagePanel({ image }) {
  return (
    <div className="relative hidden md:block">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-10 text-white">
        <span className="mb-4 block h-1 w-10 rounded-full bg-info" />
        <p className="text-3xl font-bold leading-tight">Tu próxima aventura empieza aquí.</p>
        <p className="mt-3 max-w-xs text-sm text-white/80">
          Equipo para camping, escalada, kayak, ciclismo y trekking, elegido por quienes lo usan.
        </p>
      </div>
    </div>
  )
}

function AuthCard({ title, subtitle, image = defaultImage, children, footer }) {
  return (
    <Container as="div" className="py-10 md:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-dark/5 bg-white shadow-xl shadow-primary/10 md:min-h-[720px] md:grid-cols-2">
        <AuthImagePanel image={image} />
        <div className="flex flex-col px-6 py-10 text-left sm:px-12 md:py-14">
          <BrandLogo className="mb-8" />
          <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-dark/60">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-8 border-t border-dark/10 pt-6 text-center text-sm text-dark/70">{footer}</p>}
        </div>
      </div>
    </Container>
  )
}

export default AuthCard
