// Turns a ZodError into { 'variants.0.price': 'message' } so each field can show its own error.
export function zodErrors(error) {
  const errors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (!(key in errors)) errors[key] = issue.message
  }
  return errors
}
