const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const router = require('./routes/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const socket = require('./socket/socket');

require('dotenv').config();
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT;

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
		credentials: true,
	},
});

app.use(express.static('public'));

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);

socket(io);

httpServer.listen(PORT, () => {
	console.log(`server started - http://localhost:${PORT}`);
});
