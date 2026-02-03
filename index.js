import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './dbConfig/dbConfig.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import authRoutes from './routes/authRoutes/authRoutes.js'
import adminRoutes from './routes/adminRoutes/adminRoutes.js'
import productRoutes from './routes/productRoutes/productRoutes.js'
import getCategoryRoute from './routes/categoryRoute/getCategory.js'
import getLocationRoute from './routes/locationRoute/getLocation.js'
import favouriteRoutes from './routes/favouriteRoutes/favouriteRoutes.js'
import chatRoutes from "./routes/chatRoutes/chatRoutes.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()
dbConnect()
console.log("connected successfully with mongodb")

const app = express()

app.use(cors({
    origin: ['https://bazarify-website-khzm.vercel.app'],
    credentials: true
}
))

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['https://bazarify-website-khzm.vercel.app'],
        credentials: true
    }
})

app.use(express.json());
app.use(cookieParser())

app.use(authRoutes)

io.on('connection', (socket) => {
    console.log("a user connected", socket.id)
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId)
    })

    socket.on("sendMessage", (userData) => {
        io.to(userData.roomId).emit("receiveMessage", userData)
    })


    socket.on('disconnect', () => {
        console.log("user disconnected ", socket.id)
    })
})

app.use(productRoutes)
app.use(getCategoryRoute)
app.use(getLocationRoute)
app.use(favouriteRoutes)
app.use(chatRoutes)

app.use(adminRoutes)

// app.get("/", (req, res) => {
//     res.send("hello world")
// })

server.listen(process.env.PORT, () => {
    console.log(`app is listening on Port ${process.env.PORT}`)
})