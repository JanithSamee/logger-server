const Tail = require("tail");
const process = require("node:process");

// Function to parse and print log entry
function parseLogEntry(logEntry) {
    const content = logEntry.split("][")[3].slice(0, -1);
    process.stdout.write(content);
    process.stdout.cursorTo(0);
}

// Function to tail the log file and process entries
function tailLogFile(logFilePath) {
    const tail = new Tail.Tail(logFilePath);

    tail.on("line", function (data) {
        // Detect start and end of log entry
        if (data.includes("[LOGSTART]")) {
            process.stdout.write("\n"); // Start of new log, add a newline
        } else if (data.includes("[LOGEND]")) {
            process.stdout.write("\n"); // End of log, add a newline
        } else {
            parseLogEntry(data); // Process regular log entry
        }
    });

    tail.on("error", function (error) {
        console.error("Error:", error);
    });
}

// Main function
function main() {
    const args = process.argv.slice(2);
    const logFilePath = "log.txt"; // Specify your log file path here

    if (args.includes("--tail")) {
        try {
            tailLogFile(logFilePath);
        } catch (error) {
            console.error("[ERROR]" + "[" + error + "]");
        }
    } else if (args.includes("--convert")) {
        // Code for converting log entries if needed
    } else {
        console.error(
            "[ERROR]" +
                "[Invalid arguments. Usage: node logReader.js --tail/--convert]"
        );
    }
}

main();
