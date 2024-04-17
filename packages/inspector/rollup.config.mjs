import path from 'path'
import { fileURLToPath } from 'url'
import typescript from '@rollup/plugin-typescript'
import image from '@rollup/plugin-image'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

export default {
	input: 'src/inspector.ts',
	output: {
		file: 'dist/index.js',
		format: 'cjs',
	},
	external: ['react', 'react-dom', '@arco-design', 'react-colorful'],
	plugins: [
		image(),
		typescript({
			tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
			outputToFilesystem: true,
		}),
	],
}
