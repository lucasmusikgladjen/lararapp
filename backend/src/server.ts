import * as dotenv from "dotenv";

// Initialize dotenv so it reads our `.env`-file
dotenv.config();

import app from "./app";
import http from "http";
import Debug from "debug";

// Initialize debug instance
const debug = Debug("musikgladjen:server");

// Read port to start server on from ".env", otherwise default to port 3000
const PORT = Number(process.env.PORT) || 3000;

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(PORT, "0.0.0.0");

// Event listener for HTTP server "error" event.
server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    switch (error.code) {
        case "EACCES":
            console.error(`🦸🏻 Port ${PORT} requires elevated privileges`);
            debug(`🦸🏻 Port ${PORT} requires elevated privileges: %O`, error);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`🛑 Port ${PORT} is already in use`);
            debug(`🛑 Port ${PORT} is already in use: %O`, error);
            process.exit(1);
            break;
        default:
            debug(`🚨 Unknown error, rethrowing: %O`, error);
    }
});

// Event listener for HTTP server "listening" event.
server.on("listening", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Server available on network at http://0.0.0.0:${PORT}`);
});
