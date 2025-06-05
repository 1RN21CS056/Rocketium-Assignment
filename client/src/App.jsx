import React from 'react';
import Controls from './components/Controls';
import CanvasArea from './components/CanvasArea';

function App() {
  return (
    <div>
      <h1>Canvas Builder</h1>
      <div className="container">
        <div className="controls">
          <Controls />
        </div>
        <div className="canvas-area">
          <CanvasArea />
        </div>
      </div>
    </div>
  );
}

export default App;
