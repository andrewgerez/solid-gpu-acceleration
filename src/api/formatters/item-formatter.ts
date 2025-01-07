import { truncateString } from '../../utils/string/truncate-string'
import { getImageUrl } from '../index'

export interface Tile {
  src: string
  tileSrc: string
  backdrop: string
  href: string
  shortTitle: string
  title: string
  overview: string
  item: unknown
  entityInfo: {
    type: string
    id: string
  }
  heroContent: {
    title: string
    description: string
  }
}

export function convertItemsToTiles(items: any[] = []): Tile[] {
  return items.map((item) => ({
    src: getImageUrl(item.poster_path || item.profile_path),
    tileSrc: getImageUrl(item.backdrop_path || item.profile_path, 'w300'),
    backdrop: getImageUrl(item.backdrop_path, 'w1280'),
    href: `/entity/${item.media_type || 'people'}/${item.id}`,
    shortTitle: truncateString(item.title || item.name, 30),
    title: item.title || item.name,
    overview: item.overview,
    item,
    entityInfo: {
      type: item.media_type || 'people',
      id: item.id,
    },
    heroContent: {
      title: item.title || item.name,
      description: item.overview,
    },
  }))
}
