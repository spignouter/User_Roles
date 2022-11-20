const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 5000


const app = express()

app.use(express.json())

// назначаем прослушивание роутера
app.use("/auth", authRouter)

// название базы пишиться через слеш localhost:27017/t, t это имя BD 
const start = () => {
    try {
        mongoose.connect("mongodb://localhost:27017/t", () => {console.log("Это база")})
        app.listen(PORT, ()=>{console.log(`Сервер на порту ${PORT}`)})

    }catch (e){
        console.log(e)
    }
}

start()