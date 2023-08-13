import { beforeAll, afterAll, test, expect } from 'vitest'
// start docs readme-setup
import { UpdateDocs } from '../lib/index'

const docs = new UpdateDocs({
	documentationGlobs: ['README.md', 'test/example.md'],
	testGlobs: ['test/README.test.ts'],
	indent: '  '
})

beforeAll(() => {
	docs.updateExamples()
})

// end docs readme-setup
// start docs readme-test-case
test('addition', () => {
	// start-docs My Code Block
	const sum = 2 + 2
	sum // {{sum}}
	// end-docs My Code Block
	expect(sum).toBe(4)
	docs.replaceToken('My Code Block 2', '{{sum}}', sum.toString())
})
// end docs readme-test-case

afterAll(() => {
	docs.replaceToken('readme-setup', '../lib/index', 'update-docs')
	docs.replaceToken('readme-test-case', 'start-docs', 'start docs')
	docs.replaceToken('readme-test-case', 'end-docs', 'end docs')
	docs.replaceToken('readme-test-case', 'My Code Block 2', 'My Code Block')
	docs.write()
})

// start docs My Code Block 2
// {{sum}}
// end docs My Code Block 2