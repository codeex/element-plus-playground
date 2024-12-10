import { transform } from "@babel/standalone";
import { File, Files } from "../../PlaygroundContext";
import { ENTRY_FILE_NAME } from "../../files";
import { PluginObj } from "@babel/core";

const jsCode2ObjectUrl = (code: string) => {
  return URL.createObjectURL(
    new Blob([code], {
      type: "application/javascript",
    })
  );
};

const css2Js = (file: File) => {
  // 将CSS内容添加到<style>便签中
  const randomId = new Date().getTime();
  const jsCode = `
  (() => {
    const styleSheet = document.createElement('style')
    styleSheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(styleSheet)
    
    const styles = document.createTextNode(\`${file.value}\`)
    styleSheet.innerHTML = ''
    styleSheet.appendChild(styles)
  })()
  `;
  return jsCode2ObjectUrl(jsCode);
};

const json2Js = (file: File) => {
  const code = `export default ${file.value}`;
  return jsCode2ObjectUrl(code);
};

const jsToUrlBabelPlugin = (files: Files): PluginObj => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;
        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath); // 获取import的文件对象
          if (!file) return;
          if (file.name.endsWith(".css")) {
            path.node.source.value = css2Js(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2Js(file);
          } else {
            // tsx文件会在这里编译并转为ObjectUrl
            path.node.source.value = jsCode2ObjectUrl(
              babelTransform(file.name, file.value, files)
            );
          }
        }
      },
    },
  };
};

const getModuleFile: (a: Files, b: string) => File = (files, path) => {
  let moduleName = path.split("./").pop() || "";
  if (!moduleName.includes(".")) {
    // 添加文件后缀名
    const realModuleName = Object.keys(files)
      .filter((fileName) => {
        return (
          fileName.endsWith(".ts") ||
          fileName.endsWith(".tsx") ||
          fileName.endsWith(".js") ||
          fileName.endsWith(".jsx")
        );
      })
      .find((fileName) => {
        return fileName.split(".").includes(moduleName);
      });
    if (realModuleName) moduleName = realModuleName;
  }
  return files[moduleName];
};

// 添加 import React from 'react';
const beforeTransformCode = (name: string, code:string) => {
  let _code = code
  const regexpReact = /import\s+React\s/g
  if((name.endsWith('.jsx') || name.endsWith('.tsx')) && !regexpReact.test(_code)) {
    _code = `import React from 'react';\n${code}`
  }
  return _code
}

/**
 * 转换某个文件内容
 * @param filename 文件名字
 * @param code 文件代码内容
 * @param files 所有文件
 * @returns
 */
export const babelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  code = beforeTransformCode(filename, code)
  let result = "";
  try {
    result = transform(code, {
      presets: [
      //   ["env",
      // {
      //   "useBuiltIns": "entry",
      //   "corejs": "3.22"
      //     }],
        "react", "typescript"],
      filename,
      plugins: [jsToUrlBabelPlugin(files)],
      retainLines: true,
    }).code!;
  } catch (error) {
    console.error("编译出错",error);
  }
  return result;
};

/**
 * 从入口文件main.tsx开始编译
 * @param files
 * @returns 编译结果
 */
export const compile = (files: Files) => {
  const mainFile = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, mainFile.value, files);
};

self.addEventListener('message', ({data}) => {
  try {
    self.postMessage({
      type: 'COMPILED_CODE',
      data: compile(data)
    })
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error
    })
  }
})