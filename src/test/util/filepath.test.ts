import * as assert from 'assert';
import {
    addFilePrefixToFilePath,
    removeFilePrefixFromFilePath
} from "../../core/util/filepath";

suite('Extension Utils FilePath', () => {
    test('addFilePrefixToFilePath original', () => {
        const originalFilePath = "file:///path/to/files";
        assert.strictEqual(
            true, 
            originalFilePath === addFilePrefixToFilePath(originalFilePath)
        );
    });
    test('addFilePrefixToFilePath addition', () => {
        const additionFilePath = "/path/to/files";
        assert.strictEqual(
            false,
            additionFilePath === addFilePrefixToFilePath(additionFilePath)
        );
        assert.strictEqual(
            true,
            `file://${additionFilePath}` === addFilePrefixToFilePath(additionFilePath)
        );
    });
    test('removeFilePrefixFromFilePath original', () => {
        const originalFilePath = "/path/to/files";
        assert.strictEqual(
            true,
            originalFilePath === removeFilePrefixFromFilePath(originalFilePath)
        );
    })
    test('removeFilePrefixFromFilePath removal', () => {
        const removalFilePath = "file:///path/to/files";
        const originalFilePath = "/path/to/files";
        assert.strictEqual(
            false,
            removalFilePath === removeFilePrefixFromFilePath(removalFilePath)
        );
        assert.strictEqual(
            true,
            originalFilePath === removeFilePrefixFromFilePath(removalFilePath)
        );
    });
});