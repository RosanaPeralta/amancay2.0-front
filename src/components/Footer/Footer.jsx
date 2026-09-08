import Container from '../ui/Container'

function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-light py-6">
      <Container className="text-center caption-text">
        <p>© {new Date().getFullYear()} Amancay. All rights reserved.</p>
      </Container>
    </footer>
  )
}

export default Footer
