import MonacoEditor, { OnMount, EditorProps,loader } from "@monaco-editor/react";
import { createATA } from "./ata";
import * as monaco from "monaco-editor";
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });
//loader.config({ monaco });

export interface EditorFile {
  name: string;
  value: string;
  language: string;
}

interface Props {
  file: EditorFile;
  onChange?: EditorProps["onChange"];
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export default function Editor(props: Props) {
  const { file, onChange, options } = props;  
  
  const handleEditorMount: OnMount = (editor, monaco) => {
    // 设置格式化快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });

    // let actions = editor.getSupportedActions().map(a => a.id)
    // 查看支持的actions

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve, // 设置 jsx 为 preserve，也就是输入 <div> 输出 <div>，保留原样
      esModuleInterop: true, // 设置 esModuleInterop 会在编译的时候自动加上 default 属性
    });

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());

    editor.render(true)
    
  };
  
  
  return (
    <MonacoEditor     
      height={"100%"}      
      path={file.name}
      language={file.language}
      onMount={handleEditorMount}
      onChange={onChange}
      value={file.value}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false, // 不展示代码缩略图
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options,
      }}
    />
  );
}
