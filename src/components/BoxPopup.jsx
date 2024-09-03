import React, { useState } from 'react';

function BoxPopup({ box, onClose, onSave }) {
  const [title, setTitle] = useState(box.title || '');
  const [items, setItems] = useState(box.items || []);
  const [newItem, setNewItem] = useState('');
  const [width, setWidth] = useState(box.width || 100);
  const [height, setHeight] = useState(box.height || 100);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSave = () => {
    onSave(title, items, width, height);
  };

  return (
    <div className="box-popup-overlay">
      <div className="box-popup">
        <h3>Box Details</h3>
        <div className="box-title">
          <label htmlFor="box-title">Title:</label>
          <input
            type="text"
            id="box-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter box title"
          />
        </div>
        <div className="box-size">
          <label htmlFor="box-width">Width:</label>
          <input
            type="number"
            id="box-width"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
          <label htmlFor="box-height">Height:</label>
          <input
            type="number"
            id="box-height"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>
        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className="item">
              <span>{item}</span>
              <button onClick={() => handleRemoveItem(index)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="add-item">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter item name"
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
        <div className="popup-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default BoxPopup;
