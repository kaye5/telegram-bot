const axios = require('axios')
class TelegramAPI{
    constructor(token){
        this.token =  token
        this.request = axios.create({
            baseURL : `https://api.telegram.org/bot${this.token}`
        })
    }
    sendMessage(chat_id,text){        
        let option = {
            chat_id,
            text
        }
        return this.request.post('/sendMessage',option)
    }
    sendPhoto(chat_id,photo){
        let option = {
            chat_id,
            photo : photo.img,
            caption : photo.caption
        }
        return this.request.post('/sendPhoto',option)
    }
}
module.exports = TelegramAPI