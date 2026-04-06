import React, { useState } from 'react';
import Modal from '../components/common/Modal';

const sizePresets = {
  A5: { width: 420, height: 595 },
  A4: { width: 595, height: 842 },
  A3: { width: 842, height: 1191 },
};

const BulkGenerator = () => {
  const [showSetup, setShowSetup] = useState(true);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [size, setSize] = useState('A4');
  const [customSize, setCustomSize] = useState({ width: 600, height: 800 });
  const [showSidebar, setShowSidebar] = useState(true);

  const preset = size === 'custom' ? customSize : sizePresets[size];
  const width = orientation === 'portrait' ? preset.width : preset.height;
  const height = orientation === 'portrait' ? preset.height : preset.width;

  return (
    <div className="flex h-screen relative">
      {/* Mobile toggle */}
      <button
        className="sm:hidden absolute top-2 left-2 z-10 bg-blue-600 text-white px-2 py-1 rounded"
        onClick={() => setShowSidebar((v) => !v)}
      >
        ☰
      </button>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 bg-gray-100 border-r p-4 space-y-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() => setShowSizeModal(true)}
          >
            Canvas Size
          </button>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() => setShowTemplateModal(true)}
          >
            Templates
          </button>
          <div className="space-y-2">
            <h3 className="font-semibold">Tools</h3>
            <ul className="text-sm space-y-1">
              <li className="cursor-pointer hover:text-blue-600">Add Text</li>
              <li className="cursor-pointer hover:text-blue-600">Add Image</li>
              <li className="cursor-pointer hover:text-blue-600">Add Shape</li>
            </ul>
          </div>
        </div>
      )}

      {/* Canvas preview */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div
          className="border shadow bg-white flex items-center justify-center"
          style={{ width: width / 2, height: height / 2 }}
        >
          <span className="text-gray-400">Canvas Preview</span>
        </div>
      </div>

      {/* Setup modal */}
      {showSetup && (
        <Modal title="Setup Design" onClose={() => setShowSetup(false)}>
          <div className="space-y-3">
            <button
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={() => {
                setShowSizeModal(true);
                setShowSetup(false);
              }}
            >
              Choose Canvas Size
            </button>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={() => {
                setShowTemplateModal(true);
                setShowSetup(false);
              }}
            >
              Choose Template
            </button>
          </div>
        </Modal>
      )}

      {/* Size modal */}
      {showSizeModal && (
        <Modal title="Canvas Size" onClose={() => setShowSizeModal(false)}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                className={`flex-1 py-1 rounded ${orientation === 'portrait' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setOrientation('portrait')}
              >
                Portrait
              </button>
              <button
                className={`flex-1 py-1 rounded ${orientation === 'landscape' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setOrientation('landscape')}
              >
                Landscape
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['A5', 'A4', 'A3', 'custom'].map((s) => (
                <button
                  key={s}
                  className={`border p-2 rounded ${size === s ? 'bg-blue-500 text-white' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {size === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="number"
                  className="border p-1 flex-1"
                  placeholder="Width"
                  value={customSize.width}
                  onChange={(e) =>
                    setCustomSize({ ...customSize, width: parseInt(e.target.value) || 0 })
                  }
                />
                <input
                  type="number"
                  className="border p-1 flex-1"
                  placeholder="Height"
                  value={customSize.height}
                  onChange={(e) =>
                    setCustomSize({ ...customSize, height: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            )}
            <div className="text-right">
              <button
                onClick={() => setShowSizeModal(false)}
                className="bg-blue-500 text-white py-1 px-4 rounded"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Template modal */}
      {showTemplateModal && (
        <Modal title="Choose Template" onClose={() => setShowTemplateModal(false)}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Template 1', 'Template 2', 'Template 3'].map((t) => (
              <div
                key={t}
                className="h-20 bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
              >
                {t}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BulkGenerator;
