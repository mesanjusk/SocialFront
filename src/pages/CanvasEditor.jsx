import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showTools, setShowTools] = useState(false);

  useEffect(() => {
    if (!window.fabric) return;
    const c = new window.fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#fff',
    });
    setCanvas(c);

    const saveHistory = () => {
      setHistory(prev => [...prev, c.toJSON()]);
      setRedoStack([]);
    };

    c.on('object:added', saveHistory);
    c.on('object:modified', saveHistory);
    c.on('object:removed', saveHistory);
    c.on('selection:created', () => setShowTools(true));
    c.on('selection:cleared', () => setShowTools(false));

    saveHistory(); // initial state

    return () => c.dispose();
  }, []);

  const addRect = () => {
    if (!canvas) return;
    const rect = new window.fabric.Rect({
      left: 100,
      top: 100,
      fill: 'rgba(0,0,0,0.1)',
      width: 100,
      height: 100,
    });
    canvas.add(rect);
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new window.fabric.Circle({
      left: 150,
      top: 150,
      radius: 50,
      fill: 'rgba(0,0,0,0.1)',
    });
    canvas.add(circle);
  };

  const addText = () => {
    if (!canvas) return;
    const text = new window.fabric.IText('Edit me', {
      left: 200,
      top: 200,
      fontSize: 20,
    });
    canvas.add(text);
  };

  const addImage = e => {
    if (!canvas) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = f => {
      window.fabric.Image.fromURL(f.target.result, img => {
        img.set({ left: 250, top: 250, scaleX: 0.5, scaleY: 0.5 });
        canvas.add(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const undo = () => {
    if (history.length <= 1 || !canvas) return;
    const h = [...history];
    const current = h.pop();
    setRedoStack(r => [...r, current]);
    const prev = h[h.length - 1];
    canvas.loadFromJSON(prev, () => canvas.renderAll());
    setHistory(h);
  };

  const redo = () => {
    if (redoStack.length === 0 || !canvas) return;
    const stack = [...redoStack];
    const next = stack.pop();
    canvas.loadFromJSON(next, () => canvas.renderAll());
    setRedoStack(stack);
    setHistory(h => [...h, next]);
  };

  const handleZoom = e => {
    const z = parseFloat(e.target.value);
    setZoom(z);
    if (canvas) {
      canvas.setZoom(z);
      canvas.setWidth(800 * z);
      canvas.setHeight(600 * z);
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <aside className="w-[10%] border-r bg-gray-50 p-2">Left</aside>

        {/* Canvas Area */}
        <div className="flex-1 relative flex justify-center items-center bg-gray-200">
          {/* Top Toolbar */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-2 rounded shadow">
            <button onClick={addText} className="px-2 py-1 bg-blue-500 text-white rounded">Text</button>
            <button onClick={addRect} className="px-2 py-1 bg-blue-500 text-white rounded">Rect</button>
            <button onClick={addCircle} className="px-2 py-1 bg-blue-500 text-white rounded">Circle</button>
            <label className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer">
              Image
              <input type="file" onChange={addImage} className="hidden" />
            </label>
            <button onClick={undo} className="px-2 py-1 bg-blue-500 text-white rounded">Undo</button>
            <button onClick={redo} className="px-2 py-1 bg-blue-500 text-white rounded">Redo</button>
          </div>

          {/* Zoom control */}
          <div className="absolute right-4 top-2 bg-white p-2 rounded shadow">
            <input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={handleZoom} />
          </div>

          {/* Canvas with rulers */}
          <div className="relative mt-12">
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-200 via-transparent to-transparent text-xs flex justify-between px-2 pointer-events-none">
              {[...Array(9)].map((_,i)=>(<span key={i}>{i*100}</span>))}
            </div>
            <div className="absolute top-0 left-0 bottom-0 w-6 bg-gradient-to-r from-gray-200 via-transparent to-transparent text-xs flex flex-col justify-between py-1 pointer-events-none">
              {[...Array(7)].map((_,i)=>(<span key={i}>{i*100}</span>))}
            </div>
            <canvas ref={canvasRef} className="border" />
          </div>

          {/* Bottom Tools */}
          {showTools && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded shadow flex gap-2">
              <button onClick={() => canvas?.getActiveObject()?.bringForward()} className="px-2 py-1 bg-blue-500 text-white rounded">Forward</button>
              <button onClick={() => canvas?.getActiveObject()?.sendBackwards()} className="px-2 py-1 bg-blue-500 text-white rounded">Backward</button>
              <button onClick={() => { canvas?.remove(canvas?.getActiveObject()); setShowTools(false); }} className="px-2 py-1 bg-blue-500 text-white rounded">Delete</button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="w-1/4 border-l bg-gray-50 p-2">Right</aside>
      </div>
      <Footer />
    </div>
  );
};

export default CanvasEditor;

