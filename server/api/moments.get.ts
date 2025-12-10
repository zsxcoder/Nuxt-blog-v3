import { defineEventHandler } from 'h3'
import { $fetch } from 'ofetch'

interface MomentsResponse {
  code: number
  data?: {
    list?: any[]
  }
  [key: string]: any
}

const MEMO_API_URL = 'https://moment-api.mcyzsx.top/api/memo/list'
const CACHE_KEY = 'moments:list'
const CACHE_TTL_SECONDS = 60 * 30

export default defineEventHandler(async () => {
  const cache = useStorage('cache')

  const cached = await cache.getItem<MomentsResponse | null>(CACHE_KEY)
  if (cached)
    return cached

  const response = await $fetch<MomentsResponse>(MEMO_API_URL, {
    method: 'POST',
    body: { size: 30 },
  })

  if (response && response.code === 0 && response.data?.list)
    await cache.setItem(CACHE_KEY, response, { ttl: CACHE_TTL_SECONDS })

  return response
})
