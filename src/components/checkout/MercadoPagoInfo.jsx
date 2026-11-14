// Explains what happens when paying with Mercado Pago (shown in the payment form).
function MercadoPagoInfo() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 118 0v3" />
        </svg>
      </span>
      <div className="text-left">
        <p className="font-medium text-dark">Vas a pagar en Mercado Pago</p>
        <p className="mt-0.5 text-dark/70">
          Te llevamos a su sitio para pagar con dinero en cuenta o tarjeta. Cuando vuelvas, confirmamos tu pedido
          automáticamente, sin enviar comprobantes.
        </p>
      </div>
    </div>
  )
}

export default MercadoPagoInfo
