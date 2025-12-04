import { load } from 'cheerio'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const url = String(query.url)

	if (!url || !/^https?:\/\//.test(url)) {
		return { title: url, description: '', icon: '' }
	}

	try {
		const html = await $fetch(url, {
			headers: { 'User-Agent': 'Mozilla/5.0 (bot)' },
			timeout: 5000,
		})
		const $ = load(html)

		const title
			= $('meta[property="og:title"]').attr('content')
				|| $('meta[name="twitter:title"]').attr('content')
				|| $('title').text()
				|| url

		const description
			= $('meta[property="og:description"]').attr('content')
				|| $('meta[name="twitter:description"]').attr('content')
				|| $('meta[name="description"]').attr('content')
				|| ''

		let icon
			= $('meta[property="og:image"]').attr('content')
				|| $('meta[name="twitter:image"]').attr('content')
				|| $('link[rel="apple-touch-icon"]').attr('href')
				|| $('link[rel="icon"]').attr('href')
				|| '/favicon.ico'

		if (icon && !icon.startsWith('http')) {
			icon = new URL(icon, url).href
		}

		return { title, description, icon }
	}
	catch {
		return { title: url, description: '', icon: '' }
	}
})
