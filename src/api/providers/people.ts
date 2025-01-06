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
  return `${hours}h ${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}m`
}

/**
 * Gets credits for a person.
 * @param params The parameters for the request.
 * @returns The credits as an array of tiles.
 */
export function getCredits(params: { id: string }) {
  return api
    .get(`/person/${params.id}/combined_credits`)
    .then(({ cast }) => convertItemsToTiles(cast.slice(0, 7)))
}

/**
 * Gets information for a person.
 * @param params The parameters for the request.
 * @returns The information as an object.
 */
export function getInfo(params: { id: string }) {
  return api.get(`/person/${params.id}`).then((data) => ({
    backgroundImage: getImageUrl(data.profile_path, 'original'),
    heroContent: {
      title: data.name,
      description: data.biography,
    },
    ...data,
  }))
}
