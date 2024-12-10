import { useContext, useEffect, useRef, useState } from "react";
import CompileWorker from "./compiler.worker?worker";
import { PlaygroundContext } from "../../PlaygroundContext";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { Message } from "../Message";
import { debounce } from "lodash-es";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

export default function Preview() {
  const getIframeUrl = () => {
    const res = iframeRaw
      .replace('class="theme"',`class=${theme}`)
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };
  const { files, theme } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState("");
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());
  const [error, setError] = useState("");
  
  // 接受iframe渲染报错的事件监听
  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === "ERROR") {
      setError(message);
    }
  };

  const compileWorkerRef = useRef<Worker>();
  useEffect(() => {
    if (!compileWorkerRef.current) {
      compileWorkerRef.current = new CompileWorker();
      compileWorkerRef.current.addEventListener("message", ({ data }) => {
        if (data.type === "COMPILED_CODE") {
          setCompiledCode(data.data);
        }
      });
    }
  }, []);

  // 文件变化 重新编译
  useEffect(debounce(() => {
    compileWorkerRef.current?.postMessage(files)
  }, 500), [files])

  // import-map.json文件变化，修改iframe文件内容
  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode, theme]);

  return (
    <div style={{ height: "100%" }}>
      <iframe
        src={iframeUrl}       
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
        }}
      />
      <Message type="error" content={error} />
    </div>
  );
}
