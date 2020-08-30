const socket = io();
const formfield = document.querySelector("form");
const inputfield = document.querySelector("input");
const buttonfield = document.querySelector("#location");
const msgbutton = document.querySelector("send");
const messagefield = document.querySelector("#message");
const sidebarfield = document.querySelector(".chat_sidebar");

const autoscroll = () => {
		messagefield.scrollTop = messagefield.scrollHeight;
};
const sidebarcontents = (sidebar) => {
	const roomdet = sidebar.map(
		(el) => `<h2 id="users_name">${el.username}</h2> `
	);
	return roomdet;
};
socket.on("newUser", (msg) => {
	const html = `<div class="ind-message">
	<P class="user_name">${msg.username} - ${moment(msg.createdAt).format(
		"h:mm a"
	)}</P>
	<p class="message_info">${msg.text}</p>
	</div>`;
	messagefield.insertAdjacentHTML("afterbegin", html);
});
formfield.addEventListener("submit", (e) => {
	e.preventDefault();
	const msg = inputfield.value;
	socket.emit("chat", msg, () => {
		inputfield.value = "";
		inputfield.focus();
	});
});
socket.on("toall", (msg) => {
	const html = `<div class="ind-message">
	<P class="user_name">${msg.username}- ${moment(msg.createdAt).format(
		"h:mm a"
	)}</P>
	<p class="message_info">${msg.text}</p>
	</div>`;
	messagefield.insertAdjacentHTML("beforeend", html);
	autoscroll();
});

buttonfield.addEventListener("click", (e) => {
	if (!navigator.geolocation)
		alert("your browser does not support navigator geolocation");
	navigator.geolocation.getCurrentPosition((position) => {
		buttonfield.setAttribute("disabled", "disabled");
		socket.emit(
			"address",
			{
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			},
			() => {
				buttonfield.removeAttribute("disabled");
			}
		);
	});
});
socket.on("mylocation", (msg) => {
	const html = `<div class="ind-message">
	<P class="user_name">${msg.username} - ${moment(msg.createdAt).format(
		"h:mm a"
	)}</P>
	<p class="message_info"><a href=${
		msg.text
	} target="_blank">my current location</a></p>
	</div>`;
	messagefield.insertAdjacentHTML("beforeend", html);
	autoscroll();
});
const join = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.emit("join", join, (error) => {
	if (error) {
		alert(error);
		location.href = "/";
	}
});
socket.on("sidebar", (sidebar) => {
	sidebarfield.innerHTML = "";
	const html = `<div class="sidebar_contents">
	<h1 id="room_name">${sidebar.room}</h1>
	<div class="users_names">
	${sidebarcontents(sidebar.users).join("")}
	</div
	</div>`;
	sidebarfield.insertAdjacentHTML("beforeend", html);
});
