const variants = {
  approved: {
    circle: 'bg-primary/10 text-primary',
    path: 'M5 12.5l4.5 4.5L19 7.5',
  },
  pending: {
    circle: 'bg-secondary/10 text-secondary',
    path: 'M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  failed: {
    circle: 'bg-danger/10 text-danger',
    path: 'M7 7l10 10M17 7L7 17',
  },
}

// Round status icon used on the payment result screens.
function PaymentStatusIcon({ variant }) {
  const { circle, path } = variants[variant]
  return (
    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${circle}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </div>
  )
}

export default PaymentStatusIcon
