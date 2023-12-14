const prismaInstance = require('../prisma/prismaInstance');

module.exports = function (io) {
	io.on('connection', (socket) => {
		console.log(socket.rooms);

		socket.on('chat-message', async (body) => {
			console.log(body);
			const { message, room, userId } = body;
			await prismaInstance.personalMessages.create({
				data: {
					message: message,
					roomUUID: room,
					userId: userId,
				},
			});
			// socket.emit('send-message-to-client', body);
			socket.to(room).emit('send-message-to-client', body);
		});
		socket.on('join-room', (body) => {
			const { room } = body;
			socket.join(room);
		});
	});
};
