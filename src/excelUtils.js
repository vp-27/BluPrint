import * as XLSX from 'xlsx';

export const exportToXLSX = (rooms) => {
  const data = [];

  Object.entries(rooms).forEach(([roomName, elements]) => {
    elements.forEach(el => {
      if (el.type === 'box') {
        data.push({
          Room: roomName,
          Type: 'Box',
          X: el.x,
          Y: el.y,
          Width: el.width,
          Height: el.height,
          Title: el.title,
          Items: el.items.join(';'),
          Points: ''
        });
      } else if (el.type === 'line' || el.type === 'freehand') {
        data.push({
          Room: roomName,
          Type: el.type,
          X: '',
          Y: '',
          Width: '',
          Height: '',
          Title: '',
          Items: '',
          Points: el.points.join(';')
        });
      }
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Room Layout");

  XLSX.writeFile(workbook, "room_layout.xlsx");
};

export const importFromXLSX = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const rooms = {};

        jsonData.forEach(row => {
          if (row.Room && row.Type) {
            if (!rooms[row.Room]) {
              rooms[row.Room] = [];
            }

            if (row.Type === 'Box') {
              rooms[row.Room].push({
                type: 'box',
                x: parseFloat(row.X),
                y: parseFloat(row.Y),
                width: parseFloat(row.Width),
                height: parseFloat(row.Height),
                title: row.Title || 'New Box',
                items: row.Items ? row.Items.split(';') : []
              });
            } else if (row.Type === 'line' || row.Type === 'freehand') {
              rooms[row.Room].push({
                type: row.Type.toLowerCase(),
                points: row.Points.split(';').map(Number)
              });
            }
          }
        });

        resolve(rooms);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};