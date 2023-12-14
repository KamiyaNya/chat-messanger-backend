const prismaInstance = require('../prisma/prismaInstance');

module.exports = function (io) {
	io.on('connection', (socket) => {
		console.log(socket.rooms);
		socket.on('chat-message', async (body) => {
			const { message, room, userId } = body;
			const messageFromBd = await prismaInstance.personalMessages.create({
				data: {
					message: message,
					roomUUID: room,
					userId: userId,
				},
			});
			socket.to(room).emit('send-message-to-client', messageFromBd);
			console.log(socket.rooms);
		});
		socket.on('join-room', (body) => {
			const { room } = body;
			socket.join(room);
			console.log(socket.rooms);
		});
	});

	io.on('disconnect', (socket) => {
		console.log(socket);
	});
};
