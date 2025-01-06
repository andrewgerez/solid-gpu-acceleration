import api, { getImageUrl } from '..'
import { convertItemsToTiles } from '../formatters/item-formatter'

/**
 * Converts minutes to hours and minutes.
 * @param minutes The number of minutes.
 * @returns The time in hours and minutes.
 */
export function minutesToHMM(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}min`
}

/**
 * Formats a date string in the format "YYYY-MM-DD" to "MM/DD/YYYY".
 * @param dateString The date string.
 * @returns The formatted date string.
 */
function formatDate(dateString: string): string {
  const parts = dateString.split('-')
  return `${parts[1]}/${parts[2]}/${parts[0]}`
}

/**
 * Extracts the year from a date string in the format "YYYY-MM-DD".
 * @param dateString The date string.
 * @returns The year.
 */
function justYear(dateString: string): string {
  const parts = dateString.split('-')
  return parts[0]
}

/**
 * Ensures that an array of items has at least a certain number of items.
 * @param items The array of items.
 * @param minCount The minimum number of items.
 * @returns The array of items, possibly with additional empty items added.
 */
export function ensureItems<T>(items: T[], minCount: number): T[] {
  const remainingCount = minCount - items.length
  if (remainingCount > 0) {
    return [...items, ...Array(remainingCount).fill({})]
  }
  return items
}

/**
 * Gets recommendations for a movie or TV show.
 * @param params The parameters for the request.
 * @returns The recommendations as an array of tiles.
 */
export function getRecommendations(params: { type: string; id: string }) {
  return api.get(`/${params.type}/${params.id}/recommendations`).then(({ results }) => {
    if (results.length) {
      return ensureItems(convertItemsToTiles(results.slice(0, 7)), 7)
    }
    return api
      .get(`/trending/${params.type}/week?page=1`)
      .then(({ results }) => ensureItems(convertItemsToTiles(results.slice(0, 7)), 7))
  })
}

/**
 * Gets credits for a movie or TV show.
 * @param params The parameters for the request.
 * @returns The credits as an array of tiles.
 */
export function getCredits(params: { type: string; id: string }) {
  return api
    .get(`/${params.type}/${params.id}/credits`)
    .then(({ cast }) => ensureItems(convertItemsToTiles(cast.slice(0, 7)), 7))
}

/**
 * Gets information for a movie or TV show.
 * @param params The parameters for the request.
 * @returns The information as an object.
 */
export function getInfo(params: { type: string; id: string }) {
  let rt =
    params.type === 'movie'
      ? {
          rtCrit: 86,
          rtFan: 92,
        }
      : {}

  return api.get(`/${params.type}/${params.id}`).then((data) => ({
    backgroundImage: getImageUrl(data.backdrop_path, 'w1280'),
    heroContent: {
      title: data.title || data.name,
      description: data.overview,
      badges: ['HD', 'CC'],
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
      metaText:
        params.type === 'movie'
          ? `${minutesToHMM(data.runtime)}   ${formatDate(data.release_date)}`
          : `${justYear(data.first_air_date)} - ${justYear(data.last_air_date)}`,
      reviews: rt,
    },
    ...data,
  }))
}
