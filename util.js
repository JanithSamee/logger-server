function handleLog(logStream, data) {
    console.log(data);
    logStream.write(data);
}
module.exports = { handleLog };
