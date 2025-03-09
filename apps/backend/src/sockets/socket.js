import { Server } from "socket.io";
import camelcaseKeys from "camelcase-keys";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5174",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // io.use((socket, next) => {
  // 	const cookies = socket.handshake.headers.cookie;
  // 	const parsedCookies = cookie.parse(cookies);
  // 	const accessToken = parsedCookies?.accessToken;
  // 	if (accessToken) {
  // 		jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
  // 			if (err) {
  // 				// return responseHandler.unauthorized(
  // 				// 	res,
  // 				// 	undefined,
  // 				// 	"REFRESH_TOKEN_EXPIRED",
  // 				// );
  // 			}
  // 			socket.userId = decoded.userId;
  // 			return next();
  // 		});
  // 	}
  // 	return next(new Error("Authentication error"));
  // });

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("joinRestaurantOrderRoom", (data) => {
      console.log(data);
      if (["owner", "staff", "manager"].includes(data.role)) {
        const roomName = `restaurant-${data.restaurantId}-orders`;
        socket.join(roomName);
        console.log(`${socket.id} joined room: ${roomName}`);
      } else {
        console.log(`${socket.id} is not allowed to join room`, data.role);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const emitNewOrder = (restaurantId, orderData) => {
  const convertedOrderData = camelcaseKeys(orderData, { deep: true });
  io.to(`restaurant-${restaurantId}-orders`).emit("newOrder", convertedOrderData);
};
