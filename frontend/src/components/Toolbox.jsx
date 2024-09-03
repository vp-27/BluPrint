// src/components/Toolbox.jsx
import React from 'react';
import { Undo, Redo, MousePointer, Square, PenTool, Edit3, Eraser } from 'lucide-react';

function Toolbox({ onAddBox, onDrawLine, onDrawFreehand, onDrawEraser, onUndo, onRedo, onCursor, currentMode }) {
  return (
    <div className="toolbox-container">
      <div className='toolbox'>
        <button onClick={onCursor} className={currentMode === 'cursor' ? 'active' : ''}>
          <MousePointer size={20} />
        </button>
        <button onClick={onAddBox} className={currentMode === 'box' ? 'active' : ''}>
          <Square size={20} />
        </button>
        <button onClick={onDrawLine} className={currentMode === 'line' ? 'active' : ''}>
          <Edit3 size={20} />
        </button>
        <button onClick={onDrawFreehand} className={currentMode === 'freehand' ? 'active' : ''}>
          <PenTool size={20} />
        </button>
        <button onClick={onDrawEraser} className={currentMode === 'eraser' ? 'active' : ''}>
          <Eraser size={20} />
        </button>
        <button onClick={onUndo}>
          <Undo size={20} />
        </button>
        <button onClick={onRedo}>
          <Redo size={20} />
        </button>
      </div>
    </div>
  );
}

export default Toolbox;