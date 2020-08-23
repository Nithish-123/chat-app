const express = require("express");
const path = require("path");
const http = require("http");
const user = require("./utils/user");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const pathfile = path.join(__dirname, "./front-end");
const io = socketio(server);
const PORT = process.env.PORT || 9000;
const message = (text, username) => {
	return {
		text: text,
		createdAt: new Date().getTime(),
		username: username,
	};
};
app.use(express.static(pathfile));
io.on("connection", (socket) => {
	//new user

	// a new user has joined

	//room
	socket.on("join", (room, callback, callback2) => {
		const userinstance = user.addUser({ id: socket.id, ...room });
		if (userinstance.error) return callback(userinstance.error);
		socket.join(userinstance.roomname);
		socket.emit("newUser", message(` welcome`, userinstance.username));
		socket.broadcast
			.to(userinstance.roomname)
			.emit(
				"toall",
				message(`${userinstance.username} has joined`, userinstance.username)
			);
		io.to(userinstance.roomname).emit("sidebar", {
			room: userinstance.roomname,
			users: user.getUserByRooom(userinstance.roomname),
		});
	});
	//chat msg
	socket.on("chat", (msg, callback) => {
		const getuserbyid = user.getUser(socket.id);

		io.to(getuserbyid.roomname).emit(
			"toall",
			message(msg, getuserbyid.username)
		);
		callback();
	});
	//location
	socket.on("address", (position, callback) => {
		const getuserbyid = user.getUser(socket.id);
		io.to(getuserbyid.roomname).emit(
			"mylocation",
			message(
				`https://google.com/maps?q=${position.latitude},${position.longitude}`,
				getuserbyid.username
			)
		);
		callback();
	});
	//disconnected user
	socket.on("disconnect", () => {
		const removeduser = user.removeUser(socket.id);

		if (removeduser) {
			io.to(removeduser.roomname).emit(
				"toall",
				message(`${removeduser.username}   has left`, removeduser.username)
			);
			io.to(removeduser.roomname).emit("sidebar", {
				room: removeduser.roomname,
				users: user.getUserByRooom(removeduser.roomname),
			});
		}
	});
});

server.listen(PORT, () => {
	console.log("port is on " + PORT);
});
