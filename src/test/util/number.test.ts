import * as assert from 'assert';
import { is7wordString } from "../../core/util/number";

suite('Extension Utils Number', () => {
	test('is7wordString length check', () => {
		const length6Words = "aaaaaa";
		const length8Words = "aaaaaaaa";
		const length7Words = "aaaaaaa";
		assert.strictEqual(false, is7wordString(length6Words));
		assert.strictEqual(false, is7wordString(length8Words));
		assert.strictEqual(true, is7wordString(length7Words));
    });
	test('is7wordString hex check', () => {
		const notHexAlphabetWords1 = "zaaaaaa";
		const notHexAlphabetWords2 = "z000000";
		const notHexJapaneseWords1 = "あaaaaaa";
		const notHexJapaneseWords2 = "あ000000";
		const hexAlphabetWords = "aaaaaaa";
		const hexNumberWords = "1111111";
		const hexWords = "abcdef9"
		assert.strictEqual(false, is7wordString(notHexAlphabetWords1));
		assert.strictEqual(false, is7wordString(notHexAlphabetWords2));
		assert.strictEqual(false, is7wordString(notHexJapaneseWords1));
		assert.strictEqual(false, is7wordString(notHexJapaneseWords2));
		assert.strictEqual(true, is7wordString(hexAlphabetWords));
		assert.strictEqual(true, is7wordString(hexNumberWords));
		assert.strictEqual(true, is7wordString(hexWords));
	})
});

