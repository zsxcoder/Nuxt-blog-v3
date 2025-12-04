/* plugins/meting.client.ts */
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
	/* 防止重复加载 */
	if (document.querySelector('#meting-script'))
		return

	/* 1. APlayer */
	const aplayerScript = document.createElement('script')
	aplayerScript.src = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js'
	document.head.appendChild(aplayerScript)

	const aplayerLink = document.createElement('link')
	aplayerLink.rel = 'stylesheet'
	aplayerLink.href = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css'
	document.head.appendChild(aplayerLink)

	/* 2. Meting */
	const metingScript = document.createElement('script')
	metingScript.id = 'meting-script'
	metingScript.src = 'https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js'
	document.head.appendChild(metingScript)
})
