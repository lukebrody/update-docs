# update-docs

`update-docs` allows you to use test cases to populate and update your documentation examples.

With `update-docs`, you can ensure that:

- Your code continues to support your documentation examples.
- The output of your documentation examples remains up-to-date.

## Install

```
npm install -D update-docs
```

## How to Use

### 1. Label code blocks in your documentation

````markdown
<!---My Code⠀Block-->

```typescript

```
````

(Note the three `-`s)

### 2. Set up the `UpdateDocs` class

<!---readme-setup-->

```typescript
import { UpdateDocs } from 'update-docs'

const docs = new UpdateDocs({
    documentationGlobs: ['README.md', 'test/example.md'],
    testGlobs: ['test/README.test.ts'],
    modifyIndent: indent => indent.replace(/\t/g, '    ')
})

beforeAll(() => {
    docs.updateExamples()
})

```

### 3. Write a test case

<!---readme-test-case-->

```javascript
test('addition', () => {
    // start docs My Code Block
    const sum = 2 + 2
    sum // {{sum}}
    // end docs My Code Block
    expect(sum).toBe(4)
    docs.replaceToken('My Code Block', '{{' + 'sum' + '}}', sum.toString())
})
```

### My Code Block

<!---My Code Block-->

```typescript
const sum = 2 + 2
sum // 4
```

### That's it!

Now, when your run your test, `UpdateDocs` will update the code samples in your documentation, run the tests, and replace any tokens with their results.

See the [`UpdateDocs` class](docs/classes/UpdateDocs.html) for more API documentation.

This README is generated using `update-docs`! See [README.test.ts](test/README.test.ts) for that implementation.

(P.S. You can repeat the same code block name in multiple files to keep them in sync.)
