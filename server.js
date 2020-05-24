require('dotenv').config()
require('./sendMessage')
const express = require('express');
const app = express();
app.use(express.json());

const Telegram = require('./Telegram')

app.post('/webhook',(req,res)=>{
    console.log('webhook req '+new Date())
    const tele = new Telegram(process.env.TOKEN)
    tele.webhook(req.body.message)
    res.sendStatus(200)
})

const PORT = 9002


app.listen(9002,()=>{
    console.log('Connected to '+ PORT);
})