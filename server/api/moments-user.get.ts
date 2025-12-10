import { defineEventHandler } from 'h3'
import { $fetch } from 'ofetch'

interface UserProfileResponse {
  code: number
  data?: Record<string, any>
  [key: string]: any
}

const USER_API_URL = 'https://moment-api.mcyzsx.top/api/user/profile'
const CACHE_KEY = 'moments:user-profile'
const CACHE_TTL_SECONDS = 60 * 30

export default defineEventHandler(async () => {
  const cache = useStorage('cache')

  const cached = await cache.getItem<UserProfileResponse | null>(CACHE_KEY)
  if (cached)
    return cached

  const response = await $fetch<UserProfileResponse>(USER_API_URL, {
    method: 'POST',
    body: {},
  })

  if (response && response.code === 0 && response.data)
    await cache.setItem(CACHE_KEY, response, { ttl: CACHE_TTL_SECONDS })

  return response
})
