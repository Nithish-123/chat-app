const users = [];
//1.add user
const addUser = (det) => {
	det.username = det.username.trim().toLowerCase();
	det.roomname = det.roomname.trim().toLowerCase();

	if (!det.username || !det.roomname)
		return {
			error: "Username and Roomname are not provided",
		};

	const existingUser = users.find((user) => {
		return user.roomname === det.roomname && user.username === det.username;
	});

	if (existingUser)
		return {
			error: "Username is in use",
		};

	users.push(det);

	return det;
};
const removeUser = (det) => {
	const index = users.findIndex((user) => user.id === det);

	if (index !== -1) return users.splice(index, 1)[0];
};
const getUser = (det) => {
	if (!det) return { error: "Username undefined" };
	const getuser = users.find((user) => user.id === det);
	return getuser;
};
const getUserByRooom = (det) => {
	if (!det) return { error: "The rooomname is not created" };
	const roomusers = users.filter((user) => user.roomname === det);
	return roomusers;
};
module.exports = {
	addUser,
	getUser,
	getUserByRooom,
	removeUser,
};
