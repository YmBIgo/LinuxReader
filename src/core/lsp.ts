import fs from "fs/promises";

export async function getFunctionContentFromLineAndCharacter(
  filePath: string,
  line: number,
  character: number
) {
  let originalFileContent: string = "";
  console.log(filePath, line, character);
  try {
    originalFileContent = await fs.readFile(filePath, "utf-8");
  } catch (e) {
    console.error(e);
    return "";
  }
  const fileContentSplit = originalFileContent.split("\n");
  const fileContentStart = fileContentSplit.slice(line);
  const failSafeFileContent = fileContentSplit
    .slice(line, line + 20)
    .join("\n");
  // care #define
  const isFileStartWithDefine = fileContentStart[0].startsWith("#define");
  const defineName = /#define\s([a-zA-Z0-9_]+)\s/g.exec(fileContentStart[0])?.[1] || "not matched";
  if (isFileStartWithDefine) {
    const isNotDefine = fileContentSplit
      .slice(line + 1, line + 20)
      .findIndex((l) => l.includes(" " + defineName));
    if (isNotDefine === -1) {
      const backSlashPos = fileContentSplit
        .slice(line, line+40)
        .findIndex((f) => !f.endsWith("\\"));
      let fixedBackSlashPos = backSlashPos <= -1 ? 0 : backSlashPos;
      const backSlashConsideredDefine = fileContentStart.slice(0, fixedBackSlashPos + 1);
      return backSlashConsideredDefine.join("\n");
    }
  }
  if (!failSafeFileContent.includes("{")) {
    return fileContentSplit.slice(line, line + 5).join("\n");
  }
  let fileResultArray = [];
  let startArrowCount = 0;
  let endArrowCount = 0;
  let isLongComment = false;
  for (let row of fileContentStart) {
    fileResultArray.push(row);
    if (row.replace(/\s\t/g, "").startsWith("//")) {
      continue;
    }
    let commentStartIndex: number = -1;
    let commentEndIndex: number = -1;
    const longCommentStart = row.matchAll(/\/\*/g);
    const longCommentEnd = row.matchAll(/\*\//g);
    for (const start_m of longCommentStart) {
      commentStartIndex = start_m.index;
      // 最初で破棄
      break;
    }
    for (const end_m of longCommentEnd) {
      // 最後まで読む
      commentEndIndex = end_m.index;
    }
    if (
      commentStartIndex !== -1 &&
      commentEndIndex !== -1 &&
      commentStartIndex < commentEndIndex
    ) {
      // 1行のコメントなのでskip
    } else if (isLongComment && commentEndIndex !== -1) {
      // 一旦複雑なケースは考慮しない（コメントの中でのコメント定義など）
      isLongComment = false;
    } else if (!isLongComment && commentStartIndex !== -1) {
      isLongComment = true;
    }
    if (isLongComment) {
      continue;
    }
    startArrowCount += row.match(/\{/g)?.length ?? 0;
    endArrowCount += row.match(/\}/g)?.length ?? 0;
    if (
      startArrowCount === endArrowCount &&
      startArrowCount + endArrowCount !== 0
    ) {
      return fileResultArray.join("\n");
    }
  }
  console.error("error", startArrowCount, endArrowCount);
  return "";
}

export async function getFileLineAndCharacterFromFunctionName(
  filePath: string,
  codeLine: string,
  functionName: string,
  isFirst: boolean = false,
  isSearchNameOnly: boolean = false,
): Promise<[number, number]> {
  let fileContent: string = "";
  try {
    fileContent = await fs.readFile(filePath, "utf-8");
  } catch (e) {
    console.error(e);
    return [-1, -1];
  }
  console.log(filePath, functionName, isFirst);
  const memberAccessFunction = functionName.split("->");
  const memberAccessFunctionName =
    memberAccessFunction[memberAccessFunction.length - 1];
  const wholeFunctionName = !memberAccessFunctionName.includes("(") && memberAccessFunction.length === 1
    ? memberAccessFunctionName + "("
    : memberAccessFunction.length > 1
    ? "->" + memberAccessFunctionName
    : memberAccessFunctionName;
  const splittedWholeFunctionName = wholeFunctionName.split(",")[0].replace(/^[\s\t]*/g, "");
  const simplfiedFunctionName = isFirst || memberAccessFunction.length > 1
    ?
    [
      splittedWholeFunctionName,
      "*" + splittedWholeFunctionName
    ]
    :
    [
      " " + splittedWholeFunctionName,
      "\t" + splittedWholeFunctionName,
      " *" + splittedWholeFunctionName,
      "\t*" + splittedWholeFunctionName,
    ];
  const searchNameOnlyFunctionName = isSearchNameOnly
    ?
    [
      "(" + splittedWholeFunctionName,
      ")" + splittedWholeFunctionName,
      "!" + splittedWholeFunctionName
    ]
    :
    [];
  const fileContentArray = fileContent.split("\n");
  let isLongComment = false;
  for (let i in fileContentArray) {
    let index = isNaN(Number(i)) ? -1 : Number(i);
    const row = fileContentArray[index];
    if (row.replace(/\s\t/g, "").startsWith("//")) {
      continue;
    }
    let commentStartIndex: number = -1;
    let commentEndIndex: number = -1;
    const longCommentStart = row.matchAll(/\/\*/g);
    const longCommentEnd = row.matchAll(/\*\//g);
    for (const start_m of longCommentStart) {
      commentStartIndex = start_m.index;
      // 最初で破棄
      break;
    }
    for (const end_m of longCommentEnd) {
      // 最後まで読む
      commentEndIndex = end_m.index;
    }
    if (
      commentStartIndex !== -1 &&
      commentEndIndex !== -1 &&
      commentStartIndex < commentEndIndex
    ) {
      // 1行のコメントなのでskip
    } else if (isLongComment && commentEndIndex !== -1) {
      // 一旦複雑なケースは考慮しない（コメントの中でのコメント定義など）
      isLongComment = false;
    } else if (!isLongComment && commentStartIndex !== -1) {
      isLongComment = true;
    }
    if (isLongComment) {
      continue;
    }
    let functionIndex = row.indexOf(simplfiedFunctionName[0]);
    if (!isFirst && functionIndex >= 0) {
      if (memberAccessFunction.length > 1) {
        functionIndex += 2;
      } else {
        functionIndex += 1;
      }
    }
    if (functionIndex === -1 && simplfiedFunctionName.length > 1) {
      for (let i = 1; i < simplfiedFunctionName.length; i++) {
        functionIndex = row.indexOf(simplfiedFunctionName[i]);
        if (functionIndex >= 0) {
          if (i > 1 || isFirst) {
            functionIndex += 2;
          }else {
            functionIndex += 1;
          }
          break;
        }
      }
      // special care for wierd indent...
      // such like `copy_p4d_range`
      if (row.startsWith(splittedWholeFunctionName)) {
        functionIndex = 0;
      }
      // if user only want to search function name, care it.
      if (functionIndex === -1 && searchNameOnlyFunctionName.length !== 0) {
        for (let j = 0; j < searchNameOnlyFunctionName.length; j++) {
          functionIndex = row.indexOf(searchNameOnlyFunctionName[j]);
          if (functionIndex !== -1) {
            functionIndex += 1;
            break;
          }
        }
      }
    }
    if (functionIndex >= 0) {
      return [index, functionIndex];
    }
  }
  return [-1, -1];
}
