import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "./components/Header";
import Preview from "./components/Preview";
import CodeEditor from "./components/CodeEditor";
import { useContext } from "react";
import { PlaygroundContext } from "./PlaygroundContext";
import "./index.scss"

export default function ReactPlayground() {
  const { theme } = useContext(PlaygroundContext);  
  
  return (
    <div style={{ height: "100vh" }} className={theme}>
      <Header></Header>
      <Allotment defaultSizes={[100, 100]} className="mainSpan">
        <Allotment.Pane minSize={500}>
          <CodeEditor theme={theme} />
        </Allotment.Pane>
        <Allotment.Pane minSize={0}>
          <Preview />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
