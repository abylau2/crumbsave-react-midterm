// A versioned URL refreshes locally stored images after an asset update.
export function imageSrc(path) {
  return `${path}${path.includes('?') ? '&' : '?'}v=7`;
}
