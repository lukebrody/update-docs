[update-docs](../README.md) / [Exports](../modules.md) / UpdateDocs

# Class: UpdateDocs

Implements syncing test cases to code examples in documentation files.

1. Create a new [UpdateDocs](UpdateDocs.md) instance. This automatically reads files, but you can use `read()` to re-read them.

1. Use [collectExamples](UpdateDocs.md#collectexamples) to scan through test files and collect code between
`// start docs Example Name`
and
`// end docs Example Name`
comments. Multiple blocks for the same example will be concatenated.

1. Use [replaceExamples](UpdateDocs.md#replaceexamples) to scan through documentation files and update code blocks
under <!---Example Name--> comments.

1. You can use [updateExamples](UpdateDocs.md#updateexamples) to do both of the above at once.

1. Run the tests. Use calls of [replaceToken](UpdateDocs.md#replacetoken) to inject test data into the generated examples.
For example, you might want to have a comment about the value of an expression.

1. Use [write](UpdateDocs.md#write) to write out documentation changes to the file system.

## Table of contents

### Constructors

- [constructor](UpdateDocs.md#constructor)

### Properties

- [documentationFiles](UpdateDocs.md#documentationfiles)
- [documentationGlobs](UpdateDocs.md#documentationglobs)
- [modifyIndent](UpdateDocs.md#modifyindent)
- [testFiles](UpdateDocs.md#testfiles)
- [testGlobs](UpdateDocs.md#testglobs)
- [valueIndent](UpdateDocs.md#valueindent)

### Methods

- [codeBlockInTests](UpdateDocs.md#codeblockintests)
- [collectExamples](UpdateDocs.md#collectexamples)
- [exampleRegex](UpdateDocs.md#exampleregex)
- [read](UpdateDocs.md#read)
- [replaceExamples](UpdateDocs.md#replaceexamples)
- [replaceToken](UpdateDocs.md#replacetoken)
- [stringifyValue](UpdateDocs.md#stringifyvalue)
- [updateExamples](UpdateDocs.md#updateexamples)
- [write](UpdateDocs.md#write)

## Constructors

### constructor

• **new UpdateDocs**(`config`): [`UpdateDocs`](UpdateDocs.md)

Creates a UpdateDocs object. 
The object groups together configuration settings, as well as loads files into memory for quick replacements.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `config` | `Object` | `undefined` |  |
| `config.documentationGlobs` | `string`[] | `undefined` | Globs that specify where the documentation files live. `UpdateDocs` will load these during this constructor. |
| `config.modifyIndent?` | (`indent`: `string`) => `string` | `undefined` | A function that maps an indent in the test file to an indent in the documentation. |
| `config.testGlobs` | `string`[] | `undefined` | Globs that specifies where the test files live. `UpdateDocs` will load these during this constructor. |
| `config.valueIndent?` | `string` | `'  '` | Controls how object and array values are formatted in `replaceToken` |

#### Returns

[`UpdateDocs`](UpdateDocs.md)

#### Defined in

[index.ts:49](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L49)

## Properties

### documentationFiles

• `Private` **documentationFiles**: `File`[] = `[]`

#### Defined in

[index.ts:36](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L36)

___

### documentationGlobs

• **documentationGlobs**: `string`[]

#### Defined in

[index.ts:31](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L31)

___

### modifyIndent

• **modifyIndent**: (`indent`: `string`) => `string`

#### Type declaration

▸ (`indent`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `indent` | `string` |

##### Returns

`string`

#### Defined in

[index.ts:34](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L34)

___

### testFiles

• `Private` **testFiles**: `File`[] = `[]`

#### Defined in

[index.ts:37](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L37)

___

### testGlobs

• **testGlobs**: `string`[]

#### Defined in

[index.ts:32](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L32)

___

### valueIndent

• **valueIndent**: `string`

#### Defined in

[index.ts:33](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L33)

## Methods

### codeBlockInTests

▸ **codeBlockInTests**(): `RegExp`

#### Returns

`RegExp`

A regular expression that defines how to search for a code block in test files.

Override this method to change what test file code blocks look like.

#### Defined in

[index.ts:110](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L110)

___

### collectExamples

▸ **collectExamples**(): `DefaultMap`\<`string`, `string`[]\>

Search through the test files and find blocks of code that should be included in the documentation.

#### Returns

`DefaultMap`\<`string`, `string`[]\>

A map from documentation code block names to arrays of code blocks found in test files.

#### Defined in

[index.ts:119](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L119)

___

### exampleRegex

▸ **exampleRegex**(`exampleName`): `RegExp`

#### Parameters

| Name | Type |
| :------ | :------ |
| `exampleName` | `string` |

#### Returns

`RegExp`

#### Defined in

[index.ts:98](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L98)

___

### read

▸ **read**(): `void`

Re-read the documentation and test files.

#### Returns

`void`

#### Defined in

[index.ts:70](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L70)

___

### replaceExamples

▸ **replaceExamples**(`examples`): `void`

Search through the documentation files and find labeled code blocks that should be updated.
Replace the documentation code blocks with the passed examples.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `examples` | `DefaultMap`\<`string`, `string`[]\> | A map from documentation code block names to arrays of code blocks found in test files. Typically generated by `collectExamples` |

#### Returns

`void`

#### Defined in

[index.ts:145](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L145)

___

### replaceToken

▸ **replaceToken**(`exampleName`, `token`, `value`): `void`

Finds a token in the specified code block and replaces it with a value.

Used for including data generated by tests in the documentation.

`token` must occur exactly once in the example, otherwise an error is thrown.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `exampleName` | `string` | The name of the code example to replace for the token. |
| `token` | `string` \| `RegExp` | The string to search for in the code block. |
| `value` | `unknown` | The value to replace `token` with. |

#### Returns

`void`

#### Defined in

[index.ts:187](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L187)

___

### stringifyValue

▸ **stringifyValue**(`value`): `string`

Used during calls to [replaceToken](UpdateDocs.md#replacetoken) when a non-string value is passed.

Subclass this method to change how token values stringified.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | A non-string value that must be stringified for use in a token. |

#### Returns

`string`

A stringified value suitable for use as a token replacement.

#### Defined in

[index.ts:170](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L170)

___

### updateExamples

▸ **updateExamples**(): `void`

Executes [collectExamples](UpdateDocs.md#collectexamples) and then passes the result to [replaceExamples](UpdateDocs.md#replaceexamples)

#### Returns

`void`

#### Defined in

[index.ts:158](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L158)

___

### write

▸ **write**(): `void`

Write out updated documentation files. 
[UpdateDocs](UpdateDocs.md) will not save any changes unless this is called.

#### Returns

`void`

#### Defined in

[index.ts:92](https://github.com/lukebrody/update-docs/blob/932c6b4/lib/index.ts#L92)
