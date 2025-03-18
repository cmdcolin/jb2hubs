export function resolve(uri: string, baseUri: string) {
  return new URL(uri, baseUri).href
}

export async function myfetchtext(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.text()
}
