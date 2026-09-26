function Stars({ rating }) {
  return (
    <span className="text-info tracking-tight" aria-label={`${rating} out of 5`}>
      {'★'.repeat(rating)}
      <span className="text-dark/20">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

export default Stars
