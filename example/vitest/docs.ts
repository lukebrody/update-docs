// eslint-disable-next-line no-restricted-imports
import { UpdateDocs } from '../../lib/index'

export const docs = new UpdateDocs({
	documentationGlobs: ['**/*.md'],
	testGlobs: ['**/*.test.ts'],
	indent: '\t',
})
