import { test } from 'vitest'
import { docs } from './docs'

test('random number generator', () => {
	// start docs random number generator
	Math.random() // result
	// end docs
	docs.replaceToken('random number generator', 'result', Math.random().toString())
})