import { Server, Socket } from 'socket.io';

const onlineUsers = new Map<string, string>();

export const setupWebSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('user:online', (userId: string) => {
      onlineUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });

    socket.on('inventory:update', (data) => {
      io.emit('inventory:changed', data);
    });

    socket.on('order:status', (data) => {
      io.to(socket.id).emit('order:updated', data);
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) { onlineUsers.delete(userId); break; }
      }
    });
  });
};
