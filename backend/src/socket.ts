// import { Server } from "socket.io";
// import { Server as HttpServer } from "http";

// let io: Server;

// export const initSocket = (server: HttpServer, frontendUrl: string) => {
//   io = new Server(server, {
//     cors: {
//       origin: frontendUrl,
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);

//     socket.on("join_room", (data) => {
//       // Validate room name
//       if (!data || typeof data !== "string" || data.trim() === "") {
//         console.error(`Invalid room name from ${socket.id}:`, data);
//         socket.emit("error", { message: "Invalid room identifier" });
//         return;
//       }
//       socket.join(data);
//       console.log(`User with ID: ${socket.id} joined room: ${data}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("User Disconnected", socket.id);
//     });
//   });

//   return io;
// };

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io not initialized!");
//   }
//   return io;
// };
