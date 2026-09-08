function SectionHeading({ as: Tag = 'h2', className = '', children }) {
  return (
    <Tag className={`subtitle-primary text-3xl text-primary font-semibold text-center mb-10 ${className}`}>
      {children}
    </Tag>
  )
}

export default SectionHeading
