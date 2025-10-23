import * as assert from 'assert';
import {
    getFunctionContentFromLineAndCharacter,
    getFileLineAndCharacterFromFunctionName
} from "../core/lsp";
import fork_content from "./stub/lsp/fork_content.json";
import memory_content from "./stub/lsp/memory_content.json";
import path from "path";

// please edit pathToYourDirectory when you want to test it.
const pathToYourDirectory = "/Users/kazuyakurihara/Documents/work/llm/LinuxReader"

suite('Extension LSP', () => {
    // getFunctionContentFromLineAndCharacter
    // 行数・何文字目・ファイルパスから、関数の内容を取得
    // fork.c
	test('getFunctionContentFromLineAndCharacter fork.c', async() => {
        const stubFilePath = path.resolve(pathToYourDirectory, "src", "test", "stub", "lsp", "fork.c");
        for(let i = 0; i < fork_content.length; i++) {
            const currentFileContent = fork_content[i];
            const functionContent = await getFunctionContentFromLineAndCharacter(
                stubFilePath,
                currentFileContent.line,
                currentFileContent.character
            );
            assert.strictEqual(functionContent, currentFileContent.content);
            // console.log("PASSED : getFunctionContentFromLineAndCharacter @ ", currentFileContent.functionName);
        }
    });

    // memory.c
    test('getFunctionContentFromLineAndCharacter memory.c', async() => {
        const stubFilePath = path.resolve(pathToYourDirectory, "src", "test", "stub", "lsp", "memory.c");
        for (let i = 0; i < memory_content.length; i++) {
            const currentFileContent = memory_content[i];
            if (currentFileContent.skipGetFunction) continue;
            const functionContent = await getFunctionContentFromLineAndCharacter(
                stubFilePath,
                currentFileContent.line,
                currentFileContent.character
            );
            assert.strictEqual(functionContent, currentFileContent.content);
        }
    })

    // getFileLineAndCharacterFromFunctionName
    // 関数の先頭１行目とファイルパスから、行数・何文字目かを取得
    // fork.c
    test('getFileLineAndCharacterFromFunctionName fork.c', async () => {
        const stubFilePath = path.resolve(pathToYourDirectory, "src", "test", "stub", "lsp", "fork.c");
        for(let i = 0; i < fork_content.length; i++) {
            const currentFileContent = fork_content[i];
            const [line, character] = await getFileLineAndCharacterFromFunctionName(
                stubFilePath,
                currentFileContent.functionName,
                currentFileContent.functionName
            )
            assert.strictEqual(currentFileContent.line, line);
            assert.strictEqual(currentFileContent.character, character);
            // console.log("PASSED : getFileLineAndCharacterFromFunctionName @ ", currentFileContent.functionName);
        }
    });
    // memory.c
    test('getFileLineAndCharacterFromFunctionName memory.c', async() => {
        const stubFilePath = path.resolve(pathToYourDirectory, "src", "test", "stub", "lsp", "memory.c");
        for (let i = 0; i < memory_content.length; i++) {
            const currentFileContent = memory_content[i];
            const [line, character] = await getFileLineAndCharacterFromFunctionName(
                stubFilePath,
                currentFileContent.functionName,
                currentFileContent.functionName,
                false, 
                true,
            );
            assert.strictEqual(currentFileContent.line, line);
            assert.strictEqual(currentFileContent.character, character);
        }
    })
});