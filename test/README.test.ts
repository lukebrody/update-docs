import { beforeAll, afterAll, test, expect } from 'vitest'
// start docs readme-setup
import { UpdateDocs } from '../lib/index'

const docs = new UpdateDocs({
	documentationGlobs: ['**/*.md'],
	testGlobs: ['test/**.test.ts'],
	modifyIndent: indent => indent.replace(/\t/g, '    ')
})

beforeAll(() => {
	docs.updateExamples()
})

// end docs readme-setup
// start docs readme-test-case
test('addition', () => {
	// start docs My Code Block
	const sum = 2 + 2
	sum // {{sum}}
	// end docs My Code Block
	expect(sum).toBe(4)
	docs.replaceToken('My Code Block', '{{' + 'sum' + '}}', sum)
})
// end docs readme-test-case

// start docs readme-save
afterAll(() => {
	// end docs readme-save
	docs.replaceToken('readme-setup', '../lib/index', 'update-docs')
	// eslint-disable-next-line indent
// start docs readme-save
	docs.write()
})
// end docs readme-save
