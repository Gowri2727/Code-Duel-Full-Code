// let rooms = {};
// exports.createRoom = (req, res) => {
//   const { roomCode, user, settings } = req.body;

//   if (!roomCode || !user) {
//     return res.status(400).json({ error: 'Missing data' });
//   }

//   rooms[roomCode] = {
//     users: [{ ...user, isReady: false, isAdmin: true }],
//     settings
//   };

//   res.json({
//     message: 'Room created',
//     roomCode,
//     room: rooms[roomCode]
//   });
// };


// exports.joinRoom = (req, res) => {
//   const { roomCode, user } = req.body;
//   if (!rooms[roomCode]) return res.status(404).json({ error: 'Room not found' });

//   const existing = rooms[roomCode].users.find(u => u.email === user.email);
//   if (!existing) {
//     rooms[roomCode].users.push({ ...user, isReady: false, isAdmin: false });
//   }
//   res.json({ message: 'Joined room', room: rooms[roomCode] });
// };

// exports.updateStatus = (req, res) => {
//   const { roomCode, email, isReady } = req.body;
//   const room = rooms[roomCode];
//   if (!room) return res.status(404).json({ error: 'Room not found' });

//   const user = room.users.find(u => u.email === email);
//   if (user) user.isReady = isReady;

//   res.json({ users: room.users });
// };

// exports.getRoomUsers = (req, res) => {
//   const { roomCode } = req.params;
//   const room = rooms[roomCode];
//   if (!room) return res.status(404).json({ error: 'Room not found' });
//   res.json({ users: room.users });
// };

// exports.leaveRoom = (req, res) => {
//   const { roomCode, email } = req.body;
//   if (rooms[roomCode]) {
//     rooms[roomCode].users = rooms[roomCode].users.filter(u => u.email !== email);
//     if (rooms[roomCode].users.length === 0) delete rooms[roomCode];
//   }
//   res.json({ message: 'Left room' });
// };

// exports.startMatch = (req, res) => {
//   const { roomCode } = req.body;
//   const room = rooms[roomCode];
//   if (!room) return res.status(404).json({ error: 'Room not found' });

//   const allReady = room.users.every(u => u.isReady);
//   if (!allReady) return res.status(400).json({ error: 'Not all users are ready' });

//   res.json({ message: 'Match started', users: room.users });
// };
let rooms = {};

// ✅ Create Room
exports.createRoom = (req, res) => {
  const { roomCode, user, settings } = req.body;

  if (!roomCode || !user) {
    return res.status(400).json({ error: 'Missing data' });
  }

  rooms[roomCode] = {
    users: [{ ...user, isReady: false, isAdmin: true, left: false }],
    settings
  };

  res.json({
    message: 'Room created',
    roomCode,
    room: rooms[roomCode]
  });
};

// ✅ Join Room
exports.joinRoom = (req, res) => {
  const { roomCode, user } = req.body;
  if (!rooms[roomCode]) return res.status(404).json({ error: 'Room not found' });

  const existing = rooms[roomCode].users.find(u => u.email === user.email);
  if (!existing) {
    rooms[roomCode].users.push({ ...user, isReady: false, isAdmin: false, left: false });
  }

  res.json({ message: 'Joined room', room: rooms[roomCode] });
};

// ✅ Update Ready Status
exports.updateStatus = (req, res) => {
  const { roomCode, email, isReady } = req.body;
  const room = rooms[roomCode];
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const user = room.users.find(u => u.email === email);
  if (user) user.isReady = isReady;

  res.json({ users: room.users });
};

// ✅ Get All Users in Room
exports.getRoomUsers = (req, res) => {
  const { roomCode } = req.params;
  const room = rooms[roomCode];
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ users: room.users });
};

// ✅ Leave Room (updated)
exports.leaveRoom = (req, res) => {
  const { roomCode, email } = req.body;

  const room = rooms[roomCode];
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const user = room.users.find(u => u.email === email);
  if (user) user.left = true;

  // Remove from list after marking as left
  setTimeout(() => {
    if (rooms[roomCode]) {
      rooms[roomCode].users = rooms[roomCode].users.filter(u => u.email !== email);
      if (rooms[roomCode].users.length === 0) delete rooms[roomCode];
    }
  }, 3000); // give frontend time to show "X left the room"

  res.json({ message: `${user?.name || 'Someone'} has left`, user: user?.name });
};

// ✅ Start Match
exports.startMatch = (req, res) => {
  const { roomCode } = req.body;
  const room = rooms[roomCode];
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const allReady = room.users.every(u => u.isReady);
  if (!allReady) return res.status(400).json({ error: 'Not all users are ready' });

  res.json({ message: 'Match started', users: room.users });
};
