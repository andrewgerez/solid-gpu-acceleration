import { API_BASE, API_KEY_V4 } from "./constants"

let tmdbConfig: any
let baseImageUrl: string

const basePosterSize = 'w185'

const defaultFetchParams: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY_V4}`,
  },
}

/**
 * Returns the URL for an image.
 * @param path The path to the image.
 * @param posterSize The size of the poster (default: 'w185').
 * @returns The URL for the image.
 */
export function getImageUrl(path: string, posterSize: string = basePosterSize): string {
  return `${baseImageUrl}${posterSize}${path}`
}

/**
 * Makes a GET request to the API.
 * @param path The path to the API endpoint.
 * @param params Optional request parameters.
 * @returns The response data.
 */
function get(path: string, params: RequestInit = {}): Promise<any> {
  if (tmdbConfig) {
    return _get(path, params)
  } else {
    return loadConfig().then(() => _get(path, params))
  }
}

/**
 * Makes a GET request to the API (internal).
 * @param path The path to the API endpoint.
 * @param params Optional request parameters.
 * @returns The response data.
 */
function _get(path: string, params: RequestInit = {}): Promise<any> {
  return fetch(`${API_BASE}${path}`, { ...defaultFetchParams, ...params }).then((r) => r.json())
}

/**
 * Loads the TMDB configuration.
 * @returns The configuration data.
 */
async function loadConfig(): Promise<any> {
  return _get('/configuration').then((data) => {
    tmdbConfig = data
    baseImageUrl = data.images?.secure_base_url
    return data
  })
}

// Export the API
export default {
  get,
  loadConfig,
}
