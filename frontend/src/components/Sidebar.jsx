import React from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { exportToXLSX, importFromXLSX } from '../excelUtils';

function Sidebar({ rooms, selectedRoom, onRoomSelect, onRoomAdd, onRoomRename, onRoomDelete, setRooms, clearAllRooms }) {
  const handleRoomAdd = () => {
    onRoomAdd();
  };

  const handleRoomRename = (index) => {
    const newName = prompt('Enter new room name:', rooms[index]);
    if (newName) {
      onRoomRename(index, newName);
    }
  };

  const handleRoomDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      onRoomDelete(index);
    }
  };

  const handleExport = () => {
    const roomsData = rooms.reduce((acc, room) => {
      acc[room] = JSON.parse(localStorage.getItem(`canvas-elements-${room}`)) || [];
      return acc;
    }, {});
    exportToXLSX(roomsData);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const importedRooms = await importFromXLSX(file);
        
        // Clear existing rooms and data
        clearAllRooms();
        
        // Set new rooms and their data
        setRooms(Object.keys(importedRooms));
        Object.entries(importedRooms).forEach(([room, elements]) => {
          localStorage.setItem(`canvas-elements-${room}`, JSON.stringify(elements));
        });
        
        alert('Import successful!');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Import failed. Please check the file format and try again.');
      }
    }
    // Reset the file input
    event.target.value = '';
  };

  return (
    <aside className="sidebar">
      <h1 style={{ textAlign: 'center' }}>BluPrint</h1>
      <h3 style={{ textAlign: 'center' }}>Room Organizer</h3>
      <br />
      <ul>
        {rooms.map((room, index) => (
          <li
            key={index}
            className={room === selectedRoom ? 'selected' : ''}
            onClick={() => onRoomSelect(room)}
          >
            {room}
            <div className="button-container">
              <button className='edit' onClick={() => handleRoomRename(index)}><Pencil size={16} /></button>
              <button className='trash' onClick={() => handleRoomDelete(index)}><Trash2 size={16} /></button>
            </div>
          </li>
        ))}
      </ul>
      <button className="add-room-btn" onClick={handleRoomAdd}><Plus size={25}/></button>

      <div className="csv-buttons">
        <button onClick={handleExport}>Export</button>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleImport}
          style={{ display: 'none' }}
          id="import-input"
        />
        <label htmlFor="import-input" className="button">
          Import
        </label>
      </div>
    </aside>
  );
}

export default Sidebar;
