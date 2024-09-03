import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Popup from './components/Popup';
import './App.css';

const App = () => {
  const [rooms, setRooms] = useState(() => {
    const storedRooms = localStorage.getItem('rooms');
    return storedRooms ? JSON.parse(storedRooms) : ['Basement'];
  });
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [showPopup, setShowPopup] = useState(() => {
    return !localStorage.getItem('popupDismissed');
  });

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    if (!rooms.includes(selectedRoom)) {
      setSelectedRoom(rooms[0] || '');
    }
  }, [rooms, selectedRoom]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleRoomAdd = () => {
    const newRoom = `Room ${rooms.length + 1}`;
    setRooms(prevRooms => [...prevRooms, newRoom]);
    setSelectedRoom(newRoom);
  };

  const handleRoomRename = (index, newName) => {
    setRooms(prevRooms => {
      const updatedRooms = [...prevRooms];
      updatedRooms[index] = newName;
      return updatedRooms;
    });
    if (selectedRoom === rooms[index]) {
      setSelectedRoom(newName);
    }
  };

  const clearAllRooms = () => {
    rooms.forEach(room => {
      localStorage.removeItem(`canvas-elements-${room}`);
    });
    setRooms([]);
    setSelectedRoom('');
    localStorage.removeItem('rooms');
  };

  const handleRoomDelete = (index) => {
    const roomToDelete = rooms[index];
    setRooms(prevRooms => prevRooms.filter((_, i) => i !== index));
    localStorage.removeItem(`canvas-elements-${roomToDelete}`);
    if (selectedRoom === roomToDelete) {
      setSelectedRoom(rooms[0] || '');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('popupDismissed', 'true');
  };

  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const toolbox = document.querySelector('.toolbox');
    const toolboxToggle = document.querySelector('.toolbox-toggle');

    const handleSidebarToggle = () => {
      sidebar.classList.toggle('expanded');
    };

    const handleToolboxToggle = () => {
      toolbox.classList.toggle('expanded');
    };

    sidebarToggle.addEventListener('click', handleSidebarToggle);
    toolboxToggle.addEventListener('click', handleToolboxToggle);

    return () => {
      sidebarToggle.removeEventListener('click', handleSidebarToggle);
      toolboxToggle.removeEventListener('click', handleToolboxToggle);
    };
  }, []);

  return (
    <div className="app-container">
      <Popup show={showPopup} onClose={handleClosePopup} />
      <div className="main-content">
        <button class="sidebar-toggle">☰</button>
        <button class="toolbox-toggle">🛠️</button>
        <Sidebar
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={handleRoomSelect}
          onRoomAdd={handleRoomAdd}
          onRoomRename={handleRoomRename}
          onRoomDelete={handleRoomDelete}
          setRooms={setRooms}
          clearAllRooms={clearAllRooms}
        />
        <Canvas room={selectedRoom} />
      </div>
    </div>
  );
};

export default App;
