export function chunkArray(array: string[], size = 7) {
  let result: string[][] = []
  for (let i = 0, j = array.length; i < j; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
