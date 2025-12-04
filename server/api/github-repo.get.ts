import { createError, defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
	const { repo } = getQuery(event)
	if (typeof repo !== 'string' || !repo.includes('/'))
		throw createError({ statusCode: 400, statusMessage: 'invalid repo' })
	const token = process.env.GH_TOKEN
	const headers: Record<string, string> = { 'User-Agent': 'Nuxt-blog-v3', 'Accept': 'application/vnd.github+json' }
	if (token)
		headers.Authorization = `Bearer ${token}`
	const data = await $fetch(`https://api.github.com/repos/${repo}`, { headers })
	return { name: data.full_name, description: data.description || 'No description', url: data.html_url, stars: data.stargazers_count }
})
