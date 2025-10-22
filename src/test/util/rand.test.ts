import * as assert from 'assert';
import { generateHexString } from "../../core/util/rand";

const HEX_STRINGS = "0123456789abcdef".split("");

suite('Extension Utils Rand', () => {
    test('generateHexString string check', () => {
        const newString = generateHexString();
        const isStringEveryHex = newString.split("").every((s) => {
            return HEX_STRINGS.includes(s);
        });
        assert.strictEqual(24, newString.length);
        assert.strictEqual(true, isStringEveryHex);
    })
});