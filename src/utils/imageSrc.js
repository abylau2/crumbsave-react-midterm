// A versioned URL refreshes locally stored photos after an image update.
export function imageSrc(path) {
  return `${path}${path.includes('?') ? '&' : '?'}v=5`;
}
