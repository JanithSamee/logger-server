require("dotenv").config();
const net = require("net");
const fs = require("fs");
const { handleLog } = require("./util");

const server = net.createServer((socket) => {
    const logStream = fs.createWriteStream("log.txt", { flags: "a" });
    const formattedDate = `[${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}]`;
    logStream.write(formattedDate + "[LOGSTART]\n");
    // Handle incoming data from the Android client
    socket.on("data", (data) => {
        const _data = data.toLocaleString();
        if (_data.startsWith("[LOG]")) {
            const formattedDate = `[${new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")}]`;
            handleLog(logStream, `${formattedDate}${data}`);
        }
    });

    // Handle client disconnection
    socket.on("end", () => {
        const formattedDate = `[${new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")}]`;
        logStream.write(formattedDate + "[LOGEND]\n");
        logStream.end();
    });

    // Handle errors
    socket.on("error", (err) => {
        console.error(`[ERROR][Socket error:][${err}]`);
        logStream.end();
    });
});

// Start the server and listen on port 4444
server.listen(process.env.PORT, () => {
    console.log("[INFO][Server started on port 4444]");
});
