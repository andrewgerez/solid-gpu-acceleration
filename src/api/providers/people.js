import api, { getImageUrl } from '..'
import { convertItemsToTiles } from '../formatters/item-formatter'

export function minutesToHMM(minutes) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return (
    hours + 'h ' + (remainingMinutes < 10 ? '0' : '') + remainingMinutes + 'm'
  )
}

export function getCredits({ id }) {
  return api
    .get(`/person/${id}/combined_credits`)
    .then(({ cast }) => convertItemsToTiles(cast.slice(0, 7)))
}

export function getInfo({ id }) {
  return api.get(`/person/${id}`).then((data) => ({
    backgroundImage: getImageUrl(data.profile_path, 'original'),
    heroContent: {
      title: data.title || data.name,
      description: data.biography,
    },
    ...data,
  }))
}
