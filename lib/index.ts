import { DefaultMap } from '@notwoods/default-map'
import { globSync } from 'glob'
import * as fs from 'fs'
// @ts-expect-error Module problems
import stringify from '@aitodotai/json-stringify-pretty-compact'

type File = { readonly path: string; contents: string }

/**
 * Implements syncing test cases to code examples in documentation files.
 *
 * 1. Create a new {@link UpdateDocs} instance. This automatically reads files, but you can use `read()` to re-read them.
 * 
 * 1. Use {@link collectExamples} to scan through test files and collect code between
 * `// start docs Example Name`
 * and
 * `// end docs Example Name`
 * comments. Multiple blocks for the same example will be concatenated.
 *
 * 1. Use {@link replaceExamples} to scan through documentation files and update code blocks
 * under <!---Example Name--> comments.
 *
 * 1. You can use {@link updateExamples} to do both of the above at once.
 *
 * 1. Run the tests. Use calls of {@link replaceToken} to inject test data into the generated examples.
 * For example, you might want to have a comment about the value of an expression.
 * 
 * 1. Use {@link write} to write out documentation changes to the file system.
 */
export class UpdateDocs {
	documentationGlobs: string[]
	testGlobs: string[]
	indent: string

	private documentationFiles: File[] = []
	private testFiles: File[] = []

	private id = Math.random()

	/**
	 * Creates a UpdateDocs object. 
	 * The object groups together configuration settings, as well as loads files into memory for quick replacements.
	 * 
	 * @param config
	 * @param config.documentationGlobs - Globs that specify where the documentation files live. `UpdateDocs` will load these during this constructor.
	 * @param config.testGlobs - Globs that specifies where the test files live. `UpdateDocs` will load these during this constructor.
	 * @param config.indent - Controls how object and array values are formatted in `replaceToken`
	 */
	constructor({
		documentationGlobs,
		testGlobs,
		indent,
	}: {
		documentationGlobs: string[]
		testGlobs: string[]
		indent: string
	}) {
		this.documentationGlobs = documentationGlobs
		this.testGlobs = testGlobs
		this.indent = indent
		this.read()
	}

	/**
	 * Re-read the documentation and test files.
	 */
	read() {
		// In case documentation and test files overlap, they should share the same instances
		const loadedFiles = new Map<string, File>()
		function readFiles(glob: string[]): File[] {
			return globSync(glob).map((path) => {
				if (!loadedFiles.has(path)) {
					loadedFiles.set(path, {
						path,
						contents: fs.readFileSync(path).toString(),
					})
				}
				return loadedFiles.get(path)!
			})
		}
		this.documentationFiles = readFiles(this.documentationGlobs)
		this.testFiles = readFiles(this.testGlobs)
	}

	/**
	 * Write out updated documentation files. 
	 * {@link UpdateDocs} will not save any changes unless this is called.
	 */
	write() {
		for (const { path, contents } of this.documentationFiles) {
			fs.writeFileSync(path, contents)
		}
	}

	exampleRegex(exampleName: string): RegExp {
		return new RegExp(
			`(<!---${exampleName}-->\\s*\`\`\`[A-z0-9]*)(.+?)(\`\`\`)`,
			'gs',
		)
	}

	/**
	 * @returns A regular expression that defines how to search for a code block in test files.
	 * 
	 * Override this method to change what test file code blocks look like.
	 */
	codeBlockInTests(): RegExp {
		return /(?:^|\n)([^\S\n]*)\/\/ start docs (.+?)\n(.+?)\n[^\S\n]*\/\/ end docs \2/gs
	}

	/**
	 * Search through the test files and find blocks of code that should be included in the documentation.
	 * 
	 * @returns A map from documentation code block names to arrays of code blocks found in test files.
	 */
	collectExamples(): DefaultMap<string, string[]> {
		const result = new DefaultMap<string, string[]>(() => [])

		const scan = (text: string) => {
			for (const [, indent, exampleName, code] of text.matchAll(
				this.codeBlockInTests(),
			)) {
				const dedentedCode = code.replaceAll(new RegExp(`^${indent}`, 'gm'), '')
				result.get(exampleName).push(dedentedCode)
				scan(dedentedCode)
			}
		}

		for (const { contents } of this.testFiles) {
			scan(contents)
		}

		return result
	}

	/**
	 * Search through the documentation files and find labeled code blocks that should be updated.
	 * Replace the documentation code blocks with the passed examples.
	 * 
	 * @param examples - A map from documentation code block names to arrays of code blocks found in test files. Typically generated by `collectExamples`
	 */
	replaceExamples(examples: DefaultMap<string, string[]>): void {
		const pattern = this.exampleRegex('(.+?)')
		for (const file of this.documentationFiles) {
			file.contents = file.contents.replaceAll(pattern, (...args) => {
				const [, header, exampleName, , end] = args as string[]
				return [header, examples.get(exampleName).join('\n'), end].join('\n')
			})
		}
	}

	/**
	 * Executes {@link collectExamples} and then passes the result to {@link replaceExamples}
	 */
	updateExamples(): void {
		this.replaceExamples(this.collectExamples())
	}

	/**
	 * Used during calls to {@link replaceToken} when a non-string value is passed.
	 * 
	 * Subclass this method to change how token values stringified.
	 * 
	 * @param value A non-string value that must be stringified for use in a token.
	 * @returns A stringified value suitable for use as a token replacement.
	 */
	stringifyValue(value: unknown): string {
		return typeof value === 'string'
			? value
			: stringify(value, { indent: this.indent, margins: true })
	}

	/**
	 * Finds a token in the specified code block and replaces it with a value.
	 * 
	 * Used for including data generated by tests in the documentation.
	 * 
	 * `token` must occur exactly once in the example, otherwise an error is thrown.
	 * 
	 * @param exampleName The name of the code example to replace for the token.
	 * @param token The string to search for in the code block.
	 * @param value The value to replace `token` with.
	 */
	replaceToken(
		exampleName: string,
		token: RegExp | string,
		value: unknown,
	): void {
		const pattern = this.exampleRegex(exampleName)
		const stringValue = this.stringifyValue(value)
		for (const file of this.documentationFiles) {
			file.contents = file.contents.replaceAll(pattern, (...args) => {
				const [, header, content, end] = args as string[]
				const count = Array.from(content.matchAll(token as RegExp)).length 
				if (count !== 1) {
					throw new Error(`token ${token} appeared ${count} times`)
				}
				const replacedContent = content.replaceAll(token, stringValue)
				return [header, replacedContent, end].join('')
			})
		}
	}
}