import Button from '../../components/ui/Button'
import mark from '../../assets/brand/amancay_mark.png'

function BrandBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-white sm:px-12 sm:py-12">
      <div className="absolute -left-16 -bottom-20 h-64 w-64 rounded-full bg-primary-light/15" aria-hidden="true" />
      <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center">
        <span className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-white p-5">
          <img src={mark} alt="" className="w-full" />
        </span>
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-info">Por qué Amancay</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Belleza, resiliencia y devoción.</h2>
          <p className="mt-3 max-w-xl text-sm text-white/80">
            El amancay es una radiante flor andina que florece donde las montañas se encuentran con el cielo. Es el espíritu
            que buscamos llevar a cada viaje que emprendes.
          </p>
          <Button to="/products" className="mt-6 !bg-info !text-dark hover:!bg-info/90">
            Empieza a explorar
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default BrandBanner
