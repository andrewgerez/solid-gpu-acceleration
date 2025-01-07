import { createResource } from 'solid-js'
import * as provider from './providers/entity'
import type { Tile } from './formatters/item-formatter'

/**
 * Preloads entity data.
 * @param params The entity parameters.
 * @param intent The intent of the preload (e.g. 'preload').
 * @returns The preloaded entity data.
 */
export function entityPreload({ params, intent }: { params: any; intent: string }) {
  const [entity] = createResource(() => ({ ...params }), provider.getInfo)

  if (intent === 'preload') return

  const [credits] = createResource<any, Tile[]>(
    () => ({ ...params }),
    provider.getCredits
  )
  const [recommendations] = createResource<any, Tile[]>(
    () => ({ ...params }),
    provider.getRecommendations
  )

  return { entity, credits, recommendations }
}
