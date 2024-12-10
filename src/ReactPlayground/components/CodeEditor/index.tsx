import { useContext } from "react";
import Editor from "./Editor";
import FileNameList from "./FileNameList";
import { PlaygroundContext } from "../../PlaygroundContext";
import { debounce } from "lodash-es";

interface Props {
  theme?: string;
  
}

export default function CodeEditor(props: Props) {
  const { files, selectedFileName,  setFiles } =
    useContext(PlaygroundContext);

  function onEditorChange(value: string | undefined) {
    files[selectedFileName].value = value || "";
    setFiles({
      ...files,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <FileNameList />
      <Editor
        file={files[selectedFileName]}
        onChange={debounce(onEditorChange, 500)}
        options={{
          theme: `vs-${props.theme}`,
        }}
      />
    </div>
  );
}
