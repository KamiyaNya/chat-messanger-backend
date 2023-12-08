const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const router = require('./routes/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT;

const io = new Server(httpServer, {
	/* options */
});

io.on('connection', (socket) => {
	// ...
});
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);

httpServer.listen(PORT, () => {
	console.log(`server started - http://localhost:${PORT}`);
});
