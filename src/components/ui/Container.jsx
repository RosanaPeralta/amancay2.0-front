function Container({ as: Tag = 'div', className = '', children }) {
  return <Tag className={`max-w-6xl mx-auto px-6 ${className}`}>{children}</Tag>
}

export default Container
