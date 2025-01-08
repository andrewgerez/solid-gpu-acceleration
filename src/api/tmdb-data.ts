import api from '.'
import { convertItemsToTiles } from './formatters/item-formatter'
import { createResource } from 'solid-js'

const handleResults = async (response: Promise<any>, type: string) => {
  const { results } = await response
  const data = results.filter((r: any) => !r.adult)
  return convertItemsToTiles(data, type)
}

const fetchPopular = async (type: string) => {
  const data = await api.get(`/${type}/popular`)
  return handleResults(data, type)
}

const genreListCache = api.get('/genre/movie/list')
const fetchGenreMovies = async (genres: string | string[]) => {
  const targetGenre = Array.isArray(genres) ? genres : [genres]
  const genreList = await genreListCache
  const targetGenreIds = genreList.genres
    .filter((item: any) => targetGenre.includes(item.name))
    .map((item: any) => item.id)
  return handleResults(api.get(`/discover/movie?with_genres=${targetGenreIds.join()}`), 'movie')
}

type RowItem = {
  title: string
  items: any
  type: 'Poster' | 'Hero' | 'PosterTitle'
  height: number
}

export function tmdbData() {
  const rows: RowItem[] = []

  const popularMovies = {
    title: 'Popular Movies',
    items: createResource(() => fetchPopular('movie'))[0],
    type: 'Poster',
    height: 328,
  } as RowItem

  const westernMovies = {
    title: 'Best Western movies',
    items: createResource(() => fetchGenreMovies('Western'))[0],
    type: 'Hero',
    height: 720,
  } as RowItem

  const comedyMovies = {
    title: 'Best Comedy movies',
    items: createResource(() => fetchGenreMovies('Comedy'))[0],
    type: 'PosterTitle',
    height: 400,
  } as RowItem

  const popularTVShows = {
    title: 'Popular TV shows',
    items: createResource(() => fetchPopular('tv'))[0],
    type: 'PosterTitle',
    height: 400,
  } as RowItem

  const heroRow = {
    title: 'Best Adventure and Action movies',
    items: createResource(() => fetchGenreMovies(['adventure', 'action']))[0],
    type: 'Hero',
    height: 720,
  } as const

  const documentaries = {
    title: 'Best Documentaries',
    items: createResource(() => fetchGenreMovies('Documentary'))[0],
    type: 'PosterTitle',
    height: 400,
  } as RowItem

  const westernMovies2 = {
    title: 'Best Western movies 2',
    items: createResource(() => fetchGenreMovies('Western'))[0],
    type: 'PosterTitle',
    height: 400,
  } as RowItem

  rows.push(popularMovies, westernMovies, comedyMovies, popularTVShows, heroRow, documentaries, westernMovies2)

  return { rows }
}

export function destroyData() {
  const heroRow = {
    title: 'Best Adventure and Action movies',
    items: createResource(() => fetchGenreMovies(['adventure', 'action']))[0],
    type: 'Hero',
    height: 800,
  } as const

  return {
    heroRow,
  }
}
