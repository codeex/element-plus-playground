import { useEffect, useState } from 'react'
import * as fabric from 'fabric'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [fabricVersion] = useState(fabric.version) 
  useEffect(() => {
    const canvas = new fabric.Canvas('game');
    // create a rectangle object
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'green',
      width: 400,
      height: 200
    });

    // "add" rectangle onto canvas
    canvas.add(rect);
  },[])
  
  
  return (
    <>
      <h1>Hello World</h1>
      <div><canvas width="600" height="400" id="game"></canvas></div>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>支持React: {count}</button>
      </div>
      <div>FabricJs Version: {fabricVersion} © 2024 <a href="https://blog.csdn.net/codeex" target="_blank">webmote</a>.</div>
    </>
  )
}

export default App
