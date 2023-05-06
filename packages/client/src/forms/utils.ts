export const handleEnter = (event: any, callback?: () => void) => {
  if (event.key === 'Enter') {
    event.target.blur()

    if (callback) {
      callback()
    }
  }
}
