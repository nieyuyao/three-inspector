import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	plugins: [
		react(),
		svgr()
	],
	build: {
		assetsInlineLimit(filePath: string) {
		 	if (filePath.includes('.png')) {
				return true
			}
		}
	}
})
