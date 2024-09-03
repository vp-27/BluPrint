import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import Toolbox from './Toolbox';
import BoxPopup from './BoxPopup';

function Canvas({ room }) {
  const [elements, setElements] = useState([]);
  const [drawingMode, setDrawingMode] = useState('cursor');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(null);
  const [draggingBoxIndex, setDraggingBoxIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const stageRef = useRef(null);
  const lastClickTime = useRef(0);

  useEffect(() => {
    const roomElements = JSON.parse(localStorage.getItem(`canvas-elements-${room}`)) || [];
    setElements(roomElements);
  }, [room]);

  useEffect(() => {
    localStorage.setItem(`canvas-elements-${room}`, JSON.stringify(elements));
  }, [elements, room]);

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();

    if (drawingMode === 'line' || drawingMode === 'freehand') {
      saveHistory();
      setIsDrawing(true);
      const newElement = {
        type: drawingMode,
        points: [x, y],
      };
      setElements([...elements, newElement]);
    } else if (drawingMode === 'eraser') {
      handleEraser(x, y);
    } else if (drawingMode === 'box') {
      handleAddBox(x, y);
    } else {
      handleBoxInteraction(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && draggingBoxIndex === null) return;

    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();

    if (isDrawing) {
      const lastIndex = elements.length - 1;
      const updatedElements = [...elements];

      if (drawingMode === 'line') {
        updatedElements[lastIndex].points = [updatedElements[lastIndex].points[0], updatedElements[lastIndex].points[1], x, y];
      } else if (drawingMode === 'freehand') {
        updatedElements[lastIndex].points = updatedElements[lastIndex].points.concat([x, y]);
      }

      setElements(updatedElements);
    } else if (draggingBoxIndex !== null) {
      const updatedElements = [...elements];
      updatedElements[draggingBoxIndex] = {
        ...updatedElements[draggingBoxIndex],
        x: x - dragOffset.x,
        y: y - dragOffset.y
      };
      setElements(updatedElements);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (draggingBoxIndex !== null) {
      saveHistory();
    }
    setDraggingBoxIndex(null);
  };

  const handleBoxInteraction = (x, y) => {
    const clickedBoxIndex = elements.findIndex(el =>
      el.type === 'box' &&
      x >= el.x && x <= el.x + el.width &&
      y >= el.y && y <= el.y + el.height
    );

    if (clickedBoxIndex >= 0) {
      const currentTime = new Date().getTime();
      const timeSinceLastClick = currentTime - lastClickTime.current;

      if (timeSinceLastClick < 300) {  // Double-click threshold (300ms)
        setSelectedBoxIndex(clickedBoxIndex);
      } else if (drawingMode === 'cursor') {
        setDraggingBoxIndex(clickedBoxIndex);
        setDragOffset({
          x: x - elements[clickedBoxIndex].x,
          y: y - elements[clickedBoxIndex].y
        });
      }

      lastClickTime.current = currentTime;
    } else {
      setSelectedBoxIndex(null);
    }
  };

  const handleEraser = (x, y) => {
    const clickedElementIndex = elements.findIndex(el => {
      if (el.type === 'box') {
        return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;
      } else if (el.type === 'line' || el.type === 'freehand') {
        return el.points.some((point, index) => {
          return index % 2 === 0 && Math.abs(point - x) < 5 && Math.abs(el.points[index + 1] - y) < 5;
        });
      }
      return false;
    });

    if (clickedElementIndex >= 0) {
      saveHistory();
      const updatedElements = elements.filter((_, index) => index !== clickedElementIndex);
      setElements(updatedElements);
    }
  };

  const handleAddBox = (x, y) => {
    saveHistory();
    const newBox = { type: 'box', x, y, width: 100, height: 100, items: [], title: 'New Box' };
    setElements([...elements, newBox]);
  };

  const saveHistory = () => {
    setHistory([...history, elements]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      setRedoStack([elements, ...redoStack]);
      setElements(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      setHistory([...history, elements]);
      setElements(redoStack[0]);
      setRedoStack(redoStack.slice(1));
    }
  };

  return (
    <div>
      <Stage
        width={1500}
        height={800}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {elements.map((el, index) => {
            if (el.type === 'line' || el.type === 'freehand') {
              return (
                <Line
                  key={index}
                  points={el.points}
                  stroke="black"
                  strokeWidth={el.type === 'freehand' ? 2 : 3}
                  tension={el.type === 'freehand' ? 0.5 : 0}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            }
            if (el.type === 'box') {
              return (
                <React.Fragment key={index}>
                  <Rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill="white"
                    stroke="black"
                  />
                  <Text
                    x={el.x + 10}
                    y={el.y + 10}
                    text={el.title}
                    fontSize={14}
                  />
                </React.Fragment>
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
      {selectedBoxIndex !== null && (
        // Inside the Canvas component's return statement, update the `onSave` function
        <BoxPopup
          box={elements[selectedBoxIndex]}
          onClose={() => setSelectedBoxIndex(null)}
          onSave={(title, items, width, height) => {
            const updatedElements = [...elements];
            updatedElements[selectedBoxIndex] = {
              ...updatedElements[selectedBoxIndex],
              title,
              items,
              width,
              height
            };
            setElements(updatedElements);
            setSelectedBoxIndex(null);
          }}
        />

      )}
      <Toolbox
        onAddBox={() => setDrawingMode('box')}
        onDrawLine={() => setDrawingMode('line')}
        onDrawFreehand={() => setDrawingMode('freehand')}
        onDrawEraser={() => setDrawingMode('eraser')}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCursor={() => setDrawingMode('cursor')}
        currentMode={drawingMode}
      />
    </div>
  );
}

export default Canvas;