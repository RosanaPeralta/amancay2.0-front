import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

function AuthCard({ title, children, footer }) {
  return (
    <Container as="div" className="py-12">
      <div className="max-w-md mx-auto">
        <SectionHeading>{title}</SectionHeading>
        <div className="rounded-lg border border-dark/10 bg-white p-8">{children}</div>
        {footer && <p className="mt-6 text-center text-sm body-text-light">{footer}</p>}
      </div>
    </Container>
  )
}

export default AuthCard
