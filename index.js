const express = require('express')
const app = express();
const http = require('http')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3001
const baseurl = process.env.BASE_URL

const { Server } = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: baseurl,
        methods: ["GET", "POST"],
    }
})

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`user with id ${socket.id} joined room : ${data}`)
    })
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("recieve_message", data)
    })
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })

})
server.listen(PORT, () => {
    console.log("server running")
})

