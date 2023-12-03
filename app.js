const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const router = require('./routes/routes');

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT;


const io = new Server(httpServer, {
	/* options */
});

io.on('connection', (socket) => {
	// ...
});
app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);


httpServer.listen(PORT, () => {
	console.log(`server started - http://localhost:${PORT}`);
});
