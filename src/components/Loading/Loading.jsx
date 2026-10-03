function Loading() {
  return (
    <div className="flex justify-center items-center py-10" role="status" aria-label="Cargando">
      <div className="h-8 w-8 rounded-full border-2 border-dark/10 border-t-primary animate-spin" />
    </div>
  )
}

export default Loading
