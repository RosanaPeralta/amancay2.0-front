import { useSelector } from 'react-redux'
import Button from '../../components/ui/Button'
import RecommendationSourceNote from '../../components/Recommendations/RecommendationSourceNote'
import RecommendedProducts from '../../components/Recommendations/RecommendedProducts'
import SectionHeader from './SectionHeader'

const GRID_CLASS = 'sm:grid-cols-2 lg:grid-cols-4 gap-5'
const HOME_LIMIT = 4

function NoFavoritesPrompt() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-3xl border border-dark/5 bg-mist px-6 py-8 text-left sm:flex-row sm:items-center sm:justify-between sm:px-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-secondary">Recomendaciones para vos</p>
        <p className="mt-1 text-lg font-bold text-dark">
          Marcá con <span className="text-info-pink">♥</span> lo que te gusta y te sugerimos equipo a tu medida.
        </p>
      </div>
      <Button to="/products">Explorar productos</Button>
    </div>
  )
}

function ForYouSection({ recommendations }) {
  const { favoritesReady, favoritesCount, basedOnCount, items, status, error, source } = recommendations
  const firstName = useSelector((state) => state.auth.profile?.name)?.split(' ')[0]

  if (!favoritesReady) return null

  return (
    <section className="py-12">
      {favoritesCount === 0 ? (
        <NoFavoritesPrompt />
      ) : (
        <>
          <SectionHeader
            title={firstName ? `Elegidos para vos, ${firstName}` : 'Elegidos para vos'}
            subtitle={status === 'succeeded' && items.length > 0 && (
              <RecommendationSourceNote source={source} favoritesCount={favoritesCount} basedOnCount={basedOnCount} />
            )}
            linkLabel="Ver más"
          />
          <RecommendedProducts
            items={items.slice(0, HOME_LIMIT)}
            status={status}
            error={error}
            gridClass={GRID_CLASS}
            skeletonCount={HOME_LIMIT}
            emptyMessage="Todavía no encontramos productos parecidos a tus favoritos. ¡Seguí explorando el catálogo!"
          />
        </>
      )}
    </section>
  )
}

export default ForYouSection
