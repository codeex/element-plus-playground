import ReactDOM from "react-dom/client";
import App from "./App";
import * as fabric from 'fabric'

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
console.log(fabric.version);