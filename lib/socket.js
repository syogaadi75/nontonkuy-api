module.exports = function (io) {
    io.on("connection", (socket) => {
        socket.on("load_video", ({
            time,
            roomId
        }) => {
            socket.emit("load_video", {
                time,
                roomId
            });
        });

        socket.on("play", ({
            time,
            roomId
        }) => {
            socket.broadcast.emit("play", {
                time,
                roomId
            });
        });

        socket.on("pause", ({
            time,
            roomId
        }) => {
            socket.broadcast.emit("pause", {
                time,
                roomId
            });
        });

        socket.on("timeUpdate", ({
            time,
            roomId
        }) => {
            socket.broadcast.emit("timeUpdate", {
                time,
                roomId
            });
        });
    });
}