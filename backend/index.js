const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const words = require('./words.json');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Rooms state in memory
const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ roomId, name }) => {
    socket.join(roomId);
    
      if (!rooms[roomId]) rooms[roomId] = { players: [] };
      
    socket.roomId = roomId;
    
    const player = { id: socket.id, name };
    rooms[roomId].players.push(player);
      
    // Tell all players in the room about the updated player list
    io.to(roomId).emit('update_players', rooms[roomId].players);
  });

  socket.on('start_game', async ({ roomId }) => {
    try {
        // Fetch a random word
        const word = words[Math.floor(Math.random() * words.length)];

        // Select a random player to be the impostor
        const players = rooms[roomId].players;
        const impostorIndex = Math.floor(Math.random() * players.length);

        console.log(`Game started in room ${roomId}.`);

        // Send roles and words to each player
        players.forEach((player, index) => {
            const isImpostor = index === impostorIndex;
            io.to(player.id).emit('game_started', {
            role: isImpostor ? 'impostor' : 'citizen',
            word: isImpostor ? '???' : word
            });
        });
    } catch (error) {
        console.error("Error API:", error);
        io.to(roomId).emit('error', 'Hubo un problema al obtener la palabra');
    }
  });
    socket.on('restart_game', (roomId) => {
    io.to(roomId).emit('return_to_lobby');
  });
  socket.on('disconnect', () => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
      
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('update_players', rooms[roomId].players);
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));